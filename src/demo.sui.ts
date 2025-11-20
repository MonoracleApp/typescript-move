import { Balance, Has, Mint, Module, Push, Transfer, Write } from "./decorators";
import { BalanceFor, Mut, sui } from "./types";
import { exec } from "./utils";

@Module('hello_world')
class Nfting {

    // @Balance()
    // MyWorks: BalanceFor = ['deposit', 'withdraw', 'get_balance']

    // @Balance()
    // MyFunds: BalanceFor = ['deposit', 'withdraw']

    // @Has(['key', 'store'])
    // User = {
    //     name: sui.string,
    //     status: sui.bool,
    //     age: sui.u8
    // }

    // @Has(['key', 'store'])
    // Admin = {
    //     status: sui.bool
    // }

    // @Has(['key', 'store'])
    // Counter = {
    //     value: sui.u32
    // }

    // @Has(['key', 'store'])
    // @Vector()
    // Project = {
    //     name: sui.string,
    //     description: sui.string,
    //     webSiteUrl: sui.string
    // }

    @Has(['key', 'store'])
    Hero = {
        name: sui.string,
        description: sui.string,
        image_url: sui.string
    }

    // @Write('User')
    // create_user(){}

    // @Write('Admin')
    // create_admin(){}


    // @Push('Project')
    // create_project(){}

    @Mint('Hero')
    @Transfer(['me', 'receiver'])
    mint_hero(){}

    // incrementCounter(counterItem: Mut<'Counter'>){
    //     exec`counterItem.value = counterItem.value + 1;`
    // }

    // multiplyCounter(counterItem: Mut<'Counter'>){
    //     exec`counterItem.value = counterItem.value * 2;`
    // }
}

export default Nfting