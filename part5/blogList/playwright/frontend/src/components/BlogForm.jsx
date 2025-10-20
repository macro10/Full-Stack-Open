import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title:<input
          name="title"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          placeholder="write title here"
        />
        <br></br>
        author:<input
          name="author"
          value={newAuthor}
          onChange={event => setNewAuthor(event.target.value)}
          placeholder="write author here"
        />
        <br></br>
        url:<input
          name="url"
          value={newUrl}
          onChange={event => setNewUrl(event.target.value)}
          placeholder="write url here"
        />
        <br></br>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm