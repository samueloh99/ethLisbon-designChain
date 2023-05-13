import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/46588/makiotest2/v1", // Replace with your subgraph's API endpoint
  cache: new InMemoryCache(),
});

export default client;
