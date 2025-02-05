import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import closeXSvg from '../assets/close.svg'

export default function Match({ matchedDog, handleClose }) {
  // Get window size
  const { width, height } = useWindowSize()

  return (
    <div className="match-section">
      <Confetti
        width={width}
        height={height}
      />
      <div className="match-display" data-dog-id={matchedDog.id}>
        <button className="close-button" onClick={handleClose}>
          <img src={closeXSvg} alt="close" />
        </button>
        <h2>We found the perfect doggo for you!</h2>
        <p>{matchedDog.name} is a{['a', 'e', 'i', 'o', 'u'].includes(matchedDog.breed[0].toLowerCase()) ? 'n' : ''} {matchedDog.breed.toLowerCase()} and can be your new best friend.</p>
        <img className="match-image" src={matchedDog.img} alt={matchedDog.name} /> 
      </div>

    </div>
  )
}