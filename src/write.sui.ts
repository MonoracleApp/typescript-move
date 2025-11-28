import { Has, Module, Vector, Write } from "./decorators";
import { Mut, Primitive, sui, SuiVector } from "./types";
import { exec } from "./utils";

@Module('hello_world')
class Writing {

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
    OtherCounter = {
        value: sui.u32
    }

    @Vector('User')
    PersonList: SuiVector = {
        maxLength: 100
    }

    @Write('User')
    create_user(){}

    @Write('Admin')
    create_admin(){}

    @Write('Counter')
    create_counter(){}

    @Write('OtherCounter')
    create_other_counter(){}

    incrementCounter(counterItem: Mut<'Counter'>, otherCounterItem: Mut<'Counter'>){
        exec`
            counterItem.value = counterItem.value + 1;
            otherCounterItem.value = otherCounterItem.value + 1;
        `
    }

    multiplyCounter(counterItem: Mut<'Counter'>, otherCounterItem: Mut<'Counter'>){
        exec`
            counterItem.value = counterItem.value * 2;
            otherCounterItem.value = otherCounterItem.value * 2;
        `
    }

    changeName(userObj: Mut<'User'>, nameUser: Primitive<'string::String'>){
        exec`
            userObj.name = nameUser;
        `
    }
}

export default Writing