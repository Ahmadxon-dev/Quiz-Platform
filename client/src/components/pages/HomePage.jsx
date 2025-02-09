import React from 'react';
import {useSelector} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";
import Hero from "@/components/layout/Hero.jsx";

function HomePage(props) {
    const user = useSelector(state=> state.user)

    return (
        <>
            {/*<h1>Rol: {user.role}</h1>*/}
            <Hero />
        </>
    );
}

export default HomePage;