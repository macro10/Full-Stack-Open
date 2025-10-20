const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostLikes = require('../utils/list_helper').mostLikes

describe('mostLikes', () => {
  const blogs = [
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      likes: 10
    },
    {
      title: "First class tests 2",
      author: "Robert C. Martin",
      likes: 5
    }
  ]

  test('returns the author with most total likes', () => {
    const result = mostLikes(blogs)
    const expected = {
      author: "Robert C. Martin",
      likes: 15  // 10 + 5
    }
    assert.deepStrictEqual(result, expected)
  })

  test('returns null for empty list', () => {
    const result = mostLikes([])
    assert.strictEqual(result, null)
  })
})