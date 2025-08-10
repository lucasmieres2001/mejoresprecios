import { useState, useEffect } from 'react';
import React from 'react';
import ApiRequest from '../../services/ApiRequest';

export default function RegisterNewUser() 
{
    const [userData, setUserData] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = await ApiRequest('POST', '/api/user/register', true, JSON.stringify(Object.fromEntries(formData)));
        setUserData(data);
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" />
                </label>
                <br />
                <label>
                    Last Name:
                    <input type="text" name="lastname" />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
