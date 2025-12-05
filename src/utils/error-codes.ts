import { parseAssertions, ParsedAssertion } from "."
import { Assertion } from "../lib/assertion"

export interface MethodAssertion {
    methodName: string
    assertions: ParsedAssertion[]
}

export const handleErrorCodes = (methods: any): string => {
    const asserts = methods.filter((x: any) => x.decorators.find((y: any) => y.name === 'Assert'))
    const errorCodes = new Set<string>()

    asserts.forEach((assert: any) => {
        const decorator = assert.decorators.find((x: any) => x.name === 'Assert')
        const argumentString = decorator.arguments[0]
        const parsed = parseAssertions(argumentString) as any
        parsed.forEach((x: any) => {
            const fieldName = x.code.split('.')[1]
            const fieldValue = (Assertion as any)[fieldName]
            errorCodes.add(`const ${fieldName}: u64 = ${fieldValue};`)
        })
    })

    return [...errorCodes].join('\n')
}