const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Event = require('./models/event')
const User = require('./models/user')

const app = express()

app.use(bodyParser.json())

// const events = []

// we use our middleware (graphqlHttp) to reach our graphql endpoint and we also pass
// javascript object where we configure our API like where do i find your schema that defines the ENDPOINT/queries you can handle
// where do i find the resolvers TO WHICH MY REQUEST should be forwarded once i find the request you wanna handle
// tales two keys (schema, rootvalue)
app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(
      `
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input EventInput {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        _id: ID!
        email: String!
        password: String!
      }

      type RootQuery {
          events: [Event!]!
      }

      type RootMutation {
          createEvent(eventInput:EventInput): Event
          createUser(userInput:UserInput): User
      }

      schema {
          query: RootQuery
          mutation: RootMutation
      }
    `
    ),
    // root value will point to an object that has all the resolver functions
    // and the functions should match our schema by name
    // below is what a resolver looks like
    // event resolver function to return a list of all our events so any query for event
    // will return events must be same name and we must call this to return from db
    rootValue: {
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              // _doc is your db provided by mongoose package
              return { ...event._doc,
                _id: event.id
              }
            })
          })
          .catch(err => {
            throw err
          })
      },
      // +sign is for converting to a number/float
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '5c3db370a3a3f24f843ce9f3'
        })
        // return the event promise and save to db
        let createdEvent
        return event
          .save()
          .then(result => {
            createdEvent = { ...result._doc, _id: result._doc._id.toString() }
            return User.findById('5c3db370a3a3f24f843ce9f3')
          })
          .then(user => {
            if (!user) {
              throw new Error('User not Found')
            }
            user.createdEvents.push(event)
            return user.save()
          })
          .then(result => {
            return createdEvent
          })
          .catch(err => {
            console.log(err)
            throw err
          })
      },
      createUser: args => {
        // check for the same user in the db
        return User.findOne({ email: args.userInput.email })
          .then(user => {
            if (user) {
              throw new Error('Email exists already')
            }
            return bcrypt.hash(args.userInput.password, 12)
          })
          .then(hashedPassword => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            })
            // lets save to our db
            return user.save()
          })
          .then(result => {
            return { ...result._doc,
              password: null,
              _id: result.id
            }
          })
          .catch(err => {
            console.log(err)
            throw err
          })
      }
    },
    graphiql: true
  })
)

// connect our mongodb database
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
