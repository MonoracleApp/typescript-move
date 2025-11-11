import { Has, Mint, Module, Vector, Write } from "./decorators";
import { Mut, sui } from "./types";
import { exec } from "./utils";

@Module('hello_world')
class Greeting {

    @Has(['key', 'store'])
    User = {
        name: sui.string,
        status: sui.bool,
        age: sui.u8
    }

    @Has(['key', 'store'])
    Admin = {
        status: sui.bool
    }

    @Has(['key', 'store'])
    Counter = {
        value: sui.u32
    }

    @Has(['key', 'store'])
    @Vector()
    Project = {
        name: sui.string,
        description: sui.string,
        webSiteUrl: sui.string
    }

    @Write('User')
    create_user(){}

    @Write('Admin')
    create_admin(){}

    @Mint('Admin')
    mint_hero(){}

    incrementCounter(counterItem: Mut<'Counter'>){
        exec`counterItem.value = counterItem.value + 1;`
    }

    multiplyCounter(counterItem: Mut<'Counter'>){
        exec`counterItem.value = counterItem.value * 2;`
    }
}

export default Greeting