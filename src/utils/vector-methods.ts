import { parseStringArray } from ".";

export const handleVectorMethods = (vectorProperties: any[]) => {
    return vectorProperties.map((x) => {
        const featsRaw = x.decoratorMeta.arguments
        const feats = parseStringArray(featsRaw[0])

        const HAS_ADD = feats.find((x) => x === 'add')
        const HAS_COUNT = feats.find((x) => x === 'count')
        const HAS_GET = feats.find((x) => x === 'get')

        let addMethod = ''
        let countMethod = ''
        let getMethod = ''

        if(HAS_ADD){
            addMethod = `public fun add_${x.structItem}(list: &mut ${x.vectorStruct},${x.raw}){
                let item = ${x.structName} { ${x.keys} };
                vector::push_back(&mut list.${x.structItem}, item);
            }`
        }

        if(HAS_COUNT){
            countMethod = `public fun get_count_of_${x.vectorStruct}(list: &${x.vectorStruct}): u64 {
                vector::length(&list.${x.structItem})
            }`
        }

        if(HAS_GET){
            getMethod = `public fun get_person(list: &${x.vectorStruct}, index: u64): (${x.types}) {
                let item = vector::borrow(&list.${x.structItem}, index);
                (${x.keys.split(',').map((z:string) => `item.${z}`)})
            }`
        }

        return `
            public fun create${x.vectorStruct}(ctx: &mut TxContext) {
                let list = ${x.vectorStruct} {
                    id: object::new(ctx),
                    ${x.structItem}: vector::empty<${x.structName}>(),
                };
                transfer::share_object(list);
            }

            ${addMethod}
            ${countMethod}
            ${getMethod}
        `
    }).join('')
};  
  