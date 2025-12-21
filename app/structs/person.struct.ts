import { Has } from "../../src/lib/v2/abilities";
import { u64, String } from "../../src/lib/v2/types";

export interface Person extends Has<"key" | "store"> {
  name: String;
  lastname: String;
  age: u64;
}
