export * from './media'
export * from './meta'
export * from './page'
export * from './search'

/**
 * Utility type to allow known string literals plus any other string
 *
 * @usage
 *
 * ```ts
 * type MyType = LooseUnion<'option1' | 'option2'>
 * const a: MyType = 'option1' // valid
 * const b: MyType = 'custom'  // also valid
 * ```
 */
export type LooseUnion<T extends string> = T | (string & {})
