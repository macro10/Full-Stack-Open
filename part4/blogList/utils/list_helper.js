const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((favorite, blog) => 
    blog.likes > favorite.likes ? blog : favorite
  , blogs[0])

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  // count blogs per author
  const blogCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})

  // find author with most blogs
  const mostBlogs = Object.entries(blogCounts).reduce((max, [author, count]) => 
    count > max.blogs ? { author, blogs: count } : max
  , { author: '', blogs: 0 })

  return mostBlogs
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  // count likes per author
  const authorLikes = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
    return likes
  }, {})

  // find author with most likes
  const mostLikes = Object.entries(authorLikes).reduce((max, [author, likes]) => 
    likes > max.likes ? { author, likes } : max
  , { author: '', likes: 0 })
  return mostLikes
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}