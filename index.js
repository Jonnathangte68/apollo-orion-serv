const { ApolloServer, gql } = require('apollo-server-micro');

const books = [
  { id: 1, title: 'The Trials of Brother Jero', rating: 8 },
  { id: 2, title: 'Half of a Yellow Sun', rating: 9 },
  { id: 3, title: 'Americanah', rating: 9 },
  { id: 4, title: 'King Baabu', rating: 9 },
  { id: 5, title: 'Children of Blood and Bone', rating: 8 },
];

const links = [
  { id: 1, title: 'Apple Sign In', points: 8, website: 'techcrunch.com', created: Date },
  { id: 2, title: '	WWDC 2019 Keynote Livestream ', points: 25, website: 'foundationinc.co', created: Date },
];

const typeDefs = gql`
  type Book {
    id: Int!
    title: String!
    rating: Int!
  }
  type Link {
    id: Int!
    title: String!
    points: Int!
    website: String! 
    created: Date!
  }
  # the schema allows the following query
  type Query {
    books: [Book!]!
    links: [Link!]!
    book(id: Int!): Book!
    link(id: Int!): Link!
  }
  # this schema allows the following mutation
  type Mutation {
    addBook(title: String!, rating: Int!): Book!
  }
`;

let bookId = 5;

const resolvers = {
  Query: {
    books: () => books,
    links: () => links,
    book: (_, { id }) => books.find(book => book.id === id),
    link: (_, { id }) => links.find(link => link.id === id),
  },
  Mutation: {
    addBook: (_, { title, rating }) => {
      bookId++;

      const newBook = {
        id: bookId,
        title,
        rating,
      };

      books.push(newBook);
      return newBook;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

module.exports = server.createHandler();
