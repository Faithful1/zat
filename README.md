It is a simple Events Application for checking and buying tickets for all sorts of events in Zed

Built with MERN Stack and graphql for all event goers


mutation {
  createEvent(eventInput:{
    _id: ""
    title: "Zambia International Trade Fair (ZITF) 55th edition",
    description: "It is a tradefair event",
    price: 99.9,
    date:"2011-10-05T14:48:00.000Z"
  })
  {
    title
    description
  }
}
