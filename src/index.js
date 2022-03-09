import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";
import Query from "./resolvers/Query";

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment,
    },
    context: {
        db
    }
})

server.start(() => {
    console.log('The Server is up!')
})