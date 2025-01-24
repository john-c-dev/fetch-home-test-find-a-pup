import { useState, useEffect } from 'react'
import clsx from 'clsx'
import Dog from './Dog'
import Match from './Match'

export default function SearchPage() {
  const baseURL = 'https://frontend-take-home-service.fetch.com'
  const defaultSearchStr = `${baseURL}/dogs/search?sort=breed:asc`

  // States
  const [breedsList, setBreedsList] = useState([])
  const [idList, setIdList] = useState([])
  const [dogResults, setDogResults] = useState('Dog results will go here')
  const [sortBy, setSortBy] = useState('breed')
  const [sortOrder, setSortOrder] = useState('asc')
  const [fetchAmount, setFetchAmount] = useState(25)
  const [searchStr, setSearchStr] = useState(`${baseURL}/dogs/search?sort=breed:asc`)
  const [selectedBreed, setSelectedBreed] = useState([])
  const [searchIndex, setSearchIndex] = useState(0)
  const [resultTotal, setResultTotal] = useState(0)
  const [favorites, setFavorites] = useState([])
  const [matchedDog, setMatchedDog] = useState(null)

  // Find best match
  function selectFavorite() {
    const favoriteIds = favorites.map(fav => fav.id)
    fetchBestMatch(favoriteIds).then(setIdList)
  }

  // Close the match window
  function handleClose() {
    setMatchedDog(null)
  }

  // Get breeds
  useEffect(() => {
    fetchBreeds().then(setBreedsList)
  }, [])

  // Get Id's
  useEffect(() => {
    const searchParams = new URLSearchParams({
      sort: `${sortBy}:${sortOrder}`,
      size: fetchAmount,
      from: searchIndex,
    })

    // When breed selected add breed to search params
    if (selectedBreed.length > 0) {
      searchParams.append('breeds', selectedBreed)
    }

    const queryString = `${baseURL}/dogs/search?${searchParams.toString()}`
    setSearchStr(queryString)

  }, [sortOrder, fetchAmount, sortBy, selectedBreed, searchIndex])

  // When search string changes fetch Id's
  useEffect(() => {
    fetchIds(searchStr).then(setIdList)
  }, [searchStr])

  // Get dogs
  useEffect(() => {
    if (idList.length > 0) {
      fetchDogsByIds(idList).then(fetchedDogs => {
        const dogs = fetchedDogs

        // Add dogs to page
        setDogResults(dogs.map(dog => (
          <Dog 
            key={dog.id} 
            {...dog} 
            favorite={favorites.some(favDog => favDog.id === dog.id)} 
            onToggleFavorite={() => handleToggleFavorite(dog)} 
          />
        )))
      })
    }
  }, [idList])

  // Add/remove favorite
  const handleToggleFavorite = (dog) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(favDog => favDog.id === dog.id)
      if (isFavorite) {
        return prevFavorites.filter(favDog => favDog.id !== dog.id)
      } else {
        return [...prevFavorites, dog]
      }
    })

    setDogResults(prevResults => 
      prevResults.map(d => 
        d.props.id === dog.id ? { ...d, props: { ...d.props, favorite: !d.props.favorite } } : d
      )
    )
  }

  // Fetch functions
  async function fetchBreeds() {
    try {
      const response = await fetch(`${baseURL}/dogs/breeds`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        return await response.json()
      } else {
        console.error('Failed to fetch breeds')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Fetch Id's
  async function fetchIds(queryString) {
    try {
      const response = await fetch(queryString, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const responseIds = await response.json()
        setResultTotal(responseIds.total)
        return responseIds.resultIds
      } else {
        console.error('Failed to fetch IDs')
        window.location.href = '/' // Redirect to login
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Fetch dogs
  async function fetchDogsByIds(dogIds) {
    try {
      const response = await fetch(`${baseURL}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dogIds),
      })

      if (response.ok) {
        const dogs = await response.json()
        return dogs
      } else {
        console.error('Failed to fetch dogs')
        window.location.href = '/' // Redirect to login
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Fetch best match
  async function fetchBestMatch(dogIds) {
    try {
      const response = await fetch(`${baseURL}/dogs/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dogIds),
      })

      if (response.ok) {
        const match = await response.json()
        const bestDogMatch = favorites.find(dog => dog.id === match.match)
        if (bestDogMatch) {
          setMatchedDog(bestDogMatch)
          console.log(bestDogMatch)
          return bestDogMatch
        } else {
          console.error('No matching dog found')
        }
      } else {
        console.error('Failed to fetch dogs')
        window.location.href = '/' // Redirect to login
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Event handlers
  function handleSortOrderChange(order) {
    setSortOrder(order)
  }

  function handleSortByChange(sortBy) {
    setSortBy(sortBy)
  }

  function handleFetchAmountChange(amount) {
    setFetchAmount(amount)
  }

  function handlePageChange(direction) {
    setSearchIndex(prevIndex => Math.max(0, prevIndex + direction * fetchAmount))
  }

  // Handle change in breed
  function handleBreedChange(breed) {
    if (breed.length === 0 || breed[0] === '') {
      console.log('No breed selected')
      setSelectedBreed([])
      setSearchStr(defaultSearchStr)
    }
    setSelectedBreed(breed)
  }

  return (
    <section className="search-section">
      { matchedDog && <Match matchedDog={matchedDog} handleClose={handleClose} /> }
      <h1>Find a pup</h1>
      <div className='breed-dropdown'>
        <label htmlFor="breed-select">Breed:</label>
        <select id="breed-select" onChange={(e) => handleBreedChange([e.target.value])}>
          <option value="">-- Pick a breed --</option>
          {breedsList.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>
      <div className="search-controls">
        <p>Sort by:</p>
        <div className="button-group">
          <button onClick={() => handleSortByChange('breed')} className={clsx('sort-button', { 'selected-sort': sortBy === 'breed' })}>
            Breed
          </button>
          <button onClick={() => handleSortByChange('age')} className={clsx('sort-button', { 'selected-sort': sortBy === 'age' })}>
            Age
          </button>
          <button onClick={() => handleSortByChange('name')} className={clsx('sort-button', { 'selected-sort': sortBy === 'name' })}>
            Name
          </button>
        </div>
        <p>Dogs per page:</p>
        <div className="button-group">
          <button onClick={() => handleFetchAmountChange(10)} className={clsx('fetch-amount-button', { 'selected-amount': fetchAmount === 10 })}>
            10
          </button>
          <button onClick={() => handleFetchAmountChange(25)} className={clsx('fetch-amount-button', { 'selected-amount': fetchAmount === 25 })}>
            25
          </button>
          <button onClick={() => handleFetchAmountChange(50)} className={clsx('fetch-amount-button', { 'selected-amount': fetchAmount === 50 })}>
            50
          </button>
          <button onClick={() => handleFetchAmountChange(100)} className={clsx('fetch-amount-button', { 'selected-amount': fetchAmount === 100 })}>
            100
          </button>
        </div>
        <div className="button-group">
          <button onClick={() => handleSortOrderChange('asc')} className={clsx('ascending-order-button', { 'selected-order': sortOrder === 'asc' })}>
            Ascending
          </button>
          <button onClick={() => handleSortOrderChange('desc')} className={clsx('descending-order-button', { 'selected-order': sortOrder !== 'asc' })}>
            Descending
          </button>
        </div>
      {favorites.length > 0 &&  <button className='match-button' onClick={selectFavorite}>Select Match</button>}
      </div>
      <h2>Results</h2>
      {dogResults}
      <div className='page-controls'>
        {searchIndex > 0 && <button onClick={() => handlePageChange(-1)}>Previous</button>}
        <p>
          Page {Math.ceil(searchIndex / fetchAmount) + 1} of {Math.ceil(resultTotal / fetchAmount)}
        </p>
        {resultTotal > searchIndex + fetchAmount && <button onClick={() => handlePageChange(1)}>Next</button>}
      </div>
    </section>
  )
}
