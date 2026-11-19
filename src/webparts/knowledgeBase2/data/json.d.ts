// JSON data files are bundled by webpack. Typing them loosely keeps the TypeScript compiler from
// parsing multi-megabyte documentation files; data/clientLoaders.ts casts them to the real types.
declare module '*.json' {
  const value: unknown;
  export default value;
}
