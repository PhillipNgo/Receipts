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
} from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import SplitTypeSelector from "components/SplitTypeSelector";
import useReceiptData from "hooks/useReceiptData";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import ProjectContext from "contexts/ProjectContext";
import UserMultiSelect from "./UserMultiSelect";

type FormData = {
  fileSrc: string,
  splitType: SplitType,
  name: string,
  total: number,
  users: Array<string>,
  receiptItems: Array<ReceiptItem>,
  userProportions: Array<UserProportion>,
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
  name: null,
  total: null,
  users: [],
};

const DEFAULT_FORM_VALUES: FormData = {
  fileSrc: null,
  splitType: null,
  name: null,
  total: null,
  users: [],
  receiptItems: [],
  userProportions: [],
};

function roundNumber(num) {
  return Number(Math.round(num + "e+2") + "e-2");
}

export default function ReceiptModal({ opened, onClose, receiptId }) {
  const { project } = useContext(ProjectContext);
  const receipt = project.receipts.find((receipt) => receipt.id === receiptId);
  const originalFormData = {
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
    userProportions: receipt.user_proportions,
  };
  const [formData, setFormData] = useState(originalFormData);
  const [
    isImageOpened,
    { toggle: toggleImage, open: openImage, close: closeImage },
  ] = useDisclosure(true);
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  if (receipt == null) {
    return null;
  }

  const isFormValid = () => {
    if (
      JSON.stringify(formData) === JSON.stringify(originalFormData) ||
      formData.name == null ||
      formData.total == null ||
      formData.total <= 0 ||
      formData.splitType == null
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
          )
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

  const subTotal = roundNumber(
    formData.receiptItems.reduce((a, b) => a + (b.total ?? 0), 0)
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen={mediaQuery}
      size="xl"
      title="Upload receipt"
    >
      <Flex direction="column" gap="md">
        <SimpleGrid cols={{ base: 1, md: 2 }} verticalSpacing="xs">
          <Input.Wrapper label="Name">
            <Input
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
                  splitType === "ITEMIZED" ? [{ ...DEFAULT_RECEIPT_ITEM }] : [],
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
          <FileInput
            accept="image/png,image/jpeg"
            label="Receipt"
            placeholder="Click to upload image"
            clearable
            onChange={(payload) => {
              setFormData((prevData) => ({
                ...prevData,
                fileSrc: payload == null ? null : URL.createObjectURL(payload),
              }));
              if (payload != null) {
                openImage();
              } else {
                closeImage();
              }
            }}
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
                            prevData.receiptItems[index].name = e.target.value;
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
          {formData.fileSrc == null ? (
            <div />
          ) : (
            <Button
              variant="default"
              onClick={toggleImage}
              disabled={formData.fileSrc == null}
            >
              {isImageOpened ? "Hide receipt" : "Show receipt"}
            </Button>
          )}
          <Button variant="primary" onClick={onClose} disabled={!isFormValid()}>
            Save
          </Button>
        </Flex>
        <Collapse in={formData.fileSrc != null && isImageOpened}>
          <Image
            alt="Receipt"
            fit="contain"
            radius="md"
            src={formData.fileSrc}
          />
        </Collapse>
      </Flex>
    </Modal>
  );
}
