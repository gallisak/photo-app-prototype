const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure 'cjs' is included in source extensions
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}

// Disable package exports to solve the "Component auth has not been registered yet" issue with Firebase JS SDK
config.resolver.unstable_enablePackageExports = false;

module.exports = config;

