import { parseStringArray } from ".";

const handleTransfer = (decorators: any, struct: string, writeValues: any, variable: string, methodName: string) => {
  const TRANSFER_METHOD = decorators.find((x: any) => x.name === 'Transfer')

  if(!TRANSFER_METHOD){
    return ''
  }

  let transferMeFn = ''
  let transferToFn = ''

  const z = parseStringArray(TRANSFER_METHOD.arguments[0])
  const HAS_ME = z.find((x: any) => x === 'me')
  const HAS_RECEIVER = z.find((x: any) => x === 'receiver')

  if(HAS_ME){
    transferMeFn = `
        #[allow(lint(self_transfer))]
        public fun ${methodName}_transfer(${writeValues[struct].functionArgs}){
          let nft = mint_${variable}(name, description, image_url, ctx);
          let sender = tx_context::sender(ctx);
          transfer::transfer(nft, sender);
        }`
  }

  if(HAS_RECEIVER){
    transferToFn = `
      #[allow(lint(self_transfer))]
      public fun ${methodName}_transfer_to(recipient: address, ${writeValues[struct].functionArgs}){
        let nft = mint_${variable}(name, description, image_url, ctx);
        transfer::transfer(nft, recipient);
      }
    `
  }

  return `
    ${transferMeFn}
    ${transferToFn}
  `
}

export const handleNftMethods = (methods: any, writeValues: any) => {

  const USE = `
    use sui::display;
    use sui::package;
  `

  let INITS:string[] = []

  const nftMethods = methods.filter((x: any) =>
    x.decorators.find((y: any) => y.name === "Mint")
  );

  const NFT_METHODS = nftMethods.map((method: any) => {


    const struct = method.decorators[0].arguments[0].replace(/'/g, "");
    const variable = struct.toLowerCase();
    const fnName = method.name

    const transferMethod = handleTransfer(method.decorators, struct, writeValues, variable, fnName)
    const RAW_VALUES = writeValues[struct].raw as any[]
    INITS.push(`
      let mut display = display::new_with_fields<${struct}>(
          &publisher,
          vector[${RAW_VALUES.map((x: any) => {
          return `string::utf8(b"${x}")`
        }).join(',')}],
          vector[${RAW_VALUES.map((x: any) => {
          return `string::utf8(b"{${x}}")`
        }).join(',')}],
          ctx
      );
      display::update_version(&mut display);
      transfer::public_transfer(display, tx_context::sender(ctx));
      transfer::public_transfer(publisher, tx_context::sender(ctx));
    `)

    return `
      public fun ${fnName}(${writeValues[struct].functionArgs}) : ${struct} {
        let nft_${variable} = ${struct} {
            ${writeValues[struct].objArgs}
         };
         nft_${variable}
      }
      ${transferMethod}
    `

  }).join("\n\n")

  return {
    NFT_METHODS,
    USE,
    INIT: INITS.join('\n\n')
  }
};
