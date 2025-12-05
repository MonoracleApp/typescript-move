export const handleAsserts = (asserts: {must: string, code: string}[], constants: Record<string, string> = {}) => {
    const result = asserts.map((x) => {
        const { must, code } = x
        const variable = code.split('.')[1]
        if(must.startsWith('Assertion.min(')){
            const numReg = /Assertion\.min\([^,]+,\s*(\d+)\)/
            const num = must.match(numReg)!;

            const varReg = /Assertion\.min\(\s*'([^']+)'\s*,\s*(\d+)\s*\)/;
            const varName = must.match(varReg)!;
            return `assert!(string::length(&${varName[1]}) >= ${num[1]}, ${variable});`
        }
        if(must.startsWith('Assertion.onlyFor(')){
            const addrReg = /Assertion\.onlyFor\(([^)]+)\)/
            const addrMatch = must.match(addrReg)
            let address = addrMatch?.[1] || ''

            if (constants[address]) {
                address = constants[address]
            }

            address = address.replace(/['"]/g, '')

            return `assert!(tx_context::sender(ctx) == @${address}, ${variable});`
        }
        return `assert!(${must.replace(/'/g, "")}, ${variable});`
    }).join('\n')
    return result
}