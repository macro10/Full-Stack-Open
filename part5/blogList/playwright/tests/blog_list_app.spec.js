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
  })
})

/*
test('login fails with wrong password', async ({ page }) => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill('macro')
  await page.getByTestId('password').fill('wrong')
  await page.getByRole('button', { name: 'login' }).click()

  const errorDiv = await page.locator('.error')
  await expect(errorDiv).toContainText('wrong credentials')
  await expect(errorDiv).toHaveCSS('border-style', 'solid')
  await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

  await expect(page.getByText('McHale logged in')).not.toBeVisible()
})
*/