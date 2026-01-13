import { address } from "./types";

export class TxContext {
  ctx?: TxContext;

  static sender(ctx: TxContext): address {
    return "" as address;
  }
}
