import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Login, Offers, Register, ResetPassword, Profile, MyOffer } from './pages/index';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PrivateRouteTeacher from './components/PrivateRoute/PrivateRouteTeacher';
import UpdateOffer from './pages/offers/UpdateOffer.tsx/UpdateOffer';
import OfferDetails from './pages/offers/OfferDetails/OfferDetails';

function App() {
    return (
        <React.StrictMode>
            <BrowserRouter>
                <ToastContainer position="bottom-right" />
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/offer-details/:offerId" element={<OfferDetails />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route element={<PrivateRouteTeacher />}>
                        <Route path="/my-offer" element={<MyOffer />} />
                        <Route path="/update-offer/:offerId" element={<UpdateOffer />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <Footer />
        </React.StrictMode>
    );
}

export default App;
