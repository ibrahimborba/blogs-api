const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
const authMiddleware = require('../../src/middlewares/auth.middleware');
const stubMiddleware = require('../helpers/stubMiddleware');
const tokenHelper = require('../../src/helpers/token');

chai.use(require('sinon-chai'));

describe('Auth middleware', function () {
  describe('Validate when called with valid a token', function () {
    const request = { headers: { authorization: 'token' } };

    before(function () {
      const payload = { id: 1 };
      sinon.stub(tokenHelper, 'verify').returns(payload);
    });

    after(function () { tokenHelper.verify.restore(); });

    it('adds userId with value 1 to request', async function () {
      const response = await stubMiddleware(authMiddleware.tokenValidation, request);
      expect(response.userId).to.be.equals(1);
    });
    it('next is called', async function () {
      const response = await stubMiddleware(authMiddleware.tokenValidation, request);
      expect(response.next.calledOnce).to.be.equal(true);
    });
  });

  describe('Validate when called without a token', function () {
    const request = { headers: {} };
    it('to be called with status 401', async function () {
      const response = await stubMiddleware(authMiddleware.tokenValidation, request);
      expect(response.status.calledWith(401)).to.be.equal(true);
    });
    it('to be called with message with value "Token not found"', async function () {
      const response = await stubMiddleware(authMiddleware.tokenValidation, request);
      expect(response.json.calledWith({ message: 'Token not found' })).to.be.equals(true);
    });
  });

  describe('Validate when called with expired or invalid token', function () {
    const request = { headers: { authorization: 'expiredorinvalidtoken' } };
    it('to be called with status 401', async function () {
      const response = await stubMiddleware(authMiddleware.tokenValidation, request);
      expect(response.status.calledWith(401)).to.be.equal(true);
    });
    it('to be called with message with value "Expired or invalid token"', async function () {
      const response = await stubMiddleware(authMiddleware.tokenValidation, request);
      expect(response.json.calledWith({ message: 'Expired or invalid token' })).to.be.equals(true);
    });
  });
});