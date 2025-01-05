const PersonForm = ({ formData, handlers}) => {
    return (
        <form onSubmit={handlers.addName}>
        <div>
          name: 
          <input
            value={formData.newName}
            onChange={handlers.handleNameChange}
          />
        </div>
        <div>
          number:
          <input
            value={formData.newNumber}
            onChange={handlers.handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export { PersonForm }