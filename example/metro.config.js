const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Watch the parent package source so Metro hot-reloads on edits.
config.watchFolders = [path.resolve(__dirname, '..')];

// Ensure modules from the parent package's node_modules resolve.
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../node_modules'),
];

module.exports = config;
