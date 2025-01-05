import { useState, useEffect } from 'react'
import { Filter } from './components/Filter'
import { Notification } from './components/Notification'
import { Countries } from './components/Countries'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('Starting fetch...')
      axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
          console.log('Data received:', response.data.slice(0, 3))
          setCountries(response.data)
        })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredCountries = countries.filter(country => {
    console.log('Filtering country:', country.name.common)
    return country.name.common.toLowerCase().includes(filter.toLowerCase())
  })
  console.log('Filter value:', filter)
  console.log('Filtered countries:', filteredCountries.length)


  return (
    <div>
      <Notification message={errorMessage} />
      <Filter filter={filter} handle={handleFilterChange} />
      {/* Returns countries if there are less than 10 results,
          returns basic data of the country when only one matches query*/}
      <Countries countries={filteredCountries} setFilter={setFilter} />
    </div>
  )
}

export default App