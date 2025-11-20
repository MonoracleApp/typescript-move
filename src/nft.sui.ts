import { Has, Mint, Module, Transfer } from "./decorators";
import { sui } from "./types";

@Module('hello_world')
class Nfting {
    @Has(['key', 'store'])
    Hero = {
        name: sui.string,
        description: sui.string,
        image_url: sui.string
    }

    @Mint('Hero')
    @Transfer(['me', 'receiver'])
    mint_hero(){}
}

export default Nfting