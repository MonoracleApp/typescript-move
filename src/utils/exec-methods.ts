export const handleExecMethods = (methods: any) => {
    return methods.map((x: any) => {
        console.log(x.parameters)
        const functionBody = x.body.match(/\{\s*exec`([^`]+)`\s*\}/)
        const mutVariable = x.parameters[0].name
        const mutStruct = x.parameters[0].type.match(/Mut<"([^"]+)">/)
        return `public fun ${x.name}(${mutVariable}: &mut ${mutStruct[1]}) {
            ${functionBody[1]}
        }`
    }).join('\n')
}