import React from 'react';
import {useSelector} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";

function HomePage(props) {
    const user = useSelector(state=> state.user)

    return (
        <div>
            <h1>Bosh sahifa</h1>
            <h1>Rol: {user.role}</h1>
        </div>
    );
}

export default HomePage;