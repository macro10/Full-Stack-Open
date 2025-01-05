import { Name } from './Name'

const Persons = ({ persons, filter, handleDelete }) => {
    return (
        <div>
            {persons.filter(nameObject =>
                nameObject.name.toLowerCase().includes(filter.toLowerCase())
            ).map(nameObject =>
                <Name key={nameObject.id} nameObject={nameObject} handleDelete={handleDelete} />
            )}
        </div>
    )
}

export { Persons }