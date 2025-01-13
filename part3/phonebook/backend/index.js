const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json()) // specify the use of json parser

let persons = [
    {
        id: "1",
        name: "emma stone",
        number: 123456
    },
    {
        id: "2",
        name: "andrew garfield",
        number: 654321
    },
    {
        id: "3",
        name: "robert downey jr",
        number: 162534
    },
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    // update persons to contain all, but the one we are deleting
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => Number(n.id))) // calculate max id
        : 0 // if persons length is zero return 0
    return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if ((!body.name) || (!body.number)) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    
    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})