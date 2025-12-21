import { TxContext } from "./tx-context";

export class Transfer {
  static shareObject<T>(type: T) {}
  static transfer<T>(obj: T, recipient: string) {}
  static freezeObject<T>(obj: T) {}
}
