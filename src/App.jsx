import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Signup  from './pages/Signup';

// import { Provider } from "react-redux";
// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./components/redux_tool/authSlice";


// const store = configureStore({
//   reducer: {
//     auth: authReducer, // ⬅️ add here
//   },
// });

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        {/* <Provider store={store}> */}
          <Routes>
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route
              path="/auth/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        {/* </Provider> */}
      </div>
    </AuthProvider>
  );
}

export default App;
