const { buildSchema } = require('graphql');

const schema = new buildSchema(`

    type Post {
        description: String,
        author: User,
        image: String,
        myPost: Boolean,
        likes: Int,
        like: Boolean,
        date: String,
        postId: String
    }

    type User {
        name: String,
        photo: String,
        signed: Boolean,
        myProfile: Boolean,
        userId: String
    }

    type Query {
        user(id: String!): User,
        posts: [Post],
        users: [User],
        followers(userId: String!): [User],
        following(userId: String!): [User]
    }

    type Mutation {
        createPost(description: String!, image: String!): Post,
        deletePost(postId: String!): String,
        editPhoto(filename: String!): String,
        like(postId: String!): Post,
        unlike(postId: String!): Post,
        follow(userId: String!): Boolean,
        unfollow(userId: String!): Boolean,
    }

    type Subscription {
        postUpdated: Post,
        postCreated: Post,
        postDeleted: String,
        greeting: String
    }

`)

module.exports = schema;