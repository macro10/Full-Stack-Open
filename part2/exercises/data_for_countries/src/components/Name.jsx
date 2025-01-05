const Name = ({ nameObject, handleDelete }) => {
    return (
      <div>
        {nameObject.name}{' '}{nameObject.number}
        <button onClick={() => handleDelete(nameObject.id, nameObject.name)}>
          delete
        </button>
      </div>
    )
  }

export { Name }