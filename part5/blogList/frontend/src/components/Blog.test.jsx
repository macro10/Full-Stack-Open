import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://testing-library.com/',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const user = {
    username: 'testuser',
    name: 'Test User'
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  const basicDiv = container.querySelector('.blog-basic')

  expect(basicDiv).toHaveTextContent('Component testing is done with react-testing-library')
  expect(basicDiv).toHaveTextContent('Test Author')

  expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
  expect(screen.queryByText('likes')).not.toBeInTheDocument()
})

test('renders the blogs URL and number of likes when view button is clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://testing-library.com/',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const user = {
    username: 'testuser',
    name: 'Test User'
  }

  render(<Blog blog={blog} user={user} />)


  const user_event = userEvent.setup()
  const button = screen.getByText('view')
  await user_event.click(button)

  expect(screen.getByText('https://testing-library.com/')).toBeDefined()
  expect(screen.getByText('likes 5')).toBeDefined()
})

test('if like button is clicked twice, event handler is called twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://testing-library.com/',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const user = {
    username: 'testuser',
    name: 'Test User'
  }

  const mockUpdateBlog = vi.fn()
  const mockDeleteBlog = vi.fn()

  render(
    <Blog
      blog={blog}
      user={user}
      updateBlog={mockUpdateBlog}
      deleteBlog={mockDeleteBlog}
    />
  )

  const user_event = userEvent.setup()

  // click view to show like button
  const viewButton = screen.getByText('view')
  await user_event.click(viewButton)

  // find and click the like button twice
  const likeButton = screen.getByText('like')
  await user_event.click(likeButton)
  await user_event.click(likeButton)

  // check that the mock function was called twice
  expect(mockUpdateBlog.mock.calls).toHaveLength(2)
})