import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./containers/home";
import Catergory from "./containers/catergory";
import Player from "./containers/player";
import Layout from "./containers/layout";
import Search from "./containers/search";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import FavoritePage from "./containers/favoritePage/FavoritePage";
import {Grid} from "@material-ui/core";
import CategorySlider from "./components/TopChart/CategorySlider";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Roboto, Arial",
  },
  palette: {
    primary: {
      main: "#179992",
    },
  },
});


function App() {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          
          <Switch>
            <Route path="/category/:category/:subCategoryOne?/:subCategoryTwo?/:subCategoryThree?">
              <Catergory />
            </Route>
            <Route exact path="/item">
              <Player />
            </Route>
            <Route exact path="/search">
              <Search />
            </Route>
            <Route exact path="/favorites">
              <FavoritePage />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
