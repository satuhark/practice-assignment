import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import './index.css'

const Register = () => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match')
            setPassword('')
            setConfirmPassword('')
            return
        }
        
        try {
            const response = await axios.post('https://practice-assignment-1.onrender.com/api/users', {
                username,
                name,
                password
            })
            console.log('User created successfully:', response.data)
            setErrorMessage('User created successfully, you can now log in using the login form.')

            setUsername('')
            setName('')
            setPassword('')
            setConfirmPassword('')
            setError('')
        } catch (error) {
            if (error.response.status === 400) {
                const errorMessage = error.response.data.error
                if (errorMessage.includes('expected `username` to be unique')) {
                    setErrorMessage('Username is already in use. Choose another username.')
                } else {
                    setError('An error occurred while registering.')
                }
            } else {
                setError('An unexpected error occurred.')
            }
            setUsername('')
        }
    }

    return (
        <div className="add-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
            <div className="input-field">
                <input
                    data-testid='newusername'
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} required 
                    autoComplete="username"
                    placeholder="New username" />
                <input
                    data-testid='newname'
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)} required
                    autoComplete="username"
                    placeholder="New name" />
                <input
                    data-testid='newpassword'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} required
                    autoComplete="new-password"
                    placeholder="New password" />
                <input
                    data-testid='confirmnewpassword'
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} required
                    autoComplete="new-password"
                    placeholder="Confirm new password" />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button className="button" type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}

export default Register
