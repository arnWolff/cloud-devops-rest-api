const fs = require('fs');
const slug = require('slug');
const config = require('../config/config');

/**
 * Get user directory
 * @param {Object} user
 * @returns {string} user's directory path
 */
const setUserDirPath = (user, toolName) => {
  // get server API user's directory
  const userGitReposDir = `${config.dockerVolumes_Users + slug(user.email)}/${toolName}`;
  return userGitReposDir;
};

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const create = async (path, options) => {
  // options = options || {};
  if (!fs.existsSync(path)) {
    return fs.promises.mkdir(path, options);
  }
  return true;
};

module.exports = {
  setUserDirPath,
  create,
};
