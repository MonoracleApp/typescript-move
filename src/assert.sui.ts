import { Assert, Has, Module, Move, Write } from "./decorators";
import { Assertion } from "./lib/assertion";
import { Mut, Primitive, sui } from "./types";
import { exec } from "./utils";

const MY_ADDRESS = '0xbed1a0d1bb2b8e281d81b838f6c35d7864936f0de3233eb161181ab765e0ea40'

@Module('hello_world')
class Asserti {

    @Has(['key', 'store'])
    User = {
        name: sui.string,
        status: sui.bool,
        age: sui.u8
    }

    @Has(['key', 'store'])
    Announcement = {
        message: sui.string,
    }

    @Write('User')
    @Assert([{must: 'age > 10', code: Assertion.ERR_UNDERAGE}])
    create_user(){}


    @Write('Announcement')
    @Assert([
        {must: Assertion.min('message', 5), code: Assertion.ERR_MESSAGE_TOO_SHORT},
    ])
    create_announcement(){}

    @Move()
    @Assert([
        {must: Assertion.min('message', 10), code: Assertion.ERR_MESSAGE_TOO_SHORT},
        {must: Assertion.onlyFor(MY_ADDRESS), code: Assertion.ERR_ONLY_OWNER},
    ])
    changeName(annObj: Mut<'Announcement'>, message: Primitive<'string::String'>){
        exec`
            annObj.message = message;
        `
    }

}

export default Asserti