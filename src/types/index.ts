export const sui = {
    string: 'string::String',
    u8: 'u8',
    u16: 'u16',
    u32: 'u32',
    bool: 'bool',
    address: 'address'
}

type BalanceMethods = 'deposit'|'withdraw'|'get_balance'
export type BalanceFor = BalanceMethods[]

export type HasProps = 'key'|'store'|'drop'|'copy'

export interface Mut<T> {}
export interface Primitive<T extends 'u8'|'u16'|'u32'|'u64'|'u128'|'u256'|'bool'|'address'|'string::String'|'ascii::String'|'vector<u8>'|'vector<address>'|'vector<string::String>'|'vector<vector<u8>>'>{}

export type TransferType = 'me' | 'receiver' 

export interface SuiVector {
    maxLength?: number
}