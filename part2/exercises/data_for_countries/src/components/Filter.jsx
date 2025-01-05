const Filter = ({ filter, handle }) => {
    return (
        <div>
            find countries{' '}
            <input
            value={filter}
            onChange={handle}
            />
        </div>
    )
}

export { Filter }