import { Module, Vector } from "./decorators";
import { sui } from "./types";

@Module('wordi')
class Peoplei {

    @Vector(['add', 'count', 'get'])
    People = {
        name: sui.string,
        lastname: sui.string,
        age: sui.u32
    }

}

export default Peoplei