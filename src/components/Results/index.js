import React from 'react'
import {Link} from 'react-router-dom'

const Results = ({timeTaken, score, onReattempt}) => {
  const formatTime = () => {
    const hours = Math.floor(timeTaken / 3600)
    const minutes = Math.floor((timeTaken % 3600) / 60)
    const seconds = timeTaken % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div>
      <header>
        <Link to='/'>
          <img src='/logo.png' alt='website logo' />
        </Link>
        <button>Logout</button>
      </header>
      <main>
        <h1>Congrats! You completed the assessment</h1>
        <p>Time Taken: {formatTime()}</p>
        <p>Your Score: {score}</p>
        <button onClick={onReattempt}>Reattempt</button>
      </main>
    </div>
  )
}

export default Results
