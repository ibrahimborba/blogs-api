const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const server = require('../../src/api');
const { BlogPost, Category, PostCategory } = require('../../src/database/models');
const {
  BlogPost: postMock, Category: categoryMock, PostCategory: postCatMock,
} = require('../mock/models');

chai.use(chaiHttp);
const { expect } = chai;

describe('BlogPost routes', function () {
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

  describe('POST /post', function () {
    before(async function () {
      sinon.stub(BlogPost, 'create').callsFake(postMock.create);
      sinon.stub(Category, 'findAndCountAll').callsFake(categoryMock.findAndCountAll);
      sinon.stub(PostCategory, 'bulkCreate').callsFake(postCatMock.bulkCreate);
    });

    after(function () {
      BlogPost.create.restore();
      Category.findAndCountAll.restore();
      PostCategory.bulkCreate.restore();
    });

    describe('Request with valid information', function () {
      const newPost = {
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
        categoryIds: [1, 2],
      };
    
      before(async function () {
        response = await chai.request(server)
        .post('/post')
        .send(newPost)
        .set('authorization', loginResponse.body.token);
      });

      it('returns status code 201', function () {
        expect(response).to.have.status(201);
      });
      it('response is an object with title', function () {
        expect(response.body.title).to.be.equal('Latest updates, August 1st');
      });
    });

    describe('When no category id exist in database', function () {
      const noCategory = {
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
        categoryIds: [10],
      };

      before(async function () {       
        response = await chai.request(server)
        .post('/post')
        .send(noCategory)
        .set('authorization', loginResponse.body.token);
      });
    
      it('returns status code 400', function () {
        expect(response).to.have.status(400);
      });
      it('response is an object', function () {
        expect(response.body).to.be.an('object');
      });
      it('response contains message with value "categoryIds" not found"', function () {
        expect(response.body.message).to.be.equals('"categoryIds" not found');
      });
    });
  });

  describe('When functions throw an error', function () {
    const ERROR_MESSAGE = 'Something went wrong';
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
  });
});
