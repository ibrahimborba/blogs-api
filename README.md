# Welcome to Blogs API project!
A RESTful API that uses MSC architecture to manage a Blog's posts and users. Developed at [Trybe's](https://www.betrybe.com/) Back-end Module, ORM.


# Summary
- [Welcome to Blogs API project!](#welcome-to-blogs-api-project)
- [Summary](#summary)
- [Context](#context)
- [Technologies, tools and architectures used](#technologies-tools-and-architectures-used)
- [Installing and running the app](#installing-and-running-the-app)
- [Notes](#notes)
  - [Code quality](#code-quality)
  - [Git, GitHub and Commits](#git-github-and-commits)


# Context
This project is a __Blogs API__ that uses Sequlize to connect with a MySQL database to manage posts and users. A few notable points:
 * __Authentication and Authorization__ | Users can view and create any post as long as they're logged in. But, they can only edit and delete posts created by them.
 * __Validation__ | User input is validated through middlewares, whilst business rules are validated in the Service layer.
 * __Tests__ | Most of the the tests are [integration](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications), with a few [unit tests for middlewares](https://yonigoldberg.medium.com/yoni-goldberg-javascript-nodejs-testing-best-practices-2b98924c9347). Category routes are still to be tested, to improve [test coverage](https://martinfowler.com/bliki/TestCoverage.html).


# Technologies, tools and architectures used
This project used the following technologies and tools:
  * __Node.js, Express, Nodemon, Joi, JWT__ | [Create a HTTP API](http://expressjs.com/), [API routing](https://expressjs.com/en/guide/routing.html), [improve API development](https://www.npmjs.com/package/nodemon), [data validation](https://joi.dev/api/?v=17.6.0), [authentication and authorization](https://jwt.io/).
  * __Sequelize__ | [ORM](https://sequelize.org/v5/manual/getting-started.html), [create relationships between entities](https://medium.com/@eth3rnit3/sequelize-relationships-ultimate-guide-f26801a75554).
  * __Mocha, Chai, Sinon__ | [Integration and unit testing for Node.js](https://mochajs.org/).
  * __MSC Architecture__ | [Improve code organization, maintenance and scalability](https://martinfowler.com/architecture/).
  * __REST Architecture__ | [Simple architecture and highly popular](https://restfulapi.net/).

# Installing and running the app
### Install dependencies
```
cd blogs-api
npm install
```
### Run the application without Docker
Don't forget to create and setup an `.env` file to connect to your local MySQL. See `.env.example` for avaiable variables.

```
cd blogs-api
npm run debug
```

### Run the application with Docker (compose configs were developed by Trybe's team)
```
cd blogs-api
docker-compose up -d
docker exec -it blogs-api bash
npm install
npm run debug
```

### Run Tests
*Run all tests*
```
npm run test
```
*Run a specific test*
```
NAME=<testsname> npm run test
```
*See test coverage*
```
npm run test:coverage
```

### Run Lint
```
npm run lint
```

# Notes
## Code quality
To enforce Clean Code and good practices, the following standards and resources were used in this project:
* __Linter__ | Developed following the Clean Code standards specified by [Trybe's ESLint](https://github.com/betrybe/eslint-config-trybe).
* __SonarCloud__ | Passing [SonarCloud's](https://sonarcloud.io/) quality standards and analysis. Check the evaluation [here](https://sonarcloud.io/project/overview?id=ibrahimborba_store-manager).
## Git, GitHub and Commits
Commited using the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) with some types from [Angular convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

