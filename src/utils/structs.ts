import { parseObjectString, parseStringArray } from ".";
import { HasProps, sui } from "../types";


export const handleStructs = (properties: any) => {
  const writeValues: any = {};
  const registryValues: any = {}
  const use: string[] = []
  console.log(properties)
  const structs = properties
    .map((x: any) => {
      
      const obj = parseObjectString(x.defaultValue!);
      const keys = Object.keys(obj);
      
      let hasProps: HasProps[] = ["key", "store"];
      
      const isVector = x.decorators.find((x: any) => x.name === 'Vector') ? true : false
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
        raw: keys,
      };

      const idField = hasSet.find((x) =>
        x === 'key'
      )? "id: UID," : "";

      let vector = ''

      if(isVector) {
          vector = `\npublic struct ${x.name}Registry has key {
            id: UID,
            items: vector<address>
          }\n`
          registryValues[x.name] = {
            functionArgs: `registry: &mut ${x.name}Registry, ${functionArgs}`,
            objArgs: `id: object::new(ctx),${objArgs}`
          }
      }

      // Format struct with proper indentation
      return `public struct ${x.name} has ${hasSet.join(",")} {
       ${idField} ${keys
        .map((key) => {
          const type = obj[key].split(".")[1];

          if(type === 'string' && !use.find(x => x === 'use std::string::{Self};')) {
            use.push('use std::string::{Self};')
          }

          return `\n  ${key}: ${(sui as any)[type]}`;
        })
        .join(",")}
    }${vector}`;
    })
    .join("\n\n");

  return {
    writeValues,
    vectorValues: registryValues,

    USE: use.map(x => x).join('\n'),
    STRUCTS: structs,
  };
};
