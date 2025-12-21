import { TxContext } from "./tx-context";
import { UID, ID } from "./types";

export class SuiObject {
  static createObjectId(ctx: TxContext): UID {
    return "UID";
  }

  static uidToInner(uid: UID): ID {
    return "ID";
  }
}
