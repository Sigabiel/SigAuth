import Layout from "@/components/navigation/SidebarLayout";
import App from "@/routes/App";
import Login from "@/routes/Login";
import React, { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

const RootComponent: React.FC = () => {
    return <BrowserRouter>
        <StrictMode>
            <Layout>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<Login />} />
                </Routes>    
            </Layout>
        </StrictMode>
    </BrowserRouter>
}

export default RootComponent;