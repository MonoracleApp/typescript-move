import { Has, Mint, Module, Transfer } from "../../decorators";
import { sui } from "../../types";

@Module('linktree')
class MyDrawings {
    @Has(['key', 'store'])
    Draws = {
        style: sui.string,
        name: sui.string,
        description: sui.string,
        image_url: sui.string
    }

    @Mint('Draws', {display: false})
    @Transfer(['me'])
    mint_draws(){}
}

export default MyDrawings