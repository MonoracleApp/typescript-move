import { Has, Module, Write } from "./decorators";
import { Mut, sui } from "./types";
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

    @Write('User')
    create_user(){}

    @Write('Admin')
    create_admin(){}

    @Write('Counter')
    create_counter(){}

    incrementCounter(counterItem: Mut<'Counter'>){
        exec`counterItem.value = counterItem.value + 1;`
    }

    multiplyCounter(counterItem: Mut<'Counter'>){
        exec`counterItem.value = counterItem.value * 2;`
    }
}

export default Writing