import { Has, Module, Move, Write } from "../decorators";
import { Mut, Primitive, sui } from "../types";
import { exec } from "../utils";

@Module("hello_world")
class Writing {
  @Has(["key", "store"])
  User = {
    name: sui.string,
    status: sui.bool,
    age: sui.u8,
  };

  @Has(["key", "store"])
  Admin = {
    status: sui.bool,
  };

  @Has(["key", "store"])
  Counter = {
    value: sui.u32,
  };

  @Has(["key", "store"])
  OtherCounter = {
    value: sui.u32,
  };

  @Write("User")
  create_user() {}

  @Write("Admin")
  create_admin() {}

  @Write("Counter")
  create_counter() {}

  @Write("OtherCounter")
  create_other_counter() {}

  @Move()
  incrementCounter(
    counterItem: Mut<"Counter">,
    otherCounterItem: Mut<"Counter">
  ) {
    exec`
            counterItem.value = counterItem.value + 1;
            otherCounterItem.value = otherCounterItem.value + 1;
        `;
  }

  @Move()
  multiplyCounter(
    counterItem: Mut<"Counter">,
    otherCounterItem: Mut<"Counter">
  ) {
    exec`
            counterItem.value = counterItem.value * 2;
            otherCounterItem.value = otherCounterItem.value * 2;
        `;
  }

  @Move()
  changeName(userObj: Mut<"User">, nameUser: Primitive<"string::String">) {
    exec`
            userObj.name = nameUser;
        `;
  }
}

export default Writing;
