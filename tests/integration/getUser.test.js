const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const server = require('../../src/api');
const { User } = require('../../src/database/models');
const { User: userMock } = require('../mock/models');

chai.use(chaiHttp);
const { expect } = chai;

describe('User GET routes', function () {
  let response;
  let loginResponse;

  const user = {
    id: 1,
    email: 'lewishamilton@gmail.com',
    username: 'Lewis Hamilton',
  };

  before(async function () {
    sinon.stub(User, 'findAll').callsFake(userMock.findAll);
    sinon.stub(User, 'findByPk').callsFake(userMock.findByPk);

    loginResponse = await chai.request(server)
    .post('/login')
    .send({
      email: 'lewishamilton@gmail.com',
      password: '123456',
    });
  });

  after(function () {
    User.findAll.restore();
    User.findByPk.restore();
  });

  describe('GET /user - Return all users', function () {
    before(async function () {
      response = await chai.request(server)
      .get('/user')
      .set('authorization', loginResponse.body.token);
    });
  
    it('returns status code 200', function () {
      expect(response).to.have.status(200);
    });
    it('response is an array', function () {
      expect(response.body).to.be.an('array');
    });
    it('array elements are objects with expected values', function () {
      expect(response.body[0]).to.be.eql(user);
    });
  });

  describe('GET /user/:id - Return user by id', function () {
    describe('With id from existing user', function () {
      before(async function () {
        response = await chai.request(server)
        .get('/user/1')
        .set('authorization', loginResponse.body.token);
      });

      it('returns status code 200', function () {
        expect(response).to.have.status(200);
      });
      it('response is an object with expected values', function () {
        expect(response.body).to.be.eql(user);
      });
    });

    describe('With id from user that doesn\'t exists', function () {
      before(async function () {
        response = await chai.request(server)
        .get('/user/id')
        .set('authorization', loginResponse.body.token);
      });

      it('returns status code 404', function () {
        expect(response).to.have.status(404);
      });
      it('response contains message with value "User does not exist"', function () {
        expect(response.body.message).to.be.equals('User does not exist');
      });
    });
  });
});
