const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const server = require('../../src/api');
const { User } = require('../../src/database/models');
const { User: userMock } = require('../mock/models');

chai.use(chaiHttp);
const { expect } = chai;

describe('POST /login', function () {
  before(function () {
    sinon.stub(User, 'findOne').callsFake(userMock.findOne);
  });

  after(function () { return User.findOne.restore(); });

  describe('Login with existing user and valid data', function () {
    let response;

    const user = {
      id: 1,
      email: 'lewishamilton@gmail.com',
    };

    before(async function () {
      response = await chai.request(server)
      .post('/login')
      .send({
        email: 'lewishamilton@gmail.com',
        password: '123456',
      });
    });

    it('returns status code 200', function () {
      expect(response).to.have.status(200);
    });
    it('response contains token with user id and email', function () {
      const { token } = response.body;
      const payload = jwt.decode(token);
      
      expect(payload.id).to.be.equals(user.id);
      expect(payload.email).to.be.equals(user.email);
    });
  });

  describe('Login with user that doesn\'t exist', function () {
    let response;

    before(async function () {
      response = await chai.request(server)
      .post('/login')
      .send({
        email: 'ayrtonsenna@gmail.com',
        password: 'password',
      });
    });

    it('returns status code 400', function () {
      expect(response).to.have.status(400);
    });
    it('response contains message with value "Invalid fields"', function () {
      expect(response.body.message).to.be.equals('Invalid fields');
    });
  });
});