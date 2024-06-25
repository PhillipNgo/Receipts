import { Card, Table, Title } from "@mantine/core";
import { useContext, useMemo } from "react";
import ProjectContext from "contexts/ProjectContext";

export default function ProjectTotalsCard() {
  const project = useContext(ProjectContext);
  const userTotals = useMemo(
    () =>
      project.users.map((user) => {
        const total = project.receipts.reduce((prevValue, receipt) => {
          if (receipt.split_type === "SPLIT") {
            return prevValue + receipt.total / project.users.length;
          }
          return prevValue;
        }, 0);
        return {
          email: user.email,
          total,
        };
      }),
    [project]
  );
  return (
    <Card mt="md" radius="lg">
      <Card.Section inheritPadding py="sm">
        <Title order={4}>Totals</Title>
      </Card.Section>
      <Table highlightOnHover>
        <Table.Tbody>
          {project.users.map((user) => (
            <Table.Tr key={user.name}>
              <Table.Td>{user.name}</Table.Td>
              <Table.Td ta="right">
                {`$${(
                  Math.round(
                    userTotals.find(
                      (userTotal) => userTotal.email === user.email
                    ).total * 100
                  ) / 100
                ).toFixed(2)}`}
              </Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td fw={700}>Total</Table.Td>
            <Table.Td ta="right">{`$${userTotals.reduce(
              (a, b) => a + b.total,
              0
            )}`}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  );
}
