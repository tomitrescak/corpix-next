import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

export const resolvers = {
  Query: {
    hello: (_parent: any, _args: any, _context: any) => "Hello!: " + Date.now(),
  },
};
