import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setCredentials, setInitialized } from "../store/authSlice";

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token){
        dispatch(setInitialized());
            return;
        }

    try {
      const decoded = jwtDecode(token);

      dispatch(
        setCredentials({
          token,
          user: decoded,
        })
      );
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
    }
    dispatch(setInitialized());
  }, [dispatch]); // run only once

  return null;
};

export default AuthInitializer;
