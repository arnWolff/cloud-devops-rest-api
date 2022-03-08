const config = require('../config/config');
const fs   = require('fs');
const DeferredPromise = require('deferredpromise');
var slug = require('slug');

/**
 * Get user directory
 * @param {Object} user
 * @returns {string} user's directory path
 */
const setUserDirPath = (user, toolName) => {
  // get server API user's directory
  const userGitReposDir = config.dockerVolumes_Users + slug(user.email) + '/' + toolName
  return userGitReposDir;
};

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const create = async (path, options) => {
  options = options || {}
  if(!fs.existsSync(path)){
    return promise = await fs.promises.mkdir(path, options).catch(err => {
	  console.error(err);
    });
  }
  return true;
};

module.exports = {
  setUserDirPath,
  create,
};
