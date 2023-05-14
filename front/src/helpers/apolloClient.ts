import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/46781/grapdesignchain/v1",
  cache: new InMemoryCache(),
});

export default client;
