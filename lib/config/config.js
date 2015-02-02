
/**
 * Modules
 */
var _ = require('lodash');


/**
 * Relatives
 */
var  config = require('./settings.js');

/**
 * Exports
 */
module.exports = config;

/**
 * Vars
 */
var modes = ['development', 'production', 'ci', 'staging'];

_.merge(config, config[getEnv()], function(a, b) {
  return _.isArray(a) ? a.concat(b) : undefined;
});
_.each(modes, function(mode) {
  delete config[mode];
});

function getEnv() {
  if(typeof window === 'undefined') {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'test') {
      return 'development';
    } else
      return process.env.NODE_ENV;
  }
  return typeof SETTINGS === 'undefined'
    ? 'development'
    : SETTINGS.env;
}

