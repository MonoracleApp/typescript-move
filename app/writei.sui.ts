import { Module, Public } from "../src/decorators";
import { String, u64, UID, ID } from "../src/lib/v2/types";
import { Transfer } from "../src/lib/v2/transfer";
import { Person } from "./structs/person.struct";
import { Counter } from "./structs/counter.struct";
import { SuiObject } from "../src/lib/v2/sui-object";
import { TxContext } from "../src/lib/v2/tx-context";
import { Winner } from "./structs/winner.struct";
import { SuiEvent } from "../src/lib/v2/event";
import { PersonCreatedEvent } from "./events/person-created.event";

@Module("version2")
export class Writei {
  person?: Person;
  counter?: Counter;
  winner?: Winner;

  @Public()
  createPerson(name: String, lastname: String, age: u64, ctx: TxContext) {
    let person_id: UID = SuiObject.createObjectId(ctx);
    let sender: string = TxContext.sender(ctx);

    SuiEvent.emit<PersonCreatedEvent>({
      person_id: SuiObject.uidToInner(person_id),
      name,
      lastname,
      age,
      owner: sender,
    });

    let newPerson: Person = {
      id: person_id,
      name,
      lastname,
      age,
    };

    Transfer.transfer<Person>(newPerson, sender);
  }

  @Public()
  createCounter(value: u64, ctx: TxContext) {
    let newCounter: Counter = { id: SuiObject.createObjectId(ctx), value };
    Transfer.shareObject<Counter>(newCounter);
  }

  @Public()
  createWinner(username: String, ctx: TxContext) {
    let newWinner: Winner = {
      id: SuiObject.createObjectId(ctx),
      username,
    };
    Transfer.freezeObject<Winner>(newWinner);
  }

  @Public()
  getUser(person: Person) {
    const name = person.name;
    const lastname = person.lastname;
    return {
      name,
      lastname,
    };
  }
}
