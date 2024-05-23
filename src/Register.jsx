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

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (password !== confirmPassword) {
            alert('Passwords do not match')
            setPassword('')
            setConfirmPassword('')
            return
        }
        
        try {
            const response = await axios.post('http://localhost:3001/api/users', {
                username,
                name,
                password
            })
            console.log('User created successfully:', response.data)
            setUsername('')
            setName('')
            setPassword('')
            setConfirmPassword('')
            setError('')
        } catch (error) {
            if (error.response.status === 400) {
                const errorMessage = error.response.data.error
                if (errorMessage.includes('expected `username` to be unique')) {
                    alert('Username is already in use. Choose another username.')
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
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} required 
                    autoComplete="username"
                    placeholder="New username" />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)} required
                    autoComplete="username"
                    placeholder="New name" />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} required
                    autoComplete="new-password"
                    placeholder="New password" />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} required
                    autoComplete="new-password"
                    placeholder="Confirm new password" />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button className="button" type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}

export default Register
