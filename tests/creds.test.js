const request = require('supertest')
const app = require('../app')
const User = require('../models/user_model')
const Post = require('../models/post_model')
const agent = request.agent(app)

const randNumString = Date.now().toString()

userOne = {
    username: 'user' + randNumString,
    password: 'qweQWE123',
    first_name: 'UserName'
}
postOne = {
    title: 'Some Title ' + randNumString,
    content: 'contentcontentcontentcontent'
}

test('Signup and Login User', async () =>{
    await agent.post('/user/signup').send(userOne).expect(302)
    await agent.get('/user/log_out').expect(302)
    await agent.post('/user/login').send(userOne).expect(302)
})

test('Profile Page', async () =>{
    await agent.get('/user/profile').expect(200)
})

test('Create Post', async () =>{
    const respond = await agent.post('/post/upload').send(postOne).expect(200)
    expect(respond.text.split(' ')[0]).toBe('Uploaded!')
})

test('Delete Post', async () =>{
    const deletedPost = await Post.delete(postOne)
    expect(deletedPost.title).toBe(postOne.title)
})

test('Logout and Delete User', async () =>{
    await agent.get('/user/log_out').expect(302)

    const deletedUser = await User.delete(userOne)
    expect(deletedUser.username).toBe(deletedUser.username)
})
