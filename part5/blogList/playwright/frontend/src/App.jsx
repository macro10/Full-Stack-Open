import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogListUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        const blogWithUser = {
          ...returnedBlog,
          user: returnedBlog.user || user
        }
        setBlogs(blogs.concat(returnedBlog))
      })

    setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const deleteBlog = async (blogToDelete) => {
    try {
      if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
        await blogService.remove(blogToDelete.id)
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
        setErrorMessage(`Deleted ${blogToDelete.title}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    } catch (exception) {
      setErrorMessage('Error deleting blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (blogToUpdate) => {
    try {
      const updatedBlog = await blogService.update(blogToUpdate.id, blogToUpdate)
      setBlogs(blogs.map(blog =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      ))
    } catch (exception) {
      setErrorMessage('Error updating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
  }

  const loginForm = () => (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </div>
    )
  }

  /*
  if (!blogs || blogs.length === 0) {
    return <div>Loading...</div>
  }
  */

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      {user.name} logged-in { }
      <button onClick={handleLogout}>
          logout
      </button>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
      {!blogs ? (<div>Loading...</div>) : (
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              user={user}
            />
          )
      )}
    </div>
  )
}

export default App