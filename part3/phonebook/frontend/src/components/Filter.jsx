const Filter = ({ filter, handle }) => {
    return (
        <div>
            filter shown with{' '}
            <input
            value={filter}
            onChange={handle}
            />
        </div>
    )
}

export { Filter }