export const handleVectorMethods = (methods: any, vectorValues: any) => {

    const vectorMethods = methods.filter((x: any) =>
        x.decorators.find((y: any) => y.name === "Push")
      );
    
    const VECTOR_METHODS = vectorMethods.map((method: any) => {
        const struct = method.decorators[0].arguments[0].replace(/'/g, "");

        return `public fun ${method.name}(${vectorValues[struct].functionArgs}) : ${struct}{
            let item = ${struct} {
                ${vectorValues[struct].objArgs}
            };
            let item_id = object::id(&item);
           let item_address = object::id_to_address(&item_id);
           vector::push_back(&mut registry.items, item_address);
           item
        }`
    }).join("\n\n")

    return VECTOR_METHODS

  };
  