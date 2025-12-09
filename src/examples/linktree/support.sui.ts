import { Balance, Module } from "../../decorators"
import { BalanceFor } from "../../types"

@Module('linktree')
class SupportMe {

    @Balance()
    Support: BalanceFor = ['deposit', 'withdraw', 'get_balance']


}

export default SupportMe