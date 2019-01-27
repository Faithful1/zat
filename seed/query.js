query {
    events {
        _id
        title
        description
    }
}



mutation {
    createUser(userInput: {
        _id: ""
        email: "test@test.com",
        password: "tester"
    }) {
        email
        password
    }
}

mutation {
    createEvent(eventInput: {
        _id: "",
        title: "Nato Fashion Week",
        description: "show case the best of Fashion from the heart of Africa"
        price: 990.99,
        date: "2019-01-15T11:14:29.249Z"
    }) {
        title
        description
        price
        date
    }
}


mutation {
    createEvent(eventInput: {
        _id: ""
        title: "Zambia International Trade Fair (ZITF) 55th edition",
        description: "It is a tradefair event",
        price: 99.9,
        date: "2011-10-05T14:48:00.000Z"
    }) {
        title
        description
    }
}