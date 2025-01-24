import starEmptySvg from '../assets/star-empty.svg'
import starFilledSvg from '../assets/star-filled.svg'

export default function Dog(props) {
  // Toggle favorite
  const handleToggleFavorite = () => {
    props.onToggleFavorite(props.id)
  }

  return(
    <div className="dog-result" onClick={handleToggleFavorite}>
      <img className="star-icon" src={props.favorite ? starFilledSvg : starEmptySvg} alt='star' />
      <img src={props.img} alt={props.name} />
      <div className="dog-info" data-id={props.id}>
        <p>Name: <span>{props.name}</span></p>
        <p>Age: <span>{props.age}</span></p>
        <p>Breed: <span>{props.breed}</span></p>
        <p>Zip Code: <span>{props.zip_code}</span></p>
      </div>
    </div>
  )
}