import { parseObjectString, parseStringArray } from ".";
import { HasProps, sui } from "../types";

export const handleStructs = (properties: any) => {
  const writeValues: any = {};
  const structs = properties
    .map((x: any) => {
      const obj = parseObjectString(x.defaultValue!);
      const keys = Object.keys(obj);

      let hasProps: HasProps[] = ["key", "store"];

      const selectedHas = x.decorators.filter(
        (decorator: any) => decorator.name === "Has"
      );
      selectedHas.forEach((c: any) => {
        const parsedArray = parseStringArray(c.arguments[0]);
        hasProps = parsedArray as HasProps[];
      });

      const hasSet = [...new Set(hasProps)]

      // Validate incompatible HasProps combinations
      if (hasSet.includes('key') && (hasSet.includes('drop') || hasSet.includes('copy'))) {
        throw new Error("The type 'sui::object::UID' does not have the ability 'copy' | 'drop'");
      }

      const functionArgs =
        keys
          .map((key) => {
            const type = obj[key].split(".")[1];
            return `${key}: ${(sui as any)[type]}`;
          })
          .join(", ") + `, ctx: &mut TxContext`;

      const objArgs = keys
        .map((key) => {
          return key;
        })
        .join(",");

      writeValues[x.name] = {
        functionArgs,
        objArgs: `id: object::new(ctx),${objArgs}`,
      };

      const idField = hasSet.find((x) =>
        x === 'key'
      )? "id: UID," : "";


      // Format struct with proper indentation
      return `public struct ${x.name} has ${hasSet.join(",")} {
       ${idField} ${keys
        .map((key) => {
          const type = obj[key].split(".")[1];
          return `\n  ${key}: ${(sui as any)[type]}`;
        })
        .join(",")}
    }`;
    })
    .join("\n\n");

  return {
    writeValues,
    STRUCTS: structs,
  };
};
