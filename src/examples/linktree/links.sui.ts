import { Module, Vector } from "../../decorators"
import { sui } from "../../types"

@Module('linktree')
class Peoplei {

    @Vector(['add', 'count', 'get'])
    Sites = {
        websiteUrl: sui.string,
        name: sui.string,
        description: sui.u32
    }

}

export default Peoplei