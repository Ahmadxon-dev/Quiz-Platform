import {Button} from "@/components/ui/button.jsx";
import Navbar from "@/components/layout/Navbar.jsx";
import {useDispatch} from "react-redux";
import {increment, setUser} from "@/features/user/userSlice.js";
import LoginForm from "@/components/layout/LoginForm.jsx";
import SignupForm from "@/components/layout/SignupForm.jsx";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import React, {lazy, Suspense, useEffect, useState} from "react";
import TestPage from "@/components/pages/TestPage.jsx";
import Loader from "@/components/ui/Loader.jsx";
import {useQuery} from "@tanstack/react-query";

const AddTopicsPage = lazy(()=> import("./components/pages/AddTopicsPage.jsx"))
const NotFoundPage = lazy(()=> import("./components/pages/NotFoundPage.jsx"))
const AllResultsPage = lazy(()=> import("./components/pages/AllResultsPage.jsx"))
const SettingsPage = lazy(()=> import("./components/pages/SettingsPage.jsx"))
const TestToPdf = lazy(()=> import("./components/pages/TestToPdf.jsx"))
const UsersPage = lazy(()=> import("./components/pages/UsersPage.jsx"))
const EachResultPage = lazy(()=> import("./components/pages/EachResultPage.jsx"))
const ResultsPage = lazy(()=> import("./components/pages/ResultsPage.jsx"))
const DefiningTestPage = lazy(()=> import("./components/pages/DefiningTestPage.jsx"))
const HomePage = lazy(()=> import("./components/pages/HomePage.jsx"))


const fetchUser = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/auth/getuser/${token}`);
    if (!response.ok) {
        throw new Error("Failed to fetch user data");
    }
    return response.json();
};

const useAuthUser = (token) => {
    return useQuery({
        queryKey: ["authUser", token],
        queryFn: () => fetchUser(token),
        enabled: !!token, // Ensures the query only runs if `token` exists
        retry: false, // Avoids retrying if request fails
    });
};

function App() {
    const dispatch = useDispatch();
    const location = useLocation()
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    const { data, isError } = useAuthUser(token);

    useEffect(() => {
        if (!token || isError) {
            navigate("/signin");
        }
    }, [token, isError, navigate]);

    useEffect(() => {
        if (data) {
            dispatch(setUser(data));
        }
    }, [data, dispatch]);

  return (
    <>

        {location.pathname!== "/signup" && location.pathname!== "/signin" && <Navbar />}

        <Suspense fallback={<Loader variant={"big"} />}>
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
                <Route path={"/addtopic"} element={<AddTopicsPage/>} />
                <Route path={"/profile/settings"} element={<SettingsPage />} />
                <Route path={"/allresults"} element={<AllResultsPage />}/>
                <Route path={"*"} element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    </>
  )
}

export default App
