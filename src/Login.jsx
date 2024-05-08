import { useState } from 'react'
import './index.css'
import loginService from './services/login'
import PropTypes from 'prop-types'
import Register from './Register'

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    
    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('Logging in with', username, password)
        setLoggedIn(true)
        try {
            const user = await loginService.login({ 
                username, 
                password,
            })
            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            loginService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('User or password incorrect')
            }
    }
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedUser')
        setLoggedIn(false)
    }

return (
    !loggedIn ? (
        <div className="add-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
        <div className="input-field">
            <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
            <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        <button className="button" type="submit">Login</button>
      </div>
      </form>
      <div><Register /></div>
      </div>
    ) : (
        <button onClick={handleLogout}>Log out</button>
    )
    )
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired,
}


export default Login