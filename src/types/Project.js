import type { Receipt } from "types/Receipt";
import type Participant from "types/Participant";

type Project = {
  name: string,
  key: string,
  receipts: Array<Receipt>,
  participants: Array<Participant>,
};

export default Project;
