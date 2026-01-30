declare module '@foundryvtt/foundryvtt-cli' {
  function compilePack(sourcePath: string, outputPath: string, options?: any): Promise<void>;
  function extractPack(packPath: string, outputPath: string, options?: any): Promise<void>;
  export { compilePack, extractPack };
}