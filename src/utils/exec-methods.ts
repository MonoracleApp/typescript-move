import { handleAsserts } from "./asserts"

export const handleExecMethods = (methods: any, constants: Record<string, string> = {}) => {
    const execMethods = methods.filter((x: any) =>
        x.decorators.find((y: any) => y.name === "Move")
      );
    return execMethods.map((x: any) => {
        const asserts = x.decorators.find((x: any) => x.name === 'Assert')
        const conditions = handleAsserts(asserts, constants)

        const functionBody = x.body.match(/\{\s*exec`([^`]+)`\s*\}/)


        let context = ''
        if(conditions){
            context = ',ctx: &mut TxContext'
        }

        
        const params = x.parameters.map((y: any) => {
            let type = ''
            if(y.type.startsWith('Mut')){
                type = `&mut ${y.type.match(/<(?:")?([^">]+)(?:")?>/)[1]}`
            }else {
                type = y.type.match(/<(?:")?([^">]+)(?:")?>/)[1]
            }
            return `${y.name}: ${type}`
        }).join(',')

        const bodyContent = functionBody[1]
            .split(';')
            .map((stmt: string) => stmt.trim())
            .filter((stmt: string) => stmt.length > 0)
            .map((stmt: string) => `    ${stmt};`)
            .join('\n')

        return `public fun ${x.name}(${params}${context}) {\n${conditions}\n${bodyContent}\n  }`
    }).join('\n')
}