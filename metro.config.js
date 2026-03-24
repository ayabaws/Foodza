const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add the @/ alias to the resolver
config.resolver.alias = {
  '@': '.',
};

module.exports = config;
