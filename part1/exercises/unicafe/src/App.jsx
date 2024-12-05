import { useState } from 'react'

const Display = props => <div>{props.text} {props.value}</div>


const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad
  if (total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <table>
      <tbody>
      <StatisticsLine text="good" value={props.good} />
      <StatisticsLine text="neutral" value={props.neutral} />
      <StatisticsLine text="bad" value={props.bad} />
      <StatisticsLine text="all" value={props.bad + props.neutral + props.good} />
      <StatisticsLine text="average" value={(props.bad + props.good) / 2} />
      <StatisticsLine text="positive" value={((props.good / (props.good + props.neutral + props.bad)) * 100) + " %"} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToValue = (newValue, setCategory) => {
    console.log('value now', newValue)
    setCategory(newValue)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setToValue(good + 1, setGood)} text="good" />
      <Button handleClick={() => setToValue(neutral + 1, setNeutral)} text="neutral" />
      <Button handleClick={() => setToValue(bad + 1, setBad)} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App