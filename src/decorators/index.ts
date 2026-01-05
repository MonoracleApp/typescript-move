import "reflect-metadata";
import { HasProps, TransferType, VectorFeatures } from "../types";

function Has(has: HasProps[]) {
  return function (target: any) {
    Reflect.defineMetadata("module:has", { has }, target);
    return target;
  };
}

function Assert(assertion: { must: string; code: number }[]) {
  return function (target: any) {
    Reflect.defineMetadata("module:assert", { assertion }, target);
    return target;
  };
}

function Vector(features: VectorFeatures[]) {
  return function (target: any) {
    Reflect.defineMetadata("module:vector", {}, target);
    return target;
  };
}

function Module(struct: string) {
  return function (target: any) {
    Reflect.defineMetadata("module:module", { struct }, target);
    return target;
  };
}

function Package(struct: string) {
  return function (target: any) {
    Reflect.defineMetadata("module:package", { struct }, target);
    return target;
  };
}

function Write(struct: string) {
  return function (target: any) {
    Reflect.defineMetadata("module:write", { struct }, target);
    return target;
  };
}

function Public() {
  return function (target: any) {
    Reflect.defineMetadata("module:public", {}, target);
    return target;
  };
}

function Push(struct: string) {
  return function (target: any) {
    Reflect.defineMetadata("module:push", { struct }, target);
    return target;
  };
}

function Mint(struct: string, opt?: { display?: boolean }) {
  return function (target: any) {
    Reflect.defineMetadata("module:mint", { struct, opt }, target);
    return target;
  };
}

function Balance() {
  return function (target: any) {
    Reflect.defineMetadata("module:balance", {}, target);
    return target;
  };
}

function Move() {
  return function (target: any) {
    Reflect.defineMetadata("module:balance", {}, target);
    return target;
  };
}

function Transfer(transferType: TransferType[]) {
  return function (target: any) {
    Reflect.defineMetadata("module:transfer", {}, target);
    return target;
  };
}

export {
  Balance,
  Has,
  Module,
  Write,
  Mint,
  Vector,
  Push,
  Transfer,
  Assert,
  Move,
  Public,
  Package
};
