const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/reolvers/index.js');
const isAuth = require('./middleware/is-auth');

const app = express()

app.use(bodyParser.json())

// bring in the isAuth middleware to protect our resolvers
// express uses it as a valid middleware since it has req res next
// it will run on every request in every resolver
app.use(isAuth)

// we use our middleware (graphqlHttp) to reach our graphql endpoint and we also pass
// javascript object where we configure our API like where do i find your schema that defines the ENDPOINT/queries you can handle
// where do i find the resolvers TO WHICH MY REQUEST should be forwarded once i find the request you wanna handle
// tales two keys (schema, rootvalue)
app.use(
    '/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
);

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@cluster0-uot4e.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true }
    )
    .then(() => {
        app.listen(3005)
    })
    .catch(err => {
        console.log(err)
    })