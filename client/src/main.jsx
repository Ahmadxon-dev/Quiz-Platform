import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "@/store.js";
import {Toaster} from "@/components/ui/toaster.jsx";

createRoot(document.getElementById('root')).render(
        <BrowserRouter>
            <Provider store={store}>
                <Toaster/>
                <App/>
            </Provider>
        </BrowserRouter>,
)
