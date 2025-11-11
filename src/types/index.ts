export const sui = {
    string: 'string::String',
    u8: 'u8',
    u16: 'u16',
    u32: 'u32',
    bool: 'bool',
    address: 'address'
}

export type HasProps = 'key'|'store'|'drop'|'copy'

export interface Mut<T> {}