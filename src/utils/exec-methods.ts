export const handleExecMethods = (methods: any) => {
    return methods.map((x: any) => {
        const functionBody = x.body.match(/\{\s*exec`([^`]+)`\s*\}/)
        const params = x.parameters.map((y: any) => {
            let type = ''
            if(y.type.startsWith('Mut')){
                type = `&mut ${y.type.match(/<(?:")?([^">]+)(?:")?>/)[1]}` 
            }else {
                type = y.type.match(/<(?:")?([^">]+)(?:")?>/)[1]
            }
            return `${y.name}: ${type}`
        }).join(',')
        return `public fun ${x.name}(${params}) {
            ${functionBody[1]}
        }`
    }).join('\n')
}