import { parseStringArray } from ".";
import { BalanceFor } from "../types";

export const handleContractBalance = (properties: any,) => {
    const balances = properties.filter((x: any) =>
      x.decorators.find((y: any) => y.name === "Balance")
    );

    const BALANCE_METHODS = balances.map((method: any) => {
        const functions = parseStringArray(method.defaultValue)
        const variableName = method.name
        const balanceVariable = `${variableName}Balance` 

        let depositFn = ''
        let getBalanceFn  = ''
        let widthDrawFn = ''

        if(functions.find((x) => x === 'deposit')){
            depositFn = `public fun deposit_${balanceVariable}(balance_obj: &mut ${balanceVariable}, coins: Coin<SUI>) {
                let incoming = coin::into_balance(coins);
                balance::join(&mut balance_obj.total, incoming);
            }`
        }

        if(functions.find((x) => x === 'withdraw')){
            widthDrawFn = `public fun withdraw_${balanceVariable}(balance_obj: &mut ${balanceVariable}, amount: u64, ctx: &mut TxContext): Coin<SUI> {
                let sender = tx_context::sender(ctx);
                assert!(sender == balance_obj.owner, 0);
                let split = balance::split(&mut balance_obj.total, amount);
                let coin_out = coin::from_balance(split, ctx);
                coin_out
            }`
        }

        if(functions.find((x) => x === 'get_balance')){
            getBalanceFn = `public fun get_balance(balance_obj: &MyFundsBalance): u64 {
                balance::value(&balance_obj.total)
            }`
        }

        return `
            \n
            public struct ${balanceVariable} has key, store {
               id: object::UID,
               total: balance::Balance<SUI>,
               owner: address,
            }
            \n
            public fun init_${balanceVariable}(ctx: &mut TxContext) : ${balanceVariable} {
                let sender = tx_context::sender(ctx);
                let obj = ${balanceVariable} {
                    id: object::new(ctx),
                    total: balance::zero<SUI>(),
                    owner: sender,
                };
                return obj
            }

            // DEPOSIT FOR ${balanceVariable}
            ${depositFn}
            // GET BALANCE OF ${balanceVariable}
            ${getBalanceFn}
            // WITHDRAW FOR ${balanceVariable}
            ${widthDrawFn}
        `
    }).join('')

    return BALANCE_METHODS
};
  