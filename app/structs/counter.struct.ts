import { Has } from "../../src/lib/v2/abilities";
import { u64 } from "../../src/lib/v2/types";

export interface Counter extends Has<"key" | "store"> {
  value: u64;
}
