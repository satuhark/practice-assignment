import React, { useState, useEffect } from 'react'
import './index.css'
import loginService from './services/login'
import PropTypes from 'prop-types'

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        console.log(errorMessage)
    }, [errorMessage])
    
    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ 
                username, 
                password,
            })
            localStorage.setItem('token', user.token)
            localStorage.setItem('user', JSON.stringify(user))
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('User or password incorrect')  
            }
        }
    }

return (
    <div className="add-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
        <div className="input-field">
            <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={({ target }) => setUsername(target.value)}
            autoComplete="username"
          />
            <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="current-password"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="button" type="submit">Login</button>
      </div>
      </form>
      </div>
    )
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired,
}


export default Login