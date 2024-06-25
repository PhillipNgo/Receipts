import { Grid } from "@mantine/core";
import ProjectTotalsCard from "./ProjectTotalsCard";
import ProjectReceiptsCard from "./ProjectReceiptsCard";

export default function ProjectOverview() {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <ProjectTotalsCard />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <ProjectReceiptsCard />
      </Grid.Col>
    </Grid>
  );
}
