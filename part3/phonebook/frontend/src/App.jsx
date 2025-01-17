import { useState, useEffect } from 'react'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import { Persons } from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
      personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)
    
    if (existingPerson) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
            setNewName('')
            setNewNumber('')
            setErrorMessage(
              `Updated ${existingPerson.name}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
          .catch(error => {
          setErrorMessage(
            `Information of '${existingPerson.name}' has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(n => n.id !== existingPerson.id))
          })
      }
      return
    }
    
    const nameObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setErrorMessage(
          `Added ${nameObject.name}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleDelete = (id, name) => {
    if(window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter filter={filter} handle={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm 
        formData={{ newName, newNumber }}
        handlers={{ addName, handleNameChange, handleNumberChange }}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  )
}

export default App