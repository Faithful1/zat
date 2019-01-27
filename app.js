const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/reolvers/index.js');

const app = express()

app.use(bodyParser.json())

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
    }@cluster0-uot4e.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
    )
    .then(() => {
        app.listen(3030)
    })
    .catch(err => {
        console.log(err)
    })