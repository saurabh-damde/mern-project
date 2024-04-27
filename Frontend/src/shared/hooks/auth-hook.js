import { useCallback, useEffect, useState } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [userId, setUserId] = useState(null);

  const changeLoginState = useCallback(
    ({ id = null, token = null, expiry = null, command = null }) => {
      if (command === "Login" || command === "Signup") {
        const tokenExpiry =
          expiry ||
          new Date(new Date().getTime() + 1000 * 60 * 60).toISOString();
        setTokenExpiry(tokenExpiry);
        localStorage.setItem(
          "userData",
          JSON.stringify({ id, token, expiry: tokenExpiry })
        );
        setToken(token);
        setUserId(id);
      } else {
        localStorage.removeItem("userData");
        setToken(null);
        setTokenExpiry(null);
        setUserId(null);
      }
    },
    []
  );

  useEffect(() => {
    if (token && tokenExpiry) {
      const remainingTime =
        new Date(tokenExpiry).getTime() - new Date().getTime();
      logoutTimer = setTimeout(changeLoginState, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, changeLoginState, tokenExpiry]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.token && new Date(userData.expiry) > new Date()) {
      changeLoginState({
        id: userData.id,
        token: userData.token,
        expiry: userData.expiry,
        command: "Login",
      });
    }
  }, [changeLoginState]);

  return { userId, token, changeLoginState };
};
