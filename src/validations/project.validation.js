const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required().valid('Private Cloud', 'IaaS', 'PaaS', 'SaaS'),
    userId: Joi.string().required(), // .custom(objectId),
  }),
};

const getProjects = {
  query: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string(),
    userId: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProject = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
    toolName: Joi.string(),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      type: Joi.string().required().valid('Private Cloud', 'IaaS', 'PaaS', 'SaaS'),
      userId: Joi.string().custom(objectId),
      git: Joi.object().keys({
        repo: Joi.string().required(),
      }),
    })
    .min(1),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const projectToolCli = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
    toolName: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      cmd: Joi.string(),
      helper: Joi.string(),
    })
    .min(1),
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  projectToolCli,
};
