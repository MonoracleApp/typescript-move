import { handleAsserts } from "./asserts"

export const handleWriteMethods = (methods: any, writeValues: any, constants: Record<string, string> = {}) => {
  const writeMethods = methods.filter((x: any) =>
    x.decorators.find((y: any) => y.name === "Write")
  );
  const WRITE_METHODS = writeMethods
    .map((method: any) => {
      const asserts = method.decorators.find((x: any) => x.name === 'Assert')
      const conditions = handleAsserts(asserts, constants)

      const struct = method.decorators[0].arguments[0].replace(/'/g, "");
      const variable = struct.toLowerCase();
      return `public fun ${method.name}(${writeValues[struct].functionArgs}) {
      ${conditions}
    let ${variable} = ${struct} {${writeValues[struct].objArgs}};
    transfer::share_object(${variable});
  }`;
    })
    .join("\n\n");

  return {WRITE_METHODS};
};
