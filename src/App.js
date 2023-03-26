import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import UserRecords from "./components/UserRecords";
import Operations from "./components/Operations";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";

const App = () => {

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  let location = useLocation();

  useEffect(() => {
    if (["/login"].includes(location.pathname)) {
      dispatch(clearMessage()); // clear message when changing location
    }
  }, [dispatch, location]);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  useEffect(() => {

    async function check() {
      if (!currentUser) {
        navigate("/login");
      }
    }

    check();
   
  }, []);

  return (
    <div id="page">
      {currentUser 
      ? (
        <header>
          <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <span className="navbar-brand m-2">Demo Calculator (Marcus Andrade)</span>
              <div className="container-fluid">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link to={"/userRecords"} className="nav-link">
                      User Records
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={"/operations"} className="nav-link">
                      New Operation
                    </Link>
                  </li>
                </ul>
                <div>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Welcome, {currentUser.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/login" onClick={logOut}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                </div>
            </div>
        </nav>
        
      </header>
        ): (
          <div></div>
        )}

      <main>
        <div className="container">
          <Routes>
            <Route path="/" element={<UserRecords />} />
            <Route path="/userRecords" element={<UserRecords />} />
            <Route path="/login" element={<Login />} />
            <Route path="/operations" element={<Operations />} />
          </Routes>
        </div>
      </main>

    </div>
  );
};

export default App;
