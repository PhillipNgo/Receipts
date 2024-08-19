import { createContext } from "react";

type TProjectContext = {
  project: {
    name: string,
    id: string,
    receipts: Array<{
      name: string,
      split_type: string,
      total: number,
      users: Array<{
        email: string,
        name: string,
      }>,
      receipt_items: Array<{
        name: string,
        split_type: string,
        total: Number,
        users: Array<{
          email: string,
          name: string,
        }>,
      }>,
    }>,
    users: Array<{
      email: string,
      name: string,
    }>,
  },
  userTotals: {
    email: string,
    total: email,
  },
};

const defaultValue: TProjectContext = {};

const ProjectContext = createContext(defaultValue);

export default ProjectContext;
