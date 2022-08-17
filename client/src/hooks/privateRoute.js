import { Route, Redirect } from "react-router-dom";
import useAuth from "./useAuth";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { userData } = useAuth();
  return <Route {...rest} render={(props) => ( Boolean(userData) ? <Component {...props} /> : <Redirect to='/' /> )}/>
};

export default PrivateRoute;