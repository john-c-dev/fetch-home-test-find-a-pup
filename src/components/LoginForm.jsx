import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const navigate = useNavigate()

  // On submit click
  const handleSubmit = async (event) => {
    event.preventDefault()
  
    // Grab the user name and password
    const name = event.target.name.value
    const email = event.target.email.value
  
    // Create the login data
    const loginData = {
      name,
      email
    }
  
    // Send the login data to the server
    const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(loginData)
    })
  
    // Handle the response
    if (response.ok) {

      navigate('/search') // Redirect to search page
    } else {
      alert('Login failed. Please try again.') // Alert the user that the login failed
    }
  }

  return (
    <section className="login-section">
      <h1>Login</h1>
      <form id="loginForm" onSubmit={handleSubmit}>
        <div className="login-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
     
        <div className="login-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required/>
        </div>
        <br/>
        <button type="submit">Login</button>
      </form>
    </section>
  )
}