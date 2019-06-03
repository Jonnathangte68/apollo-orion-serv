const { ApolloServer, gql } = require('apollo-server-micro');

const books = [
  { id: 1, title: 'The Trials of Brother Jero', rating: 8, authorId: 1 },
  { id: 2, title: 'Half of a Yellow Sun', rating: 9, authorId: 3 },
  { id: 3, title: 'Americanah', rating: 9, authorId: 3 },
  { id: 4, title: 'King Baabu', rating: 9, authorId: 1 },
  { id: 5, title: 'Children of Blood and Bone', rating: 8, authorId: 2 },
];

const authors = [
  { id: 1, firstName: 'Wole', lastName: 'Soyinka' },
  { id: 2, firstName: 'Tomi', lastName: 'Adeyemi' },
  { id: 3, firstName: 'Chimamanda', lastName: 'Adichie' },
];

const links = [
  { id: 1, title: 'Apple Sign In', points: 8, website: 'techcrunch.com', created: Date },
  { id: 2, title: '	WWDC 2019 Keynote Livestream ', points: 25, website: 'foundationinc.co', created: Date },
];

const typeDefs = gql`
  type Author {
    id: Int!
    firstName: String!
    lastName: String!
    books: [Book]! # the list of books by this author
  }
  type Book {
    id: Int!
    title: String!
    rating: Int!
    author: Author!
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
    book(id: Int!): Book!
    author(id: Int!): Author!
    link(id: Int!): Link!
  }
  # this schema allows the following mutation
  type Mutation {
    addBook(title: String!, rating: Int!, authorId: Int!): Book!
  }
`;

let bookId = 5;

const resolvers = {
  Query: {
    books: () => books,
    links: () => links,
    book: (_, { id }) => books.find(book => book.id === id),
    author: (_, { id }) => authors.find(author => author.id === id),
    link: (_, { id }) => links.find(link => link.id === id),
  },
  Mutation: {
    addBook: (_, { title, rating, authorId }) => {
      bookId++;

      const newBook = {
        id: bookId,
        title,
        rating,
        authorId,
      };

      books.push(newBook);
      return newBook;
    },
    addLink: (_, { title, points, userId, website, created }) => {
      linkId++;

      const newLink = {
        id: linkId,
        title, 
        points, 
        website, 
        created
      };

      links.push(newLink);
      return newLink;
    },
  },
  Author: {
    books: author => books.filter(book => book.authorId === author.id),
  },
  Book: {
    author: book => authors.find(author => author.id === book.authorId),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

module.exports = server.createHandler();
