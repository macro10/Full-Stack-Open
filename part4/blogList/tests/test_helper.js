const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "how to code",
    author: "steve jobs",
    url: "apple.com",
    likes: 50
  },
  {
    title: "how not to code",
    author: "steve wozniak",
    url: "apple.com",
    likes: 100
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}