import { Card, Table, Title } from "@mantine/core";
import { useContext } from "react";
import ProjectContext from "contexts/ProjectContext";

export default function ProjectReceiptsCard() {
  const project = useContext(ProjectContext);

  return (
    <Card mt="md" radius="lg">
      <Card.Section inheritPadding py="sm">
        <Title order={4}>Receipts</Title>
      </Card.Section>
      <Table highlightOnHover>
        <Table.Tbody>
          {project.receipts.map((receipt) => (
            <Table.Tr key={receipt.name}>
              <Table.Td>{receipt.name}</Table.Td>
              <Table.Td ta="right">
                ${(Math.round(receipt.total * 100) / 100).toFixed(2)}
              </Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td fw={700}>Total</Table.Td>
            <Table.Td ta="right">{`$${project.receipts.reduce(
              (a, b) => a + Math.round(b.total * 100) / 100,
              0
            )}`}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  );
}
