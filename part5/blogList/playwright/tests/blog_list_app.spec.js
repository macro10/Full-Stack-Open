const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'McHale',
        username: 'macro',
        password: '1234567'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'macro', '1234567')
      await expect(page.getByText('McHale logged-in')).toBeVisible()
    })

    test(' fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'macro', 'wrong')
      await expect(page.getByText('McHale logged-in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'macro', '1234567')
      await page.waitForSelector('div:has-text("blogs")')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'test blog',
        author: 'McHale Trotter',
        url: 'http://test.com'
      })
      await page.waitForSelector('.blog:has-text("test blog")')
      await expect(page.getByText('test blog McHale Trotter')).toBeVisible()
    })

    test('test blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'test blog',
        author: 'McHale Trotter',
        url: 'http://test.com'
      })
      await page.waitForSelector('.blog:has-text("test blog McHale Trotter")')
      await page.getByRole('button', { name: 'view' }).click()

      const beforeLikeText = await page.getByText('likes', { exact: false }).textContent()
      const likesBefore = parseInt(beforeLikeText.split(' ')[1])

      await page.getByRole('button', { name: 'like' }).click()

      await page.waitForFunction((previousLikes) => {
        const likesText = document.querySelector('.blog-details').textContent
        const currentLikes = parseInt(likesText.match(/likes (\d+)/)[1])
        return currentLikes > previousLikes
      }, likesBefore)

      const afterLikeText = await page.getByText('likes', { exact: false }).textContent()
      const likesAfter = parseInt(afterLikeText.split(' ')[1])

      expect(likesAfter).toBe(likesBefore + 1)
    })

    test('blog can be deleted by the user who created it', async ({ page }) => {
      await createBlog(page, {
        title: 'test blog',
        author: 'McHale Trotter',
        url: 'http://test.com'
      })

      await page.waitForSelector('.blog:has-text("test blog McHale Trotter")')

      await page.getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: 'delete' }).click()

      await expect(page.getByText('test blog McHale Trotter')).not.toBeVisible()
    })

    test('delete button is only visible to blog creator', async ({ page, request }) => {
      // create a blog as first user
      await createBlog(page, {
        title: 'test blog',
        author: 'McHale Trotter',
        url: 'http://test.com'
      })

      await page.waitForSelector('.blog:has-text("test blog")')

      // create another user
      await request.post('/api/users', {
        data: {
          name: 'Another User',
          username: 'another',
          password: '1234567'
        }
      })

      // logout first user
      await page.getByRole('button', { name: 'logout' }).click()

      // login as new user
      await loginWith(page, 'another', '1234567')

      // view the blog details
      await page.waitForSelector('.blog:has-text("test blog McHale Trotter")')
      await page.getByRole('button', { name: 'view' }).click()

      // verify delete is not visible for new user
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()

      // logout new user
      await page.getByRole('button', { name: 'logout' }).click()

      // login with original user
      await loginWith(page, 'macro', '1234567')

      // view blog details again
      await page.waitForSelector('.blog:has-text("test blog McHale Trotter")')
      await page.getByRole('button', { name: 'view' }).click()

      // verify delete button is visible for original user
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
    })

    test('blogs are ordered by likes in descending order', async ({ page }) => {
      await createBlog(page, {
        title: 'Blog with least likes',
        author: 'Author 1',
        url: 'http://test1.com'
      })
      await page.waitForSelector('.blog:has-text("Blog with least likes")')

      await createBlog(page, {
        title: 'Blog with most likes',
        author: 'Author 2',
        url: 'http://test2.com'
      })
      await page.waitForSelector('.blog:has-text("Blog with most likes")')

      await createBlog(page, {
        title: 'Blog with medium likes',
        author: 'Author 3',
        url: 'http://test3.com'
      })
      await page.waitForSelector('.blog:has-text("Blog with medium likes")')

      // helper to like a blog a specific number of timmes
      const likeBlog = async (title, numberOfLikes) => {
        // find and click view button for specific blog
        const blogLocator = page.locator('.blog', { hasText: title })
        await blogLocator.getByRole('button', { name: 'view' }).click()

        // click like button the specified number of times
        for (let i = 0; i < numberOfLikes; i++) {
          await blogLocator.getByRole('button', { name: 'like' }).click()
          // wait for likes to update before next click
          await page.waitForTimeout(150)
        }
      }

      // add different numbers of likes to each blog
      await likeBlog('Blog with most likes', 5)
      await likeBlog('Blog with medium likes', 3)
      await likeBlog('Blog with least likes', 1)

      // get all blog elements
      const blogs = await page.locator('.blog').all()

      // get titles in order they appear
      const titles = await Promise.all(
        blogs.map(blog => blog.textContent())
      )

      // verify order
      expect(titles[0]).toContain('Blog with most likes')
      expect(titles[1]).toContain('Blog with medium likes')
      expect(titles[2]).toContain('Blog with least likes')
    })
  })
})