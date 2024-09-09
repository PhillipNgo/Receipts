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

function roundNumber(num) {
  return Number(Math.round(num + "e+2") + "e-2");
}

export default function ProjectPaymentReceiptsModal({
  opened,
  onClose,
  payerId,
}) {
  const { project } = useContext(ProjectContext);
  const payer = project.users.find((user) => user.email === payerId);
  const receipts = project.receipts.filter(
    (receipt) => receipt.payer_id === payerId
  );

  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  if (payer == null) {
    return null;
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen={mediaQuery}
      size="xl"
      title={`${payer.name}'s receipts`}
      removeScrollProps={{
        allowPinchZoom: true,
      }}
    >
      <Table highlightOnHover>
        <Table.Tbody>
          {receipts.map((receipt) => (
            <Table.Tr key={receipt.id}>
              <Table.Td>{receipt.name}</Table.Td>
              <Table.Td ta="right">${receipt.total}</Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td fw={700}>Total</Table.Td>
            <Table.Td fw={700} ta="right">
              $
              {roundNumber(
                receipts.reduce(
                  (total, receipt) => total + Number(receipt.total),
                  0
                )
              )}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Modal>
  );
}
