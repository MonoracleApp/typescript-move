import { TxContext } from "./tx-context";
import { UID } from "./types";

export class SuiObject {
  static createObjectId(ctx: TxContext): UID {
    return "UID";
  }
}
