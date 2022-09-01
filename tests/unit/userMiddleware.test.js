const { expect } = require('chai');
const chai = require('chai');
const userMiddleware = require('../../src/middlewares/user.middleware');
const stubMiddleware = require('../helpers/stubMiddleware');

chai.use(require('sinon-chai'));

const EXPECT_400 = 'to be called with status 400';

describe('User middleware', function () {
  describe('Login validator', function () {
    describe('Login with valid information', function () {
      const request = { body: { email: 'lewishamilton@gmail.com', password: '123456' } };
      it('next is called', async function () {
        const response = await stubMiddleware(userMiddleware.loginValidator, request);
        expect(response.next.calledOnce).to.be.equal(true);
      });
    });

    describe('Login with invalid email', function () {
      const request = { body: { email: '', password: '123456' } };

      it(EXPECT_400,
        async function () {
        const response = await stubMiddleware(userMiddleware.loginValidator, request);
        expect(response.status.calledWith(400)).to.be.equal(true);
      });
      it('to be called with message with value "Some required fields are missing"',
        async function () {
        const response = await stubMiddleware(userMiddleware.loginValidator, request);
        expect(response.json.calledWith({ message: 'Some required fields are missing' }))
          .to.be.equals(true);
      });
    });

    describe('Login with invalid password', function () {
      let response;

      const request = { body: { email: 'lewishamilton@gmail.com', password: '' } };
      before(async function () {
        response = await stubMiddleware(userMiddleware.loginValidator, request);
      });

      it(EXPECT_400, async function () {
        expect(response.status.calledWith(400)).to.be.equal(true);
      });
      it('to be called with message with value "Some required fields are missing"',
        async function () {
        expect(response.json.calledWith({ message: 'Some required fields are missing' }))
          .to.be.equal(true);
      });
    });
  });

  describe('User validator', function () {
    describe('Request user with valid data', function () {
      const request = { body: {
        displayName: 'Brett Wiltshire',
        email: 'brett@email.com',
        password: '123456',
        image:
        'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      } };
      it('next is called', async function () {
        const response = await stubMiddleware(userMiddleware.userValidator, request);
        expect(response.next.calledOnce).to.be.equal(true);
      });
    });

    describe('Request with invalid displayName', function () {
      let response;

      const request = { body: {
        displayName: 'Brett',
      } };

      before(async function () {
        response = await stubMiddleware(userMiddleware.userValidator, request);
      });

      it(EXPECT_400,
        async function () {
        expect(response.status.calledWith(400)).to.be.equal(true);
      });
      it('to be called with message with expected value',
        async function () {
        expect(response.json.calledWith({
          message: '"displayName" length must be at least 8 characters long', 
        }))
          .to.be.equals(true);
      });
    });

    describe('Request with invalid email', function () {
      let response;

      const request = { body: {
        displayName: 'Brett Wiltshire',
        email: 'brett',
      } };

      before(async function () {
        response = await stubMiddleware(userMiddleware.userValidator, request);
      });

      it(EXPECT_400, async function () {
        expect(response.status.calledWith(400)).to.be.equal(true);
      });
      it('to be called with message with expected value', async function () {
        expect(response.json.calledWith({ message: '"email" must be a valid email' }))
          .to.be.equal(true);
      });
    });

    describe('Request with invalid password', function () {
      let response;
      const request = { body: {
        displayName: 'Brett Wiltshire',
        email: 'brett@email.com',
        password: '12345',
      } };

      before(async function () {
        response = await stubMiddleware(userMiddleware.userValidator, request);
      });

      it(EXPECT_400, async function () {
        expect(response.status.calledWith(400)).to.be.equal(true);
      });
      it('to be called with message with expected value', async function () {
        expect(response.json.calledWith({
          message: '"password" length must be at least 6 characters long', 
        })).to.be.equals(true);
      });
    });
  });
});