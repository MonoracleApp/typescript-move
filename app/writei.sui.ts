import { Module } from "../src/decorators";
import { String, u64 } from "../src/lib/v2/types";
import { Transfer } from "../src/lib/v2/transfer";
import { Person } from "./structs/person.struct";
import { Counter } from "./structs/counter.struct";
import { SuiObject } from "../src/lib/v2/sui-object";
import { TxContext } from "../src/lib/v2/tx-context";

@Module("version2")
export class Writei {
  person?: Person;
  counter?: Counter;

  createPerson(name: String, lastname: String, age: u64, ctx: TxContext) {
    let newPerson: Person = {
      id: SuiObject.createObjectId(ctx),
      name,
      lastname,
      age,
    };
    Transfer.transfer<Person>(newPerson, TxContext.sender(ctx));
  }

  createCounter(value: u64, ctx: TxContext) {
    let newCounter: Counter = { id: SuiObject.createObjectId(ctx), value };
    Transfer.shareObject<Counter>(newCounter);
  }
}
