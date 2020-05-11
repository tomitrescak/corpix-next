import { ApolloServer, gql } from "apollo-server-micro";
import Cors from "micro-cors";
import { typeDefs, resolvers } from "@server/resolvers";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return {};
  },
});

const handler = apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "OPTIONS"],
});

export default cors(handler);
