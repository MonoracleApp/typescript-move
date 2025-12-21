import { Module } from "../src/decorators";
import { String, u64 } from "../src/lib/v2/types";
import { Transfer } from "../src/lib/v2/transfer";
import { Person } from "./structs/person.struct";
import { Counter } from "./structs/counter.struct";

@Module("version2")
export class Writei {
  person?: Person;
  counter?: Counter;

  createPerson(name: String, lastname: String, age: u64) {
    let newPerson: Person = { name, lastname, age };
    Transfer.shareObject<Person>(newPerson);
  }

  createCounter(value: u64) {
    let newCounter: Counter = { value };
    Transfer.shareObject<Counter>(newCounter);
  }
}
