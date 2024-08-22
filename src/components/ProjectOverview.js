import { Grid } from "@mantine/core";
import ProjectTotalsCard from "./ProjectTotalsCard";
import ProjectReceiptsCard from "./ProjectReceiptsCard";
import { useState } from "react";

export default function ProjectOverview() {
  const [selectedUser, setSelectedUser] = useState();
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <ProjectTotalsCard setSelectedUser={setSelectedUser} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <ProjectReceiptsCard
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </Grid.Col>
    </Grid>
  );
}
