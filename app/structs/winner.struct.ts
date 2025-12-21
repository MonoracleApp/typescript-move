import { Has } from "../../src/lib/v2/abilities";
import { String, UID } from "../../src/lib/v2/types";

export interface Winner extends Has<"key" | "store"> {
  id: UID;
  username: String;
}
