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

describe('BlogPost edit routes', function () {
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
        title: 'Latest updates, August 2st',
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
        expect(response.body.title).to.be.equal('Latest updates, August 2st');
      });
    });

    describe('When no category id exist in database', function () {
      const noCategory = {
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post',
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

  describe('PUT /post/:id', function () {
    const editPost = {
      title: 'Latest updates, August 1st',
      content: 'The whole text for the blog post goes here in this key',
    };

    describe('Request with valid information', function () {
      before(async function () {
        sinon.stub(BlogPost, 'update').callsFake(postMock.update);
        sinon.stub(BlogPost, 'findOne').callsFake(postMock.findOne);

        response = await chai.request(server)
        .put('/post/2')
        .send(editPost)
        .set('authorization', loginResponse.body.token);
      });

      after(function () {
        BlogPost.update.restore();
        BlogPost.findOne.restore();
      });

      it('returns status code 200', function () {
        expect(response).to.have.status(200);
      });
      it('response is an object with edited values', function () {
        expect(response.body.title).to.be.equal(editPost.title);
        expect(response.body.content).to.be.equal(editPost.content);
      });
    });

    describe('When a user tries to edit a post from another user', function () {
      before(async function () {
        sinon.stub(BlogPost, 'update').callsFake(postMock.update);
        sinon.stub(BlogPost, 'findOne').callsFake(postMock.findOne);

        const differentUser = await chai.request(server)
        .post('/login')
        .send({
          email: 'michaelschumacher@gmail.com',
          password: '123456',
        });
               
        response = await chai.request(server)
        .put('/post/1')
        .send(editPost)
        .set('authorization', differentUser.body.token);
      });

      after(function () {
        BlogPost.update.restore();
        BlogPost.findOne.restore();
      });
    
      it('returns status code 401', function () {
        expect(response).to.have.status(401);
      });
      it('response is an object', function () {
        expect(response.body).to.be.an('object');
      });
      it('response contains message with value "Unauthorized user"', function () {
        expect(response.body.message).to.be.equals('Unauthorized user');
      });
    });
  });
});
