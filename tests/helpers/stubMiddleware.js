const sinon = require('sinon');

const stubMiddleware = async (controller, request = {}) => {
  const result = {
    body: undefined,
    status: undefined,
  };
  // allow to create response stubs
  // eslint-disable-next-line sonarjs/prefer-object-literal
  const response = {};
  response.status = sinon.stub().returns(response);
  response.json = sinon.stub().returns();
  const next = sinon.stub().returns();

  await controller(request, response, next);
  return { ...result, ...response, ...request, next };
};

module.exports = stubMiddleware;