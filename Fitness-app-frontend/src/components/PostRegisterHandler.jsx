import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setCredentials, setInitialized } from "../store/authSlice";
import { validateUser, registerUser } from "../services/api";
import {jwtDecode} from "jwt-decode";




const PostRegisterHandler = () => {
  //const { token, user, loginInProgress } = useContext(AuthContext);
  const { token: oauthToken, loginInProgress } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
      if (loginInProgress || !oauthToken || hasRun) return;

      //if (loginInProgress || !token) return;

      const decoded = jwtDecode(oauthToken);

      const keycloakId = decoded.sub;
      const email = decoded.email;
      const firstName = decoded.given_name || "";
      const lastName = decoded.family_name || "";
      const phone = decoded.phone_number || "";

      const syncUser = async () => {
        try {
          const existsResponse = await validateUser(keycloakId);
          const exists = existsResponse.data;

          if (!exists) {
            await registerUser({
              keycloakId,
              email,
              firstName,
              lastName,
              phone,
            });
          }

          dispatch(
            setCredentials({
              //token,
              token: oauthToken,
              //userId: keycloakId,
              //email,
              user: decoded,

            })
          );

          localStorage.setItem("token", oauthToken);

          dispatch(setInitialized());
          setHasRun(true);
         // localStorage.setItem("userId", keycloakId);
          //localStorage.setItem("email", email);

          navigate("/dashboard", { replace: true });
        } catch (err) {
          console.error("PostRegisterHandler failed:", err);
        }
      };

      syncUser();
    }, [oauthToken, loginInProgress, dispatch, navigate, hasRun]);

    return null;
  };

  export default PostRegisterHandler;

