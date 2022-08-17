import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { getCurrentUser, logOutUser } from "../apiServices/apiUser";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUserData = (data = null) => {
    setUserData(data)
  };

  const getUserdData = async () => {
    const res = await getCurrentUser();
    if (res.error) {
      userLogOut();
    } else if (res.id !== undefined) {
      setUserData(res);
    }
    setIsLoading(false);
  };

  const userLogOut = async () => {
    const res = await logOutUser();
    if (res) {
      updateUserData();
      return true;
    }
  };

  useEffect(() => {
    getUserdData();
  }, []);
  
  return (
    <AuthContext.Provider value={{
      userData,
      updateUserData,
      userLogOut,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};
