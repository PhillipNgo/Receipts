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
} from "@mantine/core";
import { useMemo, useState } from "react";
import SplitTypeSelector from "components/SplitTypeSelector";
import useReceiptData from "hooks/useReceiptData";

type FormData = {
  fileSrc: string,
  receiptType: SplitType,
  name: string,
};

const DEFAULT_FORM_VALUES: FormData = {
  fileSrc: null,
  receiptType: null,
  name: null,
};

export default function UploadModal({ opened, onClose }) {
  const [formData, setFormData] = useState(DEFAULT_FORM_VALUES);
  const receiptItems = useReceiptData();
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen={true}
      title="Upload receipt"
    >
      <Flex direction="column" gap="md">
        <SimpleGrid cols={{ base: 1, md: 2 }} verticalSpacing="xs">
          <FileInput
            accept="image/png,image/jpeg"
            label="Receipt"
            placeholder="Click to upload image"
            clearable
            onChange={(payload) =>
              setFormData((prevData) => ({
                ...prevData,
                fileSrc: payload == null ? null : URL.createObjectURL(payload),
              }))
            }
          />
          <SplitTypeSelector
            onChange={(splitType) =>
              setFormData((prevData) => ({ ...prevData, splitType }))
            }
          />
          <Input.Wrapper label="Name">
            <Input
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  name: e.target.value,
                }))
              }
            />
          </Input.Wrapper>
        </SimpleGrid>
        {formData.fileSrc && (
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Image
              alt="Receipt"
              fit="contain"
              radius="md"
              src={formData.fileSrc}
            />
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Cost</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {receiptItems.map((item) => (
                  <Table.Tr key={item.name}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.cost}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </SimpleGrid>
        )}
      </Flex>
    </Modal>
  );
}
