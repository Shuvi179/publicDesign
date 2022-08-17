import React from "react";
import PropTypes from "prop-types";
import { AuthProvider } from "./authContext";

export const ContextProviders = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

ContextProviders.propTypes = {
  children: PropTypes.node
};
