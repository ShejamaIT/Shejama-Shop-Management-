import React from "react";
import {Route,Routes,Navigate} from "react-router-dom";

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import Checkout from "../pages/Checkout";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import Profile from "../pages/Profile";
import ProductDisplay from "../components/Ui/ProductDisplay";


const Router = () => {
    return(
        <Routes>
        <Route path="/" element={<Navigate to='/home'/>}/>
            <Route path='home' element={<Home/>}/>
            <Route path='signup' element={<Signup/>}/>
            <Route path='signin' element={<Signin/>}/>
            <Route path='profile' element={<Profile/>}/>
            <Route path='shop' element={<Shop/>}/>
            <Route path='cart' element={<Cart/>}/>
            <Route path="/products/:category" element={<ProductDisplay />} />
            <Route path='productDetail' element={<ProductDetail/>}/>
            <Route path='checkout' element={<Checkout/>}></Route>
            <Route path="/shop/:id" element={<ProductDetail />} />
        </Routes>
    ) ;
};

export default Router;
