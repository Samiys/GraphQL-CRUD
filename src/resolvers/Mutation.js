import { v1 as uuidv1 } from "uuid";
import Post from "./Post";

const Mutation = {
    createUser(parent, args, { db, pubsub }, info) {
        const emailTaken = db.users.some((user) => user.email === args.data.email)

        if (emailTaken) {
            throw new Error("Email Taken")
        }

        const user = {
            id: uuidv1(),
            ...args.data
        }
        db.users.push(user)
        return user
    },
    updateUser(parent, args, { db }, info) {
        const { id, data } = args
        const user = db.users.find((user) => user.id === id)

        if (!user) {
            throw new Error('User not found!')
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email)

            if (emailTaken) {
                throw Error('Email Taken!')
            }
            user.email = data.email
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.zid)

        if (userIndex === -1) {
            throw new Error("User not found!")

        }
        const deletedUsers = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id
            if (match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }
            return !match
        })
        db.comments = db.comments.filter((comment) => comment.author !== args.id)
        return deletedUsers[0]
    },
    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        if (!userExists) {
            throw new Error("User not found!")
        }

        const post = {
            id: uuidv1(),
            ...args.data
        }
        db.posts.push(post)

        if (args.data.published) {
            pubsub.publish('post', { post })
        }
        return post
    },
    updatePost(parent, args, { db }, info) {
        const { id, data } = args
        const post = db.posts.find((post) => post.id === id)        
        
        if (!Post) {
            throw new Error('Post not found!')
        }

        if (typeof data.title === 'string') {
            const postExists = db.posts.find((post) => post.title === data.title)

            if (postExists) {
                throw new Error('Title already exists!')
            }
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published
        }

        return post
    },

    deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id)
        if (postIndex === -1) {
            throw new Error('Post not found!')
        }

        const deletedPost = db.posts.splice(postIndex, 1)
        db.comments = db.comments.filter((comment) => comment.post !== args.id)
        return deletedPost[0]
    },
    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

        if (!userExists || !postExists) {
            throw new Error('Unable to find user and post!')
        }

        const comment = {
            id: uuidv1(),
            ...args.data
        }

        db.comments.push(comment)

        // Two arguments passed for publish
        // First is channel name defined in Subscription.js - we can access postId using args.data.post
        // Second is the actual data that we trying to publish
        pubsub.publish(`comment ${args.data.post}`, {comment: comment})

        return comment
    },
    updateComment(parent, args, { db }, info) {
        const { id, data } = args
        const comment = db.comments.find((comment) => comment.id === id)

        if (!comment) {
            throw new Error('Comment not found!')
        }
        
        if (typeof data.title === 'string') {
            if (data.title === db.comment.title) {
                throw new Error('Comment already exists!')
            }
            db.comment.title = data.title
        }

        return comment
    },
    deleteComment(parent,args, { db },  info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error('Comment not found!')
        }
        const deletedComments = db.comments.splice(commentIndex, 1)
        return deletedComments[0]
    }
}

export { Mutation as default }