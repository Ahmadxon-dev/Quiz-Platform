import {Button} from "@/components/ui/button.jsx";
import Navbar from "@/components/layout/Navbar.jsx";
import {useDispatch, useSelector} from "react-redux";
import {increment, setUser} from "@/features/user/userSlice.js";
import LoginForm from "@/components/layout/LoginForm.jsx";
import SignupForm from "@/components/layout/SignupForm.jsx";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import HomePage from "@/components/pages/HomePage.jsx";
import React, {useEffect} from "react";
import DefiningTestPage from "@/components/pages/DefiningTestPage.jsx";
import TestPage from "@/components/pages/TestPage.jsx";
import ResultsPage from "@/components/pages/ResultsPage.jsx";
import EachResultPage from "@/components/pages/EachResultPage.jsx";
import UsersPage from "@/components/pages/UsersPage.jsx";
import TestToPdf from "@/components/pages/TestToPdf.jsx";
import AddTopicsPage from "@/components/pages/AddTopicsPage.jsx";


function App() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const location = useLocation()
    const token = localStorage.getItem("token")
    const navigate = useNavigate()


    useEffect(()=>{
        if (token){
            fetch(`${import.meta.env.VITE_SERVER}/auth/getuser`, {
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    token
                })
            })
                .then(res=>res.json())
                .then(data=>{
                    dispatch(setUser(data))
                })
        }else{
            return navigate("/signin")
        }
    }, [])
  return (
    <>

        {/*<SignupForm/>*/}
        {location.pathname!== "/signup" && location.pathname!== "/signin" && <Navbar />}
        <Routes>
            <Route path={"/"} element={<HomePage/>} />
            <Route path={"/definetest"} element={<DefiningTestPage/>}/>
            <Route path={"/test/:testId"} element={<TestPage/>} />
            <Route path={"/signup"} element={<SignupForm/>} />
            <Route path={"/signin"} element={<LoginForm/>} />
            <Route path={"/results"} element={<ResultsPage />} />
            <Route path={"/results/:testId"} element={<EachResultPage />} />
            <Route path={"/users"} element={<UsersPage />} />
            <Route path={`/testtopdf`} element={<TestToPdf />} />
            <Route path={"/addtopic"} element={<AddTopicsPage />} />
        </Routes>
    </>
  )
}

export default App
