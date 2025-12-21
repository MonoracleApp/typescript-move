export class TxContext {
  ctx?: TxContext;

  static sender(ctx: TxContext): any {
    return "address";
  }
}
