const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Directory = require('../utils/Directory');
const process = require('process');
const { spawn } = require("child_process");
const DeferredPromise = require('deferredpromise');

/**
 * Create a git repository
 * @param {Object} repoBody
 * @returns {Promise<Project>}
 */
const createGitRepository = async (projectBody) => {
	/* TO IMPLEMENT */
};

/**
 * Clone a git repository 
 * @param {object} http request
 * @param {string} path to git repository to clone
 * @param {object} [options] Optional parameters & custom options.
 * @returns {Promise<Project>}
 * @example <caption>options</caption>
 * localCopy: store a copy of cloned repo on user host system:
 *            values: true | false - {Default: false}
 * keepOnServer: keep cloned repo on server once local copy done}
 */
const cloneGitRepository = async (req, options) => {
	options = options || {}
	req.body.localCopy = !!options.localCopy
	req.body.keepOnServer = !!options.keepOnServer
	const gitCmd = "clone"
	req.body.cmd = gitCmd
	await gitCommand(req)
};

/**
 * Query for git CLI
 * @param {string} command line - command to execute using git CLI
 * @returns {Promise<QueryResult>}
 */
const gitCommand = async (req) => {
	const promise = new DeferredPromise();
    const user = req.user;
	const keepOnServer = !!req.body.keepOnServer
	
	// get server API working directory
	let cwd = process.cwd()
	// get server API user's directory
	const userGitReposDir = Directory.setUserDirPath(user, "git")
	// create users directory if doesn't exist
	await Directory.create(userGitReposDir, {recursive: true})
	// data to send back
	let datas = []
	// // set cwd of child process if needed
	// if(req.body.workingDir) cwd = req.body.workingDir
	// start child process	
	const child = spawn("git",req.body.cmd.split(' '), {
	  stdio: 'pipe',
	  cwd: userGitReposDir,
	  detached: true,
	});
	
	child.stdout.on('data', (data) => {
	  console.log(`\n${data}`);
	  datas.push(`\n${data}`)
	  return;
	});
	
	child.stderr.on('data', (data) => {
	  console.log(`\n${data}`);	 
	  datas.push(`\n${data}`)
	  return;
	});
	
	child.on('error', (error) => {
	  console.error(`error: ${error.message}`);
	  datas.push(`error: ${error.message}`)
	  return;
	});
	
	child.on('exit', function (code, signal) {
	  console.log('child process exited with ' + `code ${code} | signal ${signal}`);
	  promise.resolve({
		  status: `code ${code} | signal ${signal}`,
		  data: datas,
	  });
	});
	
  return promise
};

module.exports = {
  createGitRepository,
  cloneGitRepository,
  gitCommand,
};
