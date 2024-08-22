"use client";

import type SplitType from "types/SplitType";

import {
  Flex,
  FileInput,
  Image,
  Table,
  SimpleGrid,
  Select,
  Input,
  Modal,
  useMantineTheme,
  NumberInput,
  Text,
  Button,
  Divider,
  CloseIcon,
  ActionIcon,
  TextInput,
  Collapse,
  Group,
  ButtonGroup,
  VisuallyHidden,
} from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import SplitTypeSelector from "components/SplitTypeSelector";
import useReceiptData from "hooks/useReceiptData";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import ProjectContext from "contexts/ProjectContext";
import UserMultiSelect from "./UserMultiSelect";
import upsertReceipt from "actions/upsertReceipt";
import deleteReceipt from "actions/deleteReceipt";
import UserSelect from "./UserSelect";

const IMAGE_URI = "https://p-receipts-bucket.s3.us-east-2.amazonaws.com";

type FormData = {
  splitType: SplitType,
  name: string,
  total: number,
  users: Array<string>,
  receiptItems: Array<ReceiptItem>,
  userProportions: Array<UserProportion>,
  payer: string,
};

type ReceiptItem = {
  name: string,
  total: number,
  users: Array<string>,
};

type UserProportion = {
  user_id: string,
  weight: number,
};

const DEFAULT_RECEIPT_ITEM: ReceiptItem = {
  name: "",
  total: null,
  users: [],
};

const DEFAULT_FORM_VALUES: FormData = {
  splitType: null,
  name: "",
  total: null,
  users: [],
  receiptItems: [],
  userProportions: [],
  payer: "",
};

function roundNumber(num) {
  return Number(Math.round(num + "e+2") + "e-2");
}

