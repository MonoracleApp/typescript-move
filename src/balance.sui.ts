import { Balance, Module } from "./decorators";
import { BalanceFor } from "./types";

@Module('hello_world')
class Balancing {

    @Balance()
    Funding: BalanceFor = ['deposit', 'withdraw', 'get_balance']


}

export default Balancing