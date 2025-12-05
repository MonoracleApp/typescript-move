import { parseAssertions, ParsedAssertion } from "."
import { Assertion } from "../lib/assertion"

export interface MethodAssertion {
    methodName: string
    assertions: ParsedAssertion[]
}

export const handleErrorCodes = (methods: any): MethodAssertion[] => {
    const asserts = methods.filter((x: any) => x.decorators.find((y: any) => y.name === 'Assert'))

    return asserts.map((assert: any) => {
        const decorator = assert.decorators.find((x: any) => x.name === 'Assert')
        const argumentString = decorator.arguments[0]
        const parsed = parseAssertions(argumentString) as any
        const variables = parsed.map((x: any) => {
            const variable = x.code.split('.')
            const fieldName = variable[1]
            const fieldValue = (Assertion as any)[fieldName]
            return `const ${fieldName}: u64 = ${fieldValue};`
        }).join('\n')
        return variables
    }).join('\n')
}