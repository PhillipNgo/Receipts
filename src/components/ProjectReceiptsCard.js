import { Button, ButtonGroup, Card, Flex, Table, Title } from "@mantine/core";
import { useContext, useState } from "react";
import ProjectContext from "contexts/ProjectContext";
import { useDisclosure } from "@mantine/hooks";
import ReceiptModal from "./ReceiptModal";

function roundNumber(num) {
  return Number(Math.round(num + "e+2") + "e-2");
}

export default function ProjectReceiptsCard({ selectedUser, setSelectedUser }) {
  const { project, receiptTotals, userTotals } = useContext(ProjectContext);
  const [opened, { open, close }] = useDisclosure(false);
  const [receiptId, setReceiptId] = useState();
  const selectedUserName = project.users.find(
    (user) => user.email == selectedUser
  )?.name;
  const receipts = project.receipts.filter((receipt) => {
    if (selectedUser == null || selectedUser == "") {
      return true;
    }
    switch (receipt.split_type) {
      case "SPLIT":
        return (
          receipt.users.length === 0 ||
          receipt.users.find((user) => user.email === selectedUser) != null
        );
      case "ITEMIZED":
        return receipt.receipt_items.some(
          (item) =>
            item.users.length === 0 ||
            item.users.find((user) => user.email === selectedUser) != null
        );
      case "PROPORTIONAL":
        return (
          receipt.user_proportions.find(
            (proportion) => proportion.user_id === selectedUser
          ) != null
        );
    }
  });
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
        <Flex justify="space-between" align="center">
          {selectedUserName != null ? (
            <Title order={4}>{selectedUserName}&apos;s portion</Title>
          ) : (
            <Title order={4}>All receipts</Title>
          )}
          {selectedUser != null && (
            <Button
              size="compact-sm"
              color="orange"
              variant="light"
              onClick={() => setSelectedUser(null)}
            >
              See all receipts
            </Button>
          )}
        </Flex>
      </Card.Section>
      <Table highlightOnHover>
        <Table.Tbody>
          {receipts.map((receipt) => (
            <Table.Tr
              onClick={() => {
                setReceiptId(receipt.id);
                open();
              }}
              key={receipt.id}
            >
              <Table.Td>{receipt.name}</Table.Td>
              <Table.Td ta="right">
                $
                {roundNumber(
                  selectedUser != null
                    ? receiptTotals
                        .find((receiptTotal) => receiptTotal.id === receipt.id)
                        .totals.find((total) => total.email === selectedUser)
                        .total
                    : receipt.total
                ).toFixed(2)}
              </Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td fw={700}>Total</Table.Td>
            <Table.Td fw={700} ta="right">{`$${roundNumber(
              selectedUser != null
                ? userTotals.find(
                    (userTotal) => userTotal.email === selectedUser
                  ).total
                : receipts.reduce(
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
