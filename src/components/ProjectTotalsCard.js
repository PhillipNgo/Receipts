import { Card, Table, Title } from "@mantine/core";
import { useContext } from "react";
import ProjectContext from "contexts/ProjectContext";

function roundNumber(num) {
  return Number(Math.round(num + "e+2") + "e-2");
}

export default function ProjectTotalsCard({ setSelectedUser }) {
  const { project, userTotals } = useContext(ProjectContext);
  return (
    <Card mt="md" radius="lg">
      <Card.Section inheritPadding py="sm">
        <Title order={4}>Totals</Title>
      </Card.Section>
      <Table highlightOnHover>
        <Table.Tbody>
          {project.users.map((user) => (
            <Table.Tr
              key={user.name}
              onClick={() => setSelectedUser(user.email)}
            >
              <Table.Td>{user.name}</Table.Td>
              <Table.Td ta="right">
                {`$${userTotals
                  .find((userTotal) => userTotal.email === user.email)
                  .total.toFixed(2)}`}
              </Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td fw={700}>Total</Table.Td>
            <Table.Td fw={700} ta="right">{`$${roundNumber(
              userTotals.reduce((a, b) => a + b.total, 0)
            )}`}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  );
}
