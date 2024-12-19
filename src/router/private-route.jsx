import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({children, roles}) => {
 const {isUserLogin, user} = useSelector((state) => state.auth);
 console.log("private-route user: ", user.role);
 console.log("Array.isArray(roles):: ",Array.isArray(roles));
 console.log("roles:: ",roles);

 if(!isUserLogin) return <Navigate to="/auth/login" />;
 if(!roles || !Array.isArray(roles) || !roles.includes(user?.role)) return <Navigate to="/unauthorized" />;
 return <div>{children}</div>;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoute;




