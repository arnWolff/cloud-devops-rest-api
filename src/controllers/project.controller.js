const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService, gitService } = require('../services');

const createProject = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.body);
  res.status(httpStatus.CREATED).send(project);
});

const getProjects = catchAsync(async (req, res) => {
  const loggedUser = req.user;
  const filter = pick(req.query, ['name', 'type', 'userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await projectService.queryProjects(filter, options);
  // filter results array by userId if logged user isn't admin
  if (loggedUser.role !== 'admin') {
    result.results = result.results.filter((_project) => {
      return loggedUser.id === _project.userId;
    });
  }

  res.send(result);
});

const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.projectId);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  if (req.params.toolName) {
    const { toolName } = req.params;
    res.send(project[toolName]);
    return;
  }
  res.send(project);
});

const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectById(req.user, req.params.projectId, req.body);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  res.send(project);
});

const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProjectById(req.params.projectId);
  res.status(httpStatus.NO_CONTENT).send();
});

const projectToolCli = catchAsync(async (req, res) => {
  const { toolName } = req.params;
  const toReturn = {};
  if (toolName === 'git') {
    if (req.body.cmd) {
      toReturn.cmd = await gitService.gitCommand(req);
    }
  }
  // await projectService.projectToolCli(req.params.projectId);
  res.status(httpStatus.CREATED).send(toReturn);
});

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  projectToolCli,
};
