const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const server = require('../../src/api');
const { BlogPost } = require('../../src/database/models');

chai.use(chaiHttp);

const { expect } = chai;

describe('When functions throw an error', function () {
  const ERROR_MESSAGE = 'Something went wrong';
  let response;
  let loginResponse;

  before(async function () {
    loginResponse = await chai.request(server)
    .post('/login')
    .send({
      email: 'lewishamilton@gmail.com',
      password: '123456',
    });
  });

  describe('Post routes', function () {
    describe('findAll throws an error', function () {
      before(async function () {
        const stubThrows = { message: ERROR_MESSAGE };
        sinon.stub(BlogPost, 'findAll').throws(stubThrows);

        response = await chai.request(server)
        .get('/post')
        .set('authorization', loginResponse.body.token);
      });

      after(function () { BlogPost.findAll.restore(); });

      it('returns status code 500', function () {
        expect(response).to.have.status(500);
      });
      it('response contains message with value "Error message"', function () {
        expect(response.body.message).to.be.equals(ERROR_MESSAGE);
      });
    });

    describe('findByPk throws an error', function () {
      before(async function () {
        const stubThrows = { message: ERROR_MESSAGE };
        sinon.stub(BlogPost, 'findByPk').throws(stubThrows);

        response = await chai.request(server)
        .get('/post/id')
        .set('authorization', loginResponse.body.token);
      });

      after(function () { BlogPost.findByPk.restore(); });

      it('returns status code 500', function () {
        expect(response).to.have.status(500);
      });
      it('response contains message with value "Error message"', function () {
        expect(response.body.message).to.be.equals(ERROR_MESSAGE);
      });
    });
    
    describe('create throws an error', function () {
      const newPost = {
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
        categoryIds: [1, 2],
      };
  
      before(async function () {
        const stubThrows = { message: ERROR_MESSAGE };
        sinon.stub(BlogPost, 'create').throws(stubThrows);
  
        response = await chai.request(server)
        .post('/post')
        .send(newPost)
        .set('authorization', loginResponse.body.token);
      });
  
      after(function () { BlogPost.create.restore(); });
  
      it('returns status code 500', function () {
        expect(response).to.have.status(500);
      });
      it('response contains message with value "Error message"', function () {
        expect(response.body.message).to.be.equals(ERROR_MESSAGE);
      });
    });
  
    describe('update throws an error', function () {
      const editPost = {
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
      };
  
      before(async function () {
        const stubThrows = { message: ERROR_MESSAGE };
        sinon.stub(BlogPost, 'update').throws(stubThrows);
  
        response = await chai.request(server)
        .put('/post/1')
        .send(editPost)
        .set('authorization', loginResponse.body.token);
      });
  
      after(function () { BlogPost.update.restore(); });
  
      it('returns status code 500', function () {
        expect(response).to.have.status(500);
      });
      it('response contains message with value "Error message"', function () {
        expect(response.body.message).to.be.equals(ERROR_MESSAGE);
      });
    });
  });
});
