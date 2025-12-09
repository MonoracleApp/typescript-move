export const sui = {
    string: 'string::String',
    u8: 'u8',
    u16: 'u16',
    u32: 'u32',
    u64: 'u64',
    bool: 'bool',
    address: 'address'
}

export const primitive = {
    string: 'String',
    u8: 'u8',
    u16: 'u16',
    u32: 'u32',
    u64: 'u64',
    bool: 'bool',
    address: 'address'
}

type BalanceMethods = 'deposit'|'withdraw'|'get_balance'
export type BalanceFor = BalanceMethods[]

export type HasProps = 'key'|'store'|'drop'|'copy'

export interface Mut<T> {}
export interface Primitive<T extends 'u8'|'u16'|'u32'|'u64'|'u128'|'u256'|'bool'|'address'|'string::String'|'ascii::String'|'vector<u8>'|'vector<address>'|'vector<string::String>'|'vector<vector<u8>>'>{}

export type TransferType = 'me' | 'receiver' 

export type VectorFeatures = 'add'|'count'|'get'

