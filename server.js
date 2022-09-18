var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
// 后端定义的 schema 告诉了你你可以从哪些字段中进行选择然后返回给前端
// 暴露哪些字段给前端
var schema = buildSchema(`
  type Rect {
    width: Int!
    height: Int!
  }
  input RectInput {
    id: Int!
    width: Int!
    height: Int!
  }
  type Query {
    rect(width: Int, height: Int): Rect
    getRect(id: Int): Rect
  }
  type Mutation {
    updateRect(input: RectInput): Rect 
    createRect(input: RectInput): Rect
  }
`);

class Rect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  area = () => this.width * this.height;
}
// The root provides a resolver function for each API endpoint
// 提供具体的返回数据
var fakeDatabase = {};
var root = {
  rect: ({width, height}) => {
    return new Rect(width, height);
  },
  createRect: ({ input }) => {
    fakeDatabase[input.id] = input;
  },
  updateRect: ({ input }) => {
    fakeDatabase[input.id] = input;
  },
  getRect: ({ id }) => {
    return fakeDatabase[id];
  }
};


var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');

/*var query = `mutation CreateRect {createRect(input: {id: 1, width: 2, height: 3}) { width }}`;

fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query
  })
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));

var query = `{getRect(id: 1) { width }}`;

fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query
  })
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));*/
