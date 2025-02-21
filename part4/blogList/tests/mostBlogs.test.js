const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostBlogs = require('../utils/list_helper').mostBlogs

describe('mostBlogs', () => {
  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Robert C. Martin",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Clean Code",
      author: "Robert C. Martin",
      url: "http://example.com",
      likes: 12,
      __v: 0
    }
  ]

  test('returns the author with most blogs', () => {
    const result = mostBlogs(blogs)
    const expected = {
      author: "Robert C. Martin",
      blogs: 2
    }
    assert.deepStrictEqual(result, expected)
  })

  test('returns null for empty list', () => {
    const result = mostBlogs([])
    assert.strictEqual(result, null)
  })
})