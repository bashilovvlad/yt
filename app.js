const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const schema = require('./graphql/schema');
const rootValue = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(isAuth);

// app.use((req, res, next) => {
//   console.log(1);
//   next();
// });
// app.use((req, res, next) => {
//   console.log(2);
//   next();
// });
// app.use((req, res, next) => {
//   console.log(3);
//   next();
// });

// Accept requests from our client

app.use(
  '/graphql',
  graphqlHttp({
    schema,
    rootValue,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-mebma.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });
