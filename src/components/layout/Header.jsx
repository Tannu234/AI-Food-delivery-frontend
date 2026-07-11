import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes } from "react-router-dom";
import { logout } from "../../redux/actions/userActions";

import { toast } from "react-toastify"; // 

import Search from "./Search";
import "../../App.css";


const Header = () => {
  const dispatch = useDispatch();

  // Updated slice
  const { user, loading } = useSelector((state) => state.user);
  const {cartItems} = useSelector((state => state.cart))


  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully"); 
  };

  return (
    <>
      <nav className="navbar row sticky-top align-items-center">
        {/* logo */}
        <div className="col-6 col-md-3 brand-wrap">
          <Link to="/" className="brand-link">
            <span className="brand-badge">Z</span>
            <span className="brand-name">Zaika Go</span>
          </Link>
        </div>

        {/* search */}
        <div className="col-12 col-md-6 order-3 order-md-2 mt-2 mt-md-0">
          <Routes>
            <Route path="/" element={<Search />} />
            <Route
              path="/eats/stores/search/:keyword"
              element={<Search />}
            />
          </Routes>
        </div>

        {/* right side */}
        <div className="col-6 col-md-3 order-2 order-md-3 text-right nav-actions">
          <Link to="/cart" className="cart-pill">
            <span id="cart">Cart</span>
            <span id="cart_count">{cartItems.length}</span>
          </Link>

          {user ? (
            <div className="ml-3 dropdown d-inline">
              <Link
                to="/"
                className="btn dropdown-toggle signin-pill"
                id="dropDownMenuButton"
                data-toggle="dropdown"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={user?.avatar?.url}
                    alt={user?.name}
                    className="rounded-circle"
                  />
                </figure>

                <span>{user?.name}</span>
              </Link>

              <div className="dropdown-menu">
                <Link
                  className="dropdown-item"
                  to="/eats/orders/me/myOrders"
                >
                  Orders
                </Link>

                <Link className="dropdown-item" to="/users/me">
                  Profile
                </Link>

                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={logoutHandler}
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link to="/users/login" className="signin-pill">
                Sign in
              </Link>
            )
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;