export default function ReceiptModal({ opened, onClose, receiptId }) {
  const { project } = useContext(ProjectContext);
  const receipt = project.receipts.find((receipt) => receipt.id === receiptId);

  const originalFormData =
    receipt == null
      ? { ...DEFAULT_FORM_VALUES }
      : {
          ...DEFAULT_FORM_VALUES,
          splitType: receipt.split_type,
          name: receipt.name,
          total: Number(receipt.total),
          users: receipt.users.map((user) => user.email),
          receiptItems: receipt.receipt_items.map((receiptItem) => ({
            name: receiptItem.name,
            total: Number(receiptItem.total),
            users: receiptItem.users.map((user) => user.email),
          })),
          userProportions: receipt.user_proportions.map((userProportion) => ({
            user_id: userProportion.user_id,
            weight: userProportion.weight,
          })),
          payer: receipt.payer_id,
        };
  const originalImage =
    receipt?.image_id == null ? null : `${IMAGE_URI}/${receipt.image_id}`;

  const [formData, setFormData] = useState(originalFormData);
  const [formFile, setFormFile] = useState(originalImage);
  const [
    isImageOpened,
    { toggle: toggleImage, open: openImage, close: closeImage },
  ] = useDisclosure(true);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  if (receipt == null && receiptId != null) {
    return null;
  }

  const subTotal = roundNumber(
    formData.receiptItems.reduce((a, b) => a + (b.total ?? 0), 0)
  );
  const isFormValid = () => {
    if (
      JSON.stringify(formData) === JSON.stringify(originalFormData) ||
      formData.name == null ||
      formData.name == "" ||
      formData.total == null ||
      formData.total <= 0 ||
      formData.splitType == null ||
      formData.payer == null ||
      formData.payer == "" ||
      formFile == null
    ) {
      return false;
    }
    switch (formData.splitType) {
      case "SPLIT":
        return true;
      case "ITEMIZED":
        return (
          formData.receiptItems.length > 0 &&
          formData.receiptItems.every(
            (item) => item.name != null && item.name !== "" && item.total > 0
          ) &&
          subTotal <= formData.total
        );
      case "PROPORTIONAL":
        return (
          formData.userProportions.length > 0 &&
          formData.userProportions.every(
            (proportion) => proportion.user_id != null && proportion.weight > 0
          )
        );
      default:
        return false;
    }
  };

  const upsert = upsertReceipt.bind(null, receipt?.id, project.id, formData);
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen={mediaQuery}
      size="xl"
      title="Upload receipt"
      closeOnClickOutside={!isLoading}
      closeOnEscape={!isLoading}
      withCloseButton={!isLoading}
      removeScrollProps={{
        allowPinchZoom: true,
      }}
    >
      <form
        onSubmit={() => setIsLoading(true)}
        action={async (data) => {
          await upsert(data);
          if (receipt?.id == null) {
            setFormData({ ...DEFAULT_FORM_VALUES });
            setFormFile(null);
          }
          setIsLoading(false);
          onClose();
        }}
      >
        <Flex direction="column" gap="md">
          <SimpleGrid cols={{ base: 1, md: 2 }} verticalSpacing="xs">
            <Input.Wrapper label="Name">
              <Input
                placeholder="Enter receipt name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
              />
            </Input.Wrapper>
            <SplitTypeSelector
              onChange={(splitType) =>
                setFormData((prevData) => ({
                  ...prevData,
                  splitType,
                  users: [],
                  receiptItems:
                    splitType === "ITEMIZED"
                      ? [{ ...DEFAULT_RECEIPT_ITEM }]
                      : [],
                }))
              }
              value={formData.splitType}
            />
            <NumberInput
              label="Total"
              placeholder="Receipt total"
              clampBehavior="strict"
              prefix="$"
              min={0}
              decimalScale={2}
              value={formData.total}
              onChange={(total) =>
                setFormData((prevData) => ({
                  ...prevData,
                  total,
                }))
              }
            />
            <UserSelect
              label="Payer"
              value={formData.payer}
              onChange={(payer) =>
                setFormData((prevData) => ({
                  ...prevData,
                  payer,
                }))
              }
            />
          </SimpleGrid>
          {formData.splitType === "SPLIT" && (
            <SimpleGrid cols={{ base: 1, md: 2 }} verticalSpacing="xs">
              <UserMultiSelect
                label="Split between"
                value={formData.users}
                onChange={(users) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    users,
                  }))
                }
              />
              <Input.Wrapper label="Per person cost">
                <Input
                  disabled
                  value={`$${roundNumber(
                    formData.total /
                      (formData.users.length === 0
                        ? project.users.length
                        : formData.users.length)
                  )}`}
                />
              </Input.Wrapper>
            </SimpleGrid>
          )}
          {formData.splitType === "ITEMIZED" &&
            formData.receiptItems.length > 0 && (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Split</Table.Th>
                    <Table.Th>Cost</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {formData.receiptItems.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <TextInput
                          placeholder="Enter name"
                          value={item.name ?? ""}
                          onChange={(e) => {
                            setFormData((prevData) => {
                              prevData.receiptItems[index].name =
                                e.target.value;
                              return {
                                ...prevData,
                              };
                            });
                          }}
                        />
                      </Table.Td>
                      <Table.Td>
                        <UserMultiSelect
                          value={item.users}
                          onChange={(value) => {
                            setFormData((prevData) => {
                              prevData.receiptItems[index].users = value;
                              return {
                                ...prevData,
                              };
                            });
                          }}
                        />
                      </Table.Td>
                      <Table.Td maw={100}>
                        <NumberInput
                          placeholder="Receipt total"
                          clampBehavior="strict"
                          prefix="$"
                          min={0}
                          decimalScale={2}
                          value={item.total}
                          onChange={(value) => {
                            setFormData((prevData) => {
                              prevData.receiptItems[index].total = value;
                              return {
                                ...prevData,
                              };
                            });
                          }}
                        />
                      </Table.Td>
                      <Table.Td maw={30}>
                        <ActionIcon
                          onClick={() => {
                            setFormData((prevData) => {
                              const newItems = prevData.receiptItems.filter(
                                (item, ind) => ind !== index
                              );
                              return {
                                ...prevData,
                                receiptItems: newItems,
                              };
                            });
                          }}
                          variant="default"
                        >
                          <CloseIcon />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  <Table.Tr>
                    <Table.Td valign="top">
                      <Button
                        size="compact-sm"
                        color="orange"
                        disabled={isLoading}
                        onClick={() => {
                          setFormData((prevData) => {
                            return {
                              ...prevData,
                              receiptItems: [
                                ...prevData.receiptItems,
                                { ...DEFAULT_RECEIPT_ITEM },
                              ],
                            };
                          });
                        }}
                      >
                        + Add item
                      </Button>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text fw={700}>Subtotal</Text>
                      <Text fw={700}>Tax/Service</Text>
                    </Table.Td>
                    <Table.Td ta="left">
                      <Text fw={700}>${subTotal}</Text>
                      <Text fw={700}>
                        $
                        {formData == null || formData.total == 0
                          ? 0
                          : roundNumber(formData.total - subTotal)}{" "}
                        (
                        {formData == null || formData.total == 0
                          ? 0
                          : roundNumber(
                              ((formData.total - subTotal) / subTotal) * 100
                            )}
                        %)
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            )}
          {formData.splitType === "PROPORTIONAL" && (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Weight</Table.Th>
                  <Table.Th>Portion</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {project.users.map((user) => {
                  const weight =
                    formData.userProportions.find(
                      (value) => value.user_id === user.email
                    )?.weight ?? 0;
                  const proportionsTotal = formData.userProportions.reduce(
                    (a, b) => a + b.weight ?? 0,
                    0
                  );
                  const proportion = weight / proportionsTotal;
                  return (
                    <Table.Tr key={user.email}>
                      <Table.Td>{user.name}</Table.Td>
                      <Table.Td maw={50}>
                        <NumberInput
                          placeholder="Enter weight"
                          clampBehavior="strict"
                          min={0}
                          max={1000}
                          decimalScale={0}
                          value={weight}
                          onChange={(value) => {
                            setFormData((prevData) => {
                              if (value == null || value == 0) {
                                const newProportions =
                                  prevData.userProportions.filter(
                                    (proportion) =>
                                      proportion.user_id !== user.email
                                  );
                                return {
                                  ...prevData,
                                  userProportions: newProportions,
                                };
                              }
                              const userProportion =
                                prevData.userProportions.find(
                                  (proportion) =>
                                    proportion.user_id === user.email
                                );
                              if (userProportion == null) {
                                prevData.userProportions.push({
                                  user_id: user.email,
                                  weight: value,
                                });
                              } else {
                                userProportion.weight = value;
                              }
                              return {
                                ...prevData,
                              };
                            });
                          }}
                        />
                      </Table.Td>
                      <Table.Td maw={100}>
                        $
                        {isNaN(proportion)
                          ? 0
                          : roundNumber(formData.total * proportion)}{" "}
                        ({weight == 0 ? 0 : roundNumber(100 * proportion)}
                        %)
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          )}
          <Divider />
          <Flex justify="space-between">
            <ButtonGroup>
              <FileInput
                name="image"
                accept="image/png,image/jpeg"
                clearable
                placeholder="Click to upload image"
                onChange={(file) => {
                  setFormFile(file == null ? null : URL.createObjectURL(file));
                  if (file != null) {
                    openImage();
                  } else {
                    closeImage();
                  }
                }}
              />
              {formFile != null && (
                <Button
                  variant="default"
                  onClick={toggleImage}
                  disabled={formFile == null}
                >
                  {isImageOpened ? "Hide" : "Show"}
                </Button>
              )}
            </ButtonGroup>
            <Group>
              {receipt != null && (
                <Button
                  variant="default"
                  type="submit"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (
                      confirm("Are you sure? This receipt will be deleted.")
                    ) {
                      setIsLoading(true);
                      await deleteReceipt(receipt.id, project.id);
                      setIsLoading(false);
                      setFormData(originalFormData);
                      onClose();
                    }
                  }}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="primary"
                type="submit"
                disabled={!isFormValid() || isLoading}
                loading={isLoading}
              >
                Save
              </Button>
            </Group>
          </Flex>
          <Collapse in={formFile != null && isImageOpened}>
            <Image alt="Receipt" fit="contain" radius="md" src={formFile} />
          </Collapse>
        </Flex>
      </form>
    </Modal>
  );
}
