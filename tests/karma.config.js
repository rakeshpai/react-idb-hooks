module.exports = config => config.set({
  basePath: '../',
  frameworks: ['mocha', 'chai', 'karma-typescript'],
  files: [
    'src/**/*.ts',
    'tests/**/*.ts'
  ],
  preprocessors: { '**/*.ts': ['karma-typescript'] },
  reporters: ["progress", "karma-typescript"],
  browsers: ["Chrome", "Firefox", "SafariPrivate"],
  client: { captureConsole: true },
  karmaTypescriptConfig: {
    compilerOptions: {
      esModuleInterop: true,
      target: "ESNext",
      module: "CommonJS",
      lib: ['esnext', 'dom']
    }
  }
});
