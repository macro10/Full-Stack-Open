const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}


const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByPlaceholder('write title here').fill(title)
  await page.getByPlaceholder('write author here').fill(author)
  await page.getByPlaceholder('write url here').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(title).waitFor()
}


export { loginWith, createBlog }