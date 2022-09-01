const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const server = require('../../src/api');
const { User } = require('../../src/database/models');
const { User: userMock } = require('../mock/models');

chai.use(chaiHttp);
const { expect } = chai;

describe('User routes', function () {
  let response;
  let loginResponse;

  const user = {
    id: 1,
    email: 'lewishamilton@gmail.com',
    username: 'Lewis Hamilton',
  };

  before(async function () {
    loginResponse = await chai.request(server)
    .post('/login')
    .send({
      email: 'lewishamilton@gmail.com',
      password: '123456',
    });
  });

  describe('GET /user', function () {
    before(async function () {
      sinon.stub(User, 'findAll').callsFake(userMock.findAll);

      response = await chai.request(server)
      .get('/user')
      .set('authorization', loginResponse.body.token);
    });

    after(function () { User.findAll.restore(); });
  
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

  describe('GET /user/:id', function () {
    before(async function () { sinon.stub(User, 'findByPk').callsFake(userMock.findByPk); });

    after(function () { User.findByPk.restore(); });

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

  describe('POST /user', function () {
    before(async function () {
      sinon.stub(User, 'findOne').callsFake(userMock.findOne);
      sinon.stub(User, 'create').callsFake(userMock.create);
    });

    after(function () {
      User.create.restore();
      User.findOne.restore();
    });
  
    describe('When user to be registered doesn\'t exist in database', function () {
      const newUser = {
        displayName: 'Brett Wiltshire',
        email: 'brett@email.com',
        password: '123456',
        image:
        'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      };
    
      before(async function () {
        response = await chai.request(server)
        .post('/user')
        .send(newUser);
      });
    
      it('returns status code 201', function () {
        expect(response).to.have.status(201);
      });
      it('response is an object', function () {
        expect(response.body).to.be.an('object');
      });
      it('array elements are objects with expected values', function () {
        expect(response.body).to.have.property('token');
      });
    });

    describe('When user to be registered already exists in database', function () {
      const existingUser = {
        displayName: 'Lewis Hamilton',
        email: 'lewishamilton@gmail.com',
        password: '123456',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg',
      };

      before(async function () {
        response = await chai.request(server)
        .post('/user')
        .send(existingUser);
      });
    
      it('returns status code 409', function () {
        expect(response).to.have.status(409);
      });
      it('response is an object', function () {
        expect(response.body).to.be.an('object');
      });
      it('response contains message with value "User already registered"', function () {
        expect(response.body.message).to.be.equals('User already registered');
      });
    });
  });

  describe('DELETE /user/me', function () {
    describe('Request with valid information', function () {
      it('returns status code 204', async function () {
        sinon.stub(User, 'destroy').callsFake(userMock.destroy);

        response = await chai.request(server)
        .delete('/user/me')
        .set('authorization', loginResponse.body.token);
        
        expect(response).to.have.status(204);

        User.destroy.restore();
      });
    });

    describe('When a user tries to delete another user', function () {
      before(async function () {
        sinon.stub(User, 'destroy').returns(null);

        response = await chai.request(server)
        .delete('/user/me')
        .set('authorization', loginResponse.body.token);
      });

      after(function () { User.destroy.restore(); });
    
      it('returns status code 401', function () {
        expect(response).to.have.status(401);
      });
      it('response contains message with value "Unauthorized user"', function () {
        expect(response.body.message).to.be.equals('Unauthorized user');
      });
    });
  });
});
