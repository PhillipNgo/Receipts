import { createContext } from "react";

type TProjectContext = {
  name: string,
  id: string,
  receipts: Array<{
    name: string,
    split_type: string,
    total: number,
  }>,
  users: Array<{
    email: string,
    name: string,
  }>,
};

const defaultValue: TProjectContext = {};

const ProjectContext = createContext(defaultValue);

export default ProjectContext;
