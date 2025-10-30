import { Component } from 'react';
import { Route, Routes } from "react-router";

import LifeList from './containers/LifeList';

import './stylesheets/app.css';

class App extends Component {
  render() {
    return (
      <div className="main-app">
        <Routes>
          <Route path="/" element={<LifeList />} />
        </Routes>
      </div>
    );
  }
}

export default App;
