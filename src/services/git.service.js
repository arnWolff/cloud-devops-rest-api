const httpStatus = require('http-status');
const { Git } = require('../services');
const ApiError = require('../utils/ApiError');
const process = require('process');
const { spawn } = require("child_process");
const DeferredPromise = require('deferredpromise');
const fs   = require('fs');
var slug = require('slug');

/**
 * Create a git repository
 * @param {Object} repoBody
 * @returns {Promise<Project>}
 */
const createGitRepository = async (projectBody) => {
	/* TO IMPLEMENT */
  // if (await Project.isNameTaken(projectBody.name)) {
    // throw new ApiError(httpStatus.BAD_REQUEST, 'Project name already taken');
  // }
  // return Project.create(projectBody);
};

/**
 * Query for git CLI
 * @param {string} command line - command to execute using git CLI
 * @returns {Promise<QueryResult>}
 */
const gitCommand = async (req) => {
	const promise = new DeferredPromise();
    const user = req.user;
	
	// get server API working directory
	let cwd = process.cwd()
	// get server API user's directory
	const userDir = await fs.promises.mkdir(cwd + '/users/' + slug(user.name + '-' + user.email), { recursive: true })
	console.log('userDir',userDir)
	// data to send back
	let datas = []
	// // set cwd of child process if needed
	// if(req.body.workingDir) cwd = req.body.workingDir
	// start child process	
	const child = spawn("git",req.body.cmd.split(' '), {
	  stdio: 'pipe',
	  cwd: userDir,
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
  gitCommand,
};
