import { createContext } from "react";

type TProjectContext = {
  project: {
    name: string,
    id: string,
    receipts: Array<{
      id: string,
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
      user_proportions: Array<{
        user_id: string,
        weight: number,
      }>,
    }>,
    users: Array<{
      email: string,
      name: string,
    }>,
  },
  receiptTotals: Array<{
    id: string,
    totals: Array<{
      email: string,
      total: number,
    }>,
  }>,
  userTotals: Array<{
    email: string,
    total: number,
  }>,
};

const defaultValue: TProjectContext = {};

const ProjectContext = createContext(defaultValue);

export default ProjectContext;
