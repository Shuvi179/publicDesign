import { Route, Redirect } from "react-router-dom";
import useAuth from "./useAuth";

const AuthorRoute = ({ component: Component, ...rest }) => {
  const { userData } = useAuth();
  return <Route {...rest} render={(props) => ( Boolean(userData) && userData.isAuthor ? <Component {...props} /> : <Redirect to='/' /> )}/>
};

export default AuthorRoute;