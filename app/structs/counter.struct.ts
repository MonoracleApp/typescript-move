import { Has } from "../../src/lib/v2/abilities";
import { u64, UID } from "../../src/lib/v2/types";

export interface Counter extends Has<"key" | "store"> {
  id: UID;
  value: u64;
}
