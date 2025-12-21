import { Has } from "../../src/lib/v2/abilities";
import { String, u64, ID } from "../../src/lib/v2/types";

export interface PersonCreatedEvent extends Has<"copy" | "drop"> {
  person_id: ID;
  name: String;
  lastname: String;
  age: u64;
  owner: any;
}
