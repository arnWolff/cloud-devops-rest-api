const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
	
	// set user current request rights so we can use it later in project.service.js to avoid extra database call
	// this would need security audit
	req.user.hasRequiredRights = hasRequiredRights
	
	if (!hasRequiredRights) {
		if(req.params.projectId) {
			// const project = await projectService.getProjectById(req.params.projectId);
		    // if (project.userId !== user.id) {
				// return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
			// }
		}else if (req.params.userId !== user.id) {
		  return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
		}
	}
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
