// eslint-disable-next-line @typescript-eslint/no-var-requires
var path = require('path');

module.exports = function (wallaby) {
  process.env.NODE_PATH += path.delimiter + path.join(wallaby.projectCacheDir, 'src');

  return {
    files: ['src/setup.ts', 'src/**/*.ts', 'src/**/*.tsx', '!src/**/*.test.ts?(x)'],
    tests: ['src/**/*.test.ts?(x)'],
    env: {
      type: 'node',
      NODE_ENV: 'test',
      CI: 1
    },
    testFramework: 'mocha',
    // compilers: {
    //   '**/*.ts?(x)': wallaby.compilers.typeScript({
    //     // typescript: require("ttypescript"),
    //     module: 'commonjs',
    //     jsx: 'react'
    //     // plugins: [{ transform: "tsx-control-statements" }],
    //   })
    // },
    compilers: {
      '**/*.ts?(x)': wallaby.compilers.babel({
        // typescript: require("ttypescript"),
        // module: "commonjs",
        // jsx: "react",
        // plugins: [{ transform: "tsx-control-statements" }],
        presets: ['next/babel'],
        plugins: ['jsx-control-statements', ['@babel/plugin-proposal-decorators', { legacy: true }]]
      })
    },
    workers: {
      initial: 1,
      regular: 1
    },
    // // reportUnhandledPromises: true,
    setup: function (wallaby) {
      require.extensions['.css'] = () => {
        /* */
      };

      if (!global.document) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        global.jsdom = require('jsdom-global')(undefined, {
          url: 'http://localhost'
        });
      }

      const mocha = wallaby.testFramework;
      mocha.suite.on('pre-require', function () {
        require(wallaby.projectCacheDir + '/src/mocha.config');
      });
    },
    teardown: function (wallaby) {
      console.log('Teardown ..');
      // global.jsdom();
    }
  };
};
