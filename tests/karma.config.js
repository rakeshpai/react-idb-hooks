module.exports = config => config.set({
  basePath: '../',
  frameworks: ['mocha', 'chai', 'karma-typescript'],
  files: [
    'src/**/*.ts',
    'tests/*.test.ts'
  ],
  preprocessors: { '**/*.ts': ['karma-typescript'] },
  reporters: ["progress", "karma-typescript"],
  browsers: ["Chrome", "Firefox", "SafariPrivate"],
  karmaTypescriptConfig: {
    compilerOptions: {
      esModuleInterop: true,
      target: "ESNext",
      module: "CommonJS",
      lib: ['esnext', 'dom']
    }
  }
});
