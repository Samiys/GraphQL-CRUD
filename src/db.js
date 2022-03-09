
const users = [
    {
        id: '1',
        name: 'Sami',
        email: 'sam@gmail.com',
        age: 26
    },
    {
        id: '2',
        name: 'Ahsan',
        email: 'Ahsan@gmail.com',
        age: 19
    },
    {
        id: '3',
        name: 'Mohsin',
        email: 'mohsin@gmail.com',
        age: 28
    },
]

const posts = [
    {
        id: '1',
        title: 'Harry Potter I',
        body: 'Part I is fun to read',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'Harry Potter II',
        body: 'Part II is fun to read',
        published: true,
        author: '1'
    },
    {
        id: '3',
        title: 'Harry Potter III',
        body: 'Part III is fun to read',
        published: true,
        author: '3'
    },
]

const comments = [
    {
        id: '1',
        text: 'This is working fine.',
        author: '1',
        post: '1',
    },
    {
        id: '2',
        text: 'Glad you enjoyed it.',
        author: '2',
        post: '2',
    },
    {
        id: '3',
        text: 'This did not work.',
        author: '3',
        post: '3',
    },
]

const db = {
    users,
    posts,
    comments
}

export { db as default };