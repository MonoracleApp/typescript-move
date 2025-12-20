import { Module } from "./decorators";
import { String, u64 } from "./lib/v2/types";
import { Transfer } from "./lib/v2/transfer";
import { Has } from "./lib/v2/abilities";

interface Person extends Has<"copy" | "key" | "store"> {
  name: String;
  lastname: String;
  age: u64;
}

@Module("wordi")
export class Writei {
  person?: Person;

  createPerson(name: String, lastname: String, age: u64) {
    let newPerson: Person = { name, lastname, age };
    Transfer.shareObject<Person>(newPerson);
  }
}
