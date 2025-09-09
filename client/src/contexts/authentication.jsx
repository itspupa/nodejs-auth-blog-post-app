import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });
  const navigate = useNavigate();

  // 🐨 Todo: Exercise #4
    //  ให้เขียน Logic ของ Function `login` ตรงนี้
    //  Function `login` ทำหน้าที่สร้าง Request ไปที่ API POST /login
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้

  const login = async ({ username, password }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await axios.post("http://localhost:4000/auth/login", {
        username,
        password,
      });
      const token = result.data.token;
      localStorage.setItem("token", token);
      const userDataFromToken = jwtDecode(token);
      setState((prev) => ({ ...prev, loading: false, user: userDataFromToken }));
      navigate("/");
      return { ok: true };
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.message || "Login failed",
      }));
      return { ok: false, message: error?.response?.data?.message };
    }
  };

    // 🐨 Todo: Exercise #2
    //  ให้เขียน Logic ของ Function `register` ตรงนี้
    //  Function register ทำหน้าที่สร้าง Request ไปที่ API POST /register
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    
  const register = async ({ username, password, firstName, lastName }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await axios.post("http://localhost:4000/auth/register", {
        username,
        password,
        firstName,
        lastName,
      });
      setState((prev) => ({ ...prev, loading: false }));
      return { ok: true };
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.message || "Registration failed",
      }));
      return { ok: false, message: error?.response?.data?.message };
    }
  };

  const logout = () => {
    // 🐨 Todo: Exercise #7
    //  ให้เขียน Logic ของ Function `logout` ตรงนี้
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
