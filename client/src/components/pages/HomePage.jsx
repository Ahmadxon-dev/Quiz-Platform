import React from 'react';
import {useSelector} from "react-redux";
import Hero from "@/components/layout/Hero.jsx";

function HomePage(props) {
    const user = useSelector(state=> state.user)

    return (
        <>
            <Hero />
        </>
    );
}

export default HomePage;