import { CreateSessionOutputFilterSensitiveLog } from "@aws-sdk/client-s3";
import { Card, Grid, Table, Title } from "@mantine/core";
import ProjectContext from "contexts/ProjectContext";
import { useContext, useMemo, useState } from "react";
import ProjectPaymentReceiptsModal from "./ProjectPaymentReceiptsModal";
import { useDisclosure } from "@mantine/hooks";

function roundNumber(num) {
  return Number(Math.round(num + "e+2") + "e-2");
}

export default function ProjectPayments() {
  const { project, userTotals } = useContext(ProjectContext);
  const [selectedPayer, setSelectedPayer] = useState();
  const [opened, { open, close }] = useDisclosure(false);

  const payerTotals = useMemo(() => {
    let totals = project.users.map((user) => ({
      email: user.email,
      total: 0,
    }));
    project.receipts.forEach((receipt) => {
      const userTotal = totals.find(
        (payerTotal) => payerTotal.email === receipt.payer_id
      );
      userTotal.total += Number(receipt.total);
    });

    totals = totals
      .filter((payerTotal) => payerTotal.total > 0)
      .sort((a, b) => b.total - a.total);
    return totals;
  }, [project]);

  const [payerTotalsFromOthers, balances] = useMemo(() => {
    let payerTotalsCopy = JSON.parse(JSON.stringify(payerTotals));
    let balances = JSON.parse(JSON.stringify(userTotals));
    payerTotalsCopy.forEach((payerTotal) => {
      const payerBalance = balances.find(
        (balance) => balance.email === payerTotal.email
      );
      if (payerBalance.total <= payerTotal.total) {
        payerTotal.total -= payerBalance.total;
        balances = balances.filter(
          (balance) => balance.email != payerTotal.email
        );
      } else {
        payerBalance.total -= payerTotal.total;
        payerTotal.total = 0;
      }
    });
    payerTotalsCopy = payerTotalsCopy
      .filter((payerTotal) => payerTotal.total > 0)
      .sort((a, b) => b.total - a.total);
    balances = balances
      .filter((balance) => balance.total > 0)
      .sort((a, b) => a.total - b.total);
    return [payerTotalsCopy, balances];
  }, [payerTotals, userTotals]);

  const finalPayments = useMemo(() => {
    const payments = [];
    const balancesCopy = JSON.parse(JSON.stringify(balances));
    const payerTotalsCopy = JSON.parse(JSON.stringify(payerTotalsFromOthers));
    const iter = payerTotalsCopy.entries();
    let payerTotalEntry = iter.next();
    balancesCopy.forEach((balance) => {
      while (balance.total > 0 && !payerTotalEntry.done) {
        const payerTotal = payerTotalEntry.value[1];
        if (balance.total <= payerTotal.total) {
          payments.push({
            to: payerTotal.email,
            from: balance.email,
            amount: balance.total,
          });
          payerTotal.total -= balance.total;
          balance.total = 0;
        } else {
          payments.push({
            to: payerTotal.email,
            from: balance.email,
            amount: payerTotal.total,
          });
          balance.total -= payerTotal.total;
          payerTotalEntry = iter.next();
        }
      }
    });
    return payments;
  }, [payerTotalsFromOthers, balances]);

  return (
    <Grid>
      <ProjectPaymentReceiptsModal
        opened={opened}
        onClose={close}
        payerId={selectedPayer}
        key={selectedPayer}
      />
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card mt="md" radius="lg">
          <Card.Section inheritPadding py="sm">
            <Title order={4}>Final payments</Title>
          </Card.Section>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>From</Table.Th>
                <Table.Th>To</Table.Th>
                <Table.Th>Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {finalPayments.map(({ from, to, amount }) => (
                <Table.Tr key={`${from}-${to}`}>
                  <Table.Td>
                    {project.users.find((user) => user.email === from).name}
                  </Table.Td>
                  <Table.Td>
                    {project.users.find((user) => user.email === to).name}
                  </Table.Td>
                  <Table.Td>${roundNumber(amount).toFixed(2)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card mt="md" radius="lg">
          <Card.Section inheritPadding py="sm">
            <Title order={4}>Receipt totals</Title>
          </Card.Section>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Payer</Table.Th>
                <Table.Th>Paid</Table.Th>
                <Table.Th>Owed</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {payerTotals.map((payerTotal) => (
                <Table.Tr
                  onClick={() => {
                    setSelectedPayer(payerTotal.email);
                    open();
                  }}
                  key={payerTotal.email}
                >
                  <Table.Td>
                    {
                      project.users.find(
                        (user) => user.email === payerTotal.email
                      ).name
                    }
                  </Table.Td>
                  <Table.Td>${payerTotal.total}</Table.Td>
                  <Table.Td>
                    $
                    {roundNumber(
                      finalPayments
                        .filter((payment) => payment.to === payerTotal.email)
                        .reduce((total, a) => total + a.amount, 0)
                    ).toFixed(2)}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
