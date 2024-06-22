import type { Receipt } from "types/Receipt";
import type User from "types/User";

type Project = {
  name: string,
  key: string,
  receipts: Array<Receipt>,
  users: Array<User>,
};

export default Project;
