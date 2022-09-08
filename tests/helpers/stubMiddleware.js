const sinon = require('sinon');

const stubMiddleware = async (controller, request = {}) => {
  const result = {
    body: undefined,
    status: undefined,
  };

  const response = {
    status: undefined,
    json: undefined,
  };
  response.status = sinon.stub().returns(response);
  response.json = sinon.stub().returns();
  const next = sinon.stub().returns();

  await controller(request, response, next);
  return { ...result, ...response, ...request, next };
};

module.exports = stubMiddleware;