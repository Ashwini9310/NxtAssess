import Cookies from 'js-cookie'
import {Link, Redirect} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">Instructions</h1>
          <img
            src="https://th.bing.com/th/id/OIP.0f7QCps1Dssq7qBA85K5BwHaEY?rs=1&pid=ImgDetMain"
            alt="assessment"
            className="home-desktop-img"
          />
          <ol>
            <li>Total Questions: 10</li>
            <li>Types of Questions: MCQs</li>
            <li>Duration: 10 Mins</li>
            <li>Marking Scheme: Every Correct response, get 1 mark</li>
            <li>
              All the progress will be lost, if you reload during the assessment
            </li>
          </ol>
          <Link to="/assessment">
            <button type="submit">Start Assessment</button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
