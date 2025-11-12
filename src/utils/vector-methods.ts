export const handleVectorMethods = (methods: any, vectorValues: any) => {

    const vectorMethods = methods.filter((x: any) =>
        x.decorators.find((y: any) => y.name === "Push")
      );

    
    const VECTOR_METHODS = vectorMethods.map((method: any) => {
        const struct = method.decorators[0].arguments[0].replace(/'/g, "");
        const variable = struct.toLowerCase();

        return `
        // Create a registry (only once, maybe by admin)\n
        public fun create_${variable}_registry(ctx: &mut TxContext) {
            let sender = tx_context::sender(ctx);
            let registry = ${struct}Registry {
                id: object::new(ctx),
                items: vector::empty<address>(),
            };
            transfer::transfer(registry, sender);
        }
        \n
        public fun ${method.name}(${vectorValues[struct].functionArgs}) : ${struct}{
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
  