import { useState } from 'react'
import './index.css'
import loginService from './services/login'
import PropTypes from 'prop-types'

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('')
    
    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('Logging in with', username, password)
        try {
            const user = await loginService.login({ 
                username, 
                password,
            })
            setUser(user)
            setUsername('')
            setPassword('')
            localStorage.setItem('token', user.token)
        } catch (error) {
            console.error('Error logging in:', error)
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
      </div>
    )
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired,
}


export default Login