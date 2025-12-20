import { Module } from "../src/decorators";
import { String, u64 } from "../src/lib/v2/types";
import { Transfer } from "../src/lib/v2/transfer";
import { Person } from "./structs/person.struct";

@Module("wordi")
export class Writei {
  person?: Person;

  createPerson(name: String, lastname: String, age: u64) {
    let newPerson: Person = { name, lastname, age };
    Transfer.shareObject<Person>(newPerson);
  }
}
