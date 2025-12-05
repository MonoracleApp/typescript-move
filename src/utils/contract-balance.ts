import { parseStringArray } from ".";
import chalk from "chalk";
import { getAssertValues, getVarsandValues } from "./asserts";

export const handleContractBalance = (properties: any) => {
    const balances = properties.filter((x: any) =>
      x.decorators.find((y: any) => y.name === "Balance")
    );

    const BALANCE_METHODS = balances.map((method: any) => {
        const functions = parseStringArray(method.defaultValue)
        const variableName = method.name
        const balanceVariable = `${variableName}Balance`

        const asserts = method.decorators.find((x: any) => x.name === 'Assert')
        const conditions = getAssertValues(asserts)
        
        if (!/^[A-Z]/.test(balanceVariable)) {
            console.log(chalk.red.bold(`Error: Balance struct "${balanceVariable}" should start with an uppercase letter (A-Z)`))
            process.exit(1)
        } 

        let depositFn = ''
        let getBalanceFn  = ''
        let widthDrawFn = ''

        if(functions.find((x) => x === 'deposit')){

            let minDepositAssert = ''
            let maxDepositAssert = ''

            const minDepositCondition = conditions.find((x: any) => x.must.startsWith('Assertion.minDeposit('))
            const maxDepositCondition = conditions.find((x: any) => x.must.startsWith('Assertion.maxDeposit('))
            
            if(minDepositCondition){
                const { num, variable } = getVarsandValues(/Assertion\.minDeposit\((\d+)\)/, minDepositCondition)

                minDepositAssert = `
                    let amount = balance::value(&incoming);
                    assert!(amount >= ${num}, ${variable});
                `
            }

            if(maxDepositCondition){
                const { num, variable } = getVarsandValues(/Assertion\.maxDeposit\((\d+)\)/, maxDepositCondition)

                maxDepositAssert = `
                    ${!minDepositCondition ? 'let amount = balance::value(&incoming);' : ''}
                    assert!(amount <= ${num}, ${variable});
                `
            }

            depositFn = `public fun deposit_${balanceVariable}(balance_obj: &mut ${balanceVariable}, coins: Coin<SUI>) {
                let incoming = coin::into_balance(coins);
                ${minDepositAssert}
                ${maxDepositAssert}
                balance::join(&mut balance_obj.total, incoming);
            }`
        }

        if(functions.find((x) => x === 'withdraw')){

            let minWithdrawAssert = ''
            let maxWithdrawAssert = ''

            const minWithdrawCondition = conditions.find((x: any) => x.must.startsWith('Assertion.minWithdraw('))
            const maxWithdrawCondition = conditions.find((x: any) => x.must.startsWith('Assertion.maxWithdraw('))


            if(minWithdrawCondition){
                const { num, variable } = getVarsandValues(/Assertion\.minWithdraw\((\d+)\)/, minWithdrawCondition)
                minWithdrawAssert = `
                    assert!(amount >= ${num}, ${variable});
                `
            }

            if(maxWithdrawCondition){
                const { num, variable } = getVarsandValues(/Assertion\.maxWithdraw\((\d+)\)/, maxWithdrawCondition)

                maxWithdrawAssert = `
                    assert!(amount >= ${num}, ${variable});
                `
            }


            widthDrawFn = `public fun withdraw_${balanceVariable}(balance_obj: &mut ${balanceVariable}, amount: u64, ctx: &mut TxContext): Coin<SUI> {
                let sender = tx_context::sender(ctx);
                assert!(sender == balance_obj.owner, 0);
                ${minWithdrawAssert}
                ${maxWithdrawAssert}
                let split = balance::split(&mut balance_obj.total, amount);
                let coin_out = coin::from_balance(split, ctx);
                coin_out
            }`
        }

        if(functions.find((x) => x === 'get_balance')){
            getBalanceFn = `public fun get_balance(balance_obj: &${balanceVariable}): u64 {
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
            public fun init_${balanceVariable}(ctx: &mut TxContext) {
                let sender = tx_context::sender(ctx);
                let obj = ${balanceVariable} {
                    id: object::new(ctx),
                    total: balance::zero<SUI>(),
                    owner: sender,
                };
                transfer::public_share_object(obj);
            }

            // DEPOSIT FOR ${balanceVariable}
            ${depositFn}
            // GET BALANCE OF ${balanceVariable}
            ${getBalanceFn}
            // WITHDRAW FOR ${balanceVariable}
            ${widthDrawFn}
        `
    }).join('')

    return {
        BALANCE_METHODS,
        USE: BALANCE_METHODS.length ? `
            use sui::balance;
            use sui::coin::{Self, Coin};
            use sui::sui::SUI;
        ` : ''
    }
};
  