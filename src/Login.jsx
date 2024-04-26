import { useState } from 'react'
import './index.css'
import loginService from './services/login'
import PropTypes from 'prop-types'

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('')
    
    const handleLogin = (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)
        try {
            const user = loginService.login({
                username, 
                password,
            })
            setUser(user)
          } catch (error) {
            console.error('Error logging in', error)
          }
        }

return (
        <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    )
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired,
}


export default Login