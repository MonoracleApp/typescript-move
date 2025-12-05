export const handleAsserts = (asserts: {must: string, code: string}[]) => {
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
            return `assert!(tx_context::sender(ctx) == OWNER, ${variable});`
        }
        return `assert!(${must.replace(/'/g, "")}, ${variable});`
    }).join('\n')
    console.log(result)
}