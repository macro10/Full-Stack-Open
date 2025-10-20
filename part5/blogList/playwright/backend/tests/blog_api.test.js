const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  console.log('cleared')

  // create test user
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'boot', passwordHash })
  await user.save()

  // login and get token
  const response = await api
    .post('/api/login')
    .send({ username: 'boot', password: 'sekret' })

  token = response.body.token

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({
      ...blog,
      user: user._id
    }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog posts have id property instead of _id', async () => {
  const response = await api.get('/api/blogs')

  assert(response.body.length > 0)

  assert(response.body[0].id)

  assert(!response.body[0]._id)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "what is windows",
    author: "bill gates",
    url: "windows.com",
    likes: 69
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  assert(contents.includes("what is windows"))
})

test('if likes property is missing from added blog, if defaults to 0', async () => {
  const newBlog = {
    title: "Blog without likes",
    author: "Unknown",
    url: "http://example.com"
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: "someone",
    url: "http://example.com",
    likes: 0
  }
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: "something",
    author: "someone",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('adding a blog fails with proper status code if token is not provided', async () => {
  const newBlog = {
    title: "test blog",
    author: "test author",
    url: "http://test.com",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})


test('deleted blog succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

test('updating blog likes succeeds with a status code of 200', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
})



after(async () => {
  await mongoose.connection.close()
})