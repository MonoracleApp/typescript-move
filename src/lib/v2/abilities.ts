export type Ability = "copy" | "drop" | "key" | "store";

export type Has<A extends Ability> = {
  __abilities?: A;
};
