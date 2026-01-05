import React, { useEffect, useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setCredentials } from "../store/authSlice";
import { validateUser, registerUser } from "../services/api";

const PostRegisterHandler = () => {
  const { token, user, loginInProgress } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔄 PostRegisterHandler triggered");
    console.log("loginInProgress:", loginInProgress);
    console.log("token:", token);
    console.log("user:", user);

    // 1️⃣ Wait for Keycloak login to finish
    if (loginInProgress) {
      console.log("⏳ Login still in progress…");
      return;
    }

    // 2️⃣ Token must exist
    if (!token) {
      console.log(" No token received — Keycloak token exchange failed.");
      return;
    }

    // 3️⃣ UserInfo must exist
    if (!user || !user.sub) {
      console.log(" No user info — Keycloak userinfo request failed.");
      return;
    }

    const syncUser = async () => {
      try {
        const keycloakId = user.sub;
        const email = user.email;

        console.log("🔥 Keycloak User:", user);

        if (!keycloakId || !email) {
          console.error("❌ Missing Keycloak ID or email.");
          return;
        }

        // 4️⃣ Validate user
        console.log(` Checking if user ${keycloakId} exists…`);
        const existsResponse = await validateUser(keycloakId);
        const exists = existsResponse.data;

        // 5️⃣ Register if needed
        if (!exists) {
          console.log("🟢 Registering new user…");
          await registerUser({
            keycloakId,
            email,
            firstName: user.given_name || "",
            lastName: user.family_name || "",
            phone: user.phone_number || "",
          });
          console.log("✅ Registration complete");
        } else {
          console.log("ℹ️ User already exists");
        }

        // 6️⃣ Save credentials
        dispatch(
          setCredentials({
            token,
            userId: keycloakId,
            email,
          })
        );

        localStorage.setItem("token", token);
        localStorage.setItem("userId", keycloakId);

        // 7️⃣ Redirect
        console.log("🚀 Redirecting to dashboard");
        navigate("/dashboard", { replace: true });

      } catch (err) {
        console.error("❌ PostRegisterHandler failed:", err);
      }
    };

    syncUser();
  }, [token, user, loginInProgress, dispatch, navigate]);

  return null;
};

export default PostRegisterHandler;
