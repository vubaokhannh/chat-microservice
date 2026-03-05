const path = require('path');

module.exports = (defaultConfig) => {
  return {
    ...defaultConfig,
    resolve: {
      ...defaultConfig.resolve,
      extensionAlias: {
        '.js': ['.ts', '.js'],
      },
    },
  };
};
