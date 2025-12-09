import { parseStringArray } from ".";

export const handleVectorMethods = (vectorProperties: any[]) => {
    return vectorProperties.map((x) => {
        const featsRaw = x.decoratorMeta.arguments
        const feats = parseStringArray(featsRaw[0])
        console.log(x)

        const HAS_ADD = feats.find((x) => x === 'add')
        const HAS_COUNT = feats.find((x) => x === 'count')
        const HAS_GET = feats.find((x) => x === 'get')

        return `
            public fun create${x.vectorStruct}(ctx: &mut TxContext) {
                let list = ${x.vectorStruct} {
                    id: object::new(ctx),
                    ${x.structItem}: vector::empty<${x.structName}>(),
                };
                transfer::share_object(list);
            }

            public fun add_${x.structItem}(list: &mut ${x.vectorStruct},${x.raw}){
                let item = ${x.structName} { ${x.keys} };
                vector::push_back(&mut list.${x.structItem}, item);
            }
        `
    })
};  
  