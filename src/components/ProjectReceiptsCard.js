import { Card, Table, Title } from "@mantine/core";
import { useContext, useState } from "react";
import ProjectContext from "contexts/ProjectContext";
import { useDisclosure } from "@mantine/hooks";
import ReceiptModal from "./ReceiptModal";

function roundNumber(num) {
  return Number(Math.round(num + "e+2") + "e-2");
}

export default function ProjectReceiptsCard() {
  const { project } = useContext(ProjectContext);
  const [opened, { open, close }] = useDisclosure(false);
  const [receiptId, setReceiptId] = useState();
  return (
    <Card mt="md" radius="lg">
      {receiptId && (
        <ReceiptModal
          key={receiptId}
          opened={opened}
          onClose={close}
          receiptId={receiptId}
        />
      )}
      <Card.Section inheritPadding py="sm">
        <Title order={4}>Receipts</Title>
      </Card.Section>
      <Table highlightOnHover>
        <Table.Tbody>
          {project.receipts.map((receipt) => (
            <Table.Tr
              onClick={() => {
                setReceiptId(receipt.id);
                open();
              }}
              key={receipt.name}
            >
              <Table.Td>{receipt.name}</Table.Td>
              <Table.Td ta="right">
                ${roundNumber(receipt.total).toFixed(2)}
              </Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td fw={700}>Total</Table.Td>
            <Table.Td fw={700} ta="right">{`$${roundNumber(
              project.receipts.reduce(
                (a, b) => a + Math.round(b.total * 100) / 100,
                0
              )
            )}`}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  );
}
