declare module "qrcode-terminal" {
  interface Options {
    small?: boolean;
  }
  function generate(text: string, opts?: Options, callback?: (output: string) => void): void;
  export { generate };
  export default { generate };
}
