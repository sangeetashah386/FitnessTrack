import { useContext, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { registerUser } from "../services/api";

const PostRegisterHandler = () => {
  const { token, tokenData } = useContext(AuthContext);

  useEffect(() => {
    const syncUser = async () => {
      if (!token || !tokenData) return;
      try {
        await registerUser({
          firstName: tokenData?.given_name,
          lastName: tokenData?.family_name,
          email: tokenData?.email,
          keycloakId: tokenData?.sub,
          phone: tokenData?.phone_number ?? null,
        });
      } catch (err) {
        // 409 means user already exists — safe to ignore
        if (err?.response?.status !== 409) console.error("register user failed:", err);
      }
    };
    syncUser();
  }, [token, tokenData]);

  return null;
};

export default PostRegisterHandler;
