import Cookies from 'js-cookie'
import React, {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Results from '../Results'

class Assessment extends Component {
  state = {
    questions: [],
    currentQuestionIndex: 0,
    answeredQuestions: 0,
    unansweredQuestions: 0,
    timer: 600,
    isLoading: true,
    isSubmitting: false,
    startTime: null,
    endTime: null,
    showResults: false,
    score: 0,
  }

  componentDidMount() {
    this.fetchQuestions()
    this.startTimer()
  }

  fetchQuestions = async () => {
    try {
      const response = await fetch('https://apis.ccbp.in/assess/questions')
      if (response.ok) {
        const data = await response.json()
        this.setState({
          questions: data.questions,
          unansweredQuestions: data.total,
          isLoading: false,
        })
      } else {
        throw new Error('Failed to fetch questions')
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  startTimer = () => {
    this.timerInterval = setInterval(() => {
      this.setState(
        prevState => ({timer: prevState.timer - 1}),
        () => {
          if (this.state.timer === 0) {
            clearInterval(this.timerInterval)
            this.submitAssessment()
          }
        },
      )
    }, 1000)
  }

  handleOptionClick = () => {
    this.setState(prevState => ({
      answeredQuestions: prevState.answeredQuestions + 1,
      unansweredQuestions: prevState.unansweredQuestions - 1,
    }))
  }

  handleQuestionClick = index => {
    this.setState({currentQuestionIndex: index})
  }

  handleNextQuestion = () => {
    this.setState(prevState => ({
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }))
  }

  submitAssessment = async () => {
    try {
      this.setState({isSubmitting: true, endTime: new Date().getTime()})

      // Calculate time taken
      const {startTime, endTime} = this.state
      const timeTaken = Math.floor((endTime - startTime) / 1000)

      // Calculate score (example calculation)
      const score = Math.floor(
        (this.state.answeredQuestions / this.state.questions.length) * 100,
      )

      // Simulate submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000))

      this.setState({showResults: true, timeTaken, score})
    } catch (error) {
      console.error('Error submitting assessment:', error)
    }
  }

  handleReattempt = () => {
    this.setState({
      showResults: false,
      currentQuestionIndex: 0,
      answeredQuestions: 0,
      unansweredQuestions: this.state.questions.length,
      timer: 600,
      startTime: null,
      endTime: null,
      isSubmitting: false,
      score: 0,
    })

    this.startTimer()
  }

  render() {
    const {
      questions,
      currentQuestionIndex,
      timer,
      isLoading,
      isSubmitting,
      answeredQuestions,
      unansweredQuestions,
      showResults,
      timeTaken,
      score,
    } = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    if (isLoading) {
      return (
        <div data-testid="loader">
          <p>Loading...</p>
        </div>
      )
    }

    if (isSubmitting) {
      return <Redirect to="/results" />
    }

    if (showResults) {
      return (
        <Results
          timeTaken={timeTaken}
          score={score}
          onReattempt={this.handleReattempt}
        />
      )
    }

    const currentQuestion = questions[currentQuestionIndex]

    return (
      <div>
        <header>
          <Link to="/">
            <img src="/logo.png" alt="website logo" />
          </Link>
          <button onClick={this.props.onLogout}>Logout</button>
        </header>
        <h1>Assessment</h1>
        <p>Time Left: {new Date(timer * 1000).toISOString().substr(11, 8)}</p>
        <p>Answered Questions</p>
        <p>Unanswered Questions</p>
        <p>Answered Questions {answeredQuestions}</p>
        <p>Unanswered Questions {unansweredQuestions}</p>
        <h2>Questions ({questions.length})</h2>
        <p>{currentQuestion?.question_text}</p>
        <Options
          options={currentQuestion?.options}
          optionType={currentQuestion?.options_type}
          onOptionClick={this.handleOptionClick}
        />
        <QuestionNumbers
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onQuestionClick={this.handleQuestionClick}
        />
        {currentQuestionIndex < questions.length - 1 && (
          <button onClick={this.handleNextQuestion}>Next Question</button>
        )}
        <button onClick={this.submitAssessment}>Submit Assessment</button>
      </div>
    )
  }
}

const Options = ({options, optionType, onOptionClick}) => {
  if (!options) return null

  if (optionType === 'DEFAULT') {
    return (
      <ul>
        {options.map(option => (
          <li key={option.id} onClick={onOptionClick}>
            {option.text}
          </li>
        ))}
      </ul>
    )
  } else if (optionType === 'IMAGE') {
    return (
      <ul>
        {options.map(option => (
          <li key={option.id} onClick={onOptionClick}>
            <img src={option.image_url} alt={option.text} />
          </li>
        ))}
      </ul>
    )
  } else if (optionType === 'SINGLE_SELECT') {
    return (
      <select onChange={onOptionClick}>
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.text}
          </option>
        ))}
      </select>
    )
  }
}

const QuestionNumbers = ({
  questions,
  currentQuestionIndex,
  onQuestionClick,
}) => {
  return (
    <ul>
      {questions.map((question, index) => (
        <li key={index} onClick={() => onQuestionClick(index)}>
          {index + 1}
        </li>
      ))}
    </ul>
  )
}

export default Assessment
