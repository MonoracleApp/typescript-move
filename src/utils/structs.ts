import { parseObjectString, parseStringArray } from ".";
import { HasProps, primitive, sui } from "../types";


export const handleStructs = (properties: any) => {
  const writeValues: any = {};
  const vectorValues: any = []
  const use: string[] = []
  const structs = properties
    .map((x: any) => {
      
      const obj = parseObjectString(x.defaultValue!);
      const keys = Object.keys(obj);
      
      let hasProps: HasProps[] = ["key", "store"];
      
      const isVector = x.decorators.find((x: any) => x.name === 'Vector')
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

      const params = keys
      .map((key) => {
        const type = obj[key].split(".")[1];
        return `${key}: ${(sui as any)[type]}`;
      })

      const functionArgs = params.join(", ") + `, ctx: &mut TxContext`;

      const objArgs = keys
        .map((key) => {
          return key;
        })
        .join(",");

      let structName = x.name
      let vector = ''
      let keywords = hasSet.join(",")

      if(isVector){
        let vectorStruct = `${x.name}List`
        let structItem = x.name.toLowerCase()
        structName += 'Item'
        keywords = 'copy, drop, store'
        vector = `\n public struct ${vectorStruct} has key, store {
          id: UID,
          ${structItem}: vector<${structName}>,
        }\n`  

         const types = keys.map((key) => {
          const type = obj[key].split(".")[1];
          return (sui as any)[type] 
         }).join(',')

        vectorValues.push({
          vectorStruct, 
          structName, 
          structItem, 
          decoratorMeta: isVector,
          raw: params.join(','),
          keys: keys.join(','),
          types
        })
      }  

      writeValues[structName] = {
        functionArgs,
        objArgs: `id: object::new(ctx),${objArgs}`,
        raw: keys,
      };

      const idField = !isVector ? hasSet.find((x) =>
        x === 'key'
      )? "id: UID," : "" : '';

      // Format struct with proper indentation
      return `public struct ${structName} has ${keywords} {
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
    vectorValues,

    USE: use.map(x => x).join('\n'),
    STRUCTS: structs,
  };
};
