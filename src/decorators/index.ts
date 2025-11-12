import 'reflect-metadata';
import { HasProps } from '../types';


function Has(has: HasProps[]) {
    return function(target: any) {
        Reflect.defineMetadata('module:has', { has }, target);
        return target;
    }
}

function Vector() {
    return function(target: any) {
        Reflect.defineMetadata('module:vector',{}, target);
        return target;
    }
}

function Module(key: string) {
    return function(target: any) {
        Reflect.defineMetadata('module:module', { key }, target);
        return target;
    }
}

function Write(key: string) {
    return function(target: any) {
        Reflect.defineMetadata('module:write', { key }, target);
        return target;
    }
}


function Push(key: string) {
    return function(target: any) {
        Reflect.defineMetadata('module:push', { key }, target);
        return target;
    }
}


function Mint(key: string) {
    return function(target: any) {
        Reflect.defineMetadata('module:min', { key }, target);
        return target;
    }
}

export {
    Has,
    Module,
    Write,
    Mint,
    Vector,
    Push
}