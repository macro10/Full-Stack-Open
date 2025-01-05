import { useState, useEffect } from 'react'

const Countries = ({ countries, setFilter }) => {
    console.log('Rendering Countries component with:', countries?.length, 'countries')

    if (!countries || !Array.isArray(countries)) {
        return <div>Loading...</div>
    }

    if (countries.length === 0) {
        return (
            <div>
                No countries match your search!
            </div>
        )
    }
    if (countries.length > 10) {
        return <div>Too many matches, specify another filter</div>
    }
    if (countries.length === 1) {
        const country = countries[0]
        const api_key = import.meta.env.VITE_WEATHER_API_KEY
        const [weather, setWeather] = useState(null)

        useEffect (() => {
            const capital = country.capital[0]
            console.log('Fetching weather for:', capital)

            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    console.log('Weather data:', data)
                    setWeather(data)
                })
                .catch(error => console.error('Error fetching weather:', error))
        }, [country.capital])

        console.log('Showing single country:', country)
        return (
            <div>
                <h2>{country.name.common}</h2>
                capital {country.capital} <br></br>
                area {country.area}
                <p><strong>languages:</strong></p>
                <ul>
                    {Object.values(country.languages).map(language =>
                        <li key={language}>{language}</li>
                    )}
                </ul>
                <img
                    src={country.flags.svg}
                    alt={country.flags.alt}
                    style={{ width: '150px' }}
                />
                <h3><strong>Weather in {country.capital}</strong></h3>
                {weather && (
                    <div>
                        <p>temperature {weather.main.temp} Celcius</p>
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                        />
                        <p>wind {weather.wind.speed} m/s</p>
                    </div>
                )}
            </div>
        )
    }

    console.log('Showing country list')
    return (
        <div>
            {countries.map(country =>
                <div key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => setFilter(country.name.common)}>show</button>
                </div>
            )}
        </div>
    )
}

export { Countries }