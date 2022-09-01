const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const server = require('../../src/api');
const { BlogPost } = require('../../src/database/models');
const { BlogPost: postMock } = require('../mock/models');

chai.use(chaiHttp);
const { expect } = chai;

describe('BlogPost routes', function () {
  let response;
  let loginResponse;

  const post = {
    id: 1,
    title: 'Post do Ano',
    content: 'Melhor post do ano',
    userId: 1,
    published: '2011-08-01T19:58:00.000Z',
    updated: '2011-08-01T19:58:51.000Z',
    user: {
      id: 1,
      displayName: 'Lewis Hamilton',
      email: 'lewishamilton@gmail.com',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg',
    },
    categories: [
      {
        id: 1,
        name: 'Inovação',
      },
    ],
  };

  before(async function () {
    loginResponse = await chai.request(server)
    .post('/login')
    .send({
      email: 'lewishamilton@gmail.com',
      password: '123456',
    });
  });

  describe('GET /post', function () {
    describe('findAll returns all posts', function () {
      before(async function () {
        sinon.stub(BlogPost, 'findAll').callsFake(postMock.findAll);

        response = await chai.request(server)
        .get('/post')
        .set('authorization', loginResponse.body.token);
      });

      after(function () { BlogPost.findAll.restore(); });

      it('returns status code 200', function () {
        expect(response).to.have.status(200);
      });
      it('response is an array', function () {
        expect(response.body).to.be.an('array');
      });
      it('array elements are objects with expected values', function () {
        expect(response.body[0]).to.be.eql(post);
      });
    });
  });

  describe('GET /post/:id', function () {
    before(async function () { sinon.stub(BlogPost, 'findByPk').callsFake(postMock.findByPk); });

    after(function () { BlogPost.findByPk.restore(); });

    describe('With id from existing post', function () {
      before(async function () {
        response = await chai.request(server)
        .get('/post/1')
        .set('authorization', loginResponse.body.token);
      });

      it('returns status code 200', function () {
        expect(response).to.have.status(200);
      });
      it('response is an object with expected values', function () {
        expect(response.body).to.be.eql(post);
      });
    });

    describe('With id from post that doesn\'t exists', function () {
      before(async function () {
        response = await chai.request(server)
        .get('/post/id')
        .set('authorization', loginResponse.body.token);
      });

      it('returns status code 404', function () {
        expect(response).to.have.status(404);
      });
      it('response contains message with value "Post does not exist"', function () {
        expect(response.body.message).to.be.equals('Post does not exist');
      });
    });
  });
});
