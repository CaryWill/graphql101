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
    name: String
  }
  type Query {
    rect(width: Int, height: Int, name: String): Rect
  }
`);

class Rect {
  constructor(width, height, name) {
    this.width = width;
    this.height = height;
    this.name = name;
  }

  area = () => this.width * this.height;

  cir = () => 2 * (this.width + this.height);
}
// The root provides a resolver function for each API endpoint
// 提供具体的返回数据
var root = {
  rect: ({width, height, name}) => {
    return new Rect(width, height, name);
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

/*
// 前端
var width = 3;
var height = 6;
var name = 'a rect'
var query = `query Rect($width: Int!, $height: Int, $name: String) {
  rect(width: $width, height: $height, name: $name) {
    width,
    height,
    name
  }
}`;

fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: { width, height, name },
  })
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));
*/
