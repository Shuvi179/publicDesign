import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import './locations/i18n';

import useAuth from "./hooks/useAuth";
import PrivateRoute from "./hooks/privateRoute";
import AuthorRoute from "./hooks/authorRoute";

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Spinner from "./components/shared/spinner";

// Pages
import { Home, Books, Book, User, UserEdit, UserEditDonat, BooksFavourite, BooksHistory, CreateBook, EditBook } from "./pages";

const App = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="app-loading">
      <Spinner />
    </div>
  }

  return (
    <div className="app">
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/books" component={Books} />
        <AuthorRoute exact path="/book/create" component={CreateBook} />
        <AuthorRoute exact path="/book/edit/:slug" component={EditBook} />
        <Route exact path="/book/:slug" component={Book} />
        <PrivateRoute exact path="/user" component={User} />
        <PrivateRoute exact path="/user/edit" component={UserEdit} />
        <AuthorRoute exact path="/user/edit-donat" component={UserEditDonat} />
        <PrivateRoute exact path="/books/favourite" component={BooksFavourite} />
        <PrivateRoute exact path="/books/history" component={BooksHistory} />
      </Switch>
      <Footer />
    </Router>
  </div>
  );
}

export default App;
