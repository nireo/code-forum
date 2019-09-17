import React from 'react';
import './App.css';
import Main from './components/Main';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import CreateAccount from './components/Login/CreateAccount';

const App: React.FC = () => {
  return (
    <Router>
      <Route exact path="/" render={() => <Main />} />
      <Route exact path="/login" render={() => <LoginPage />} />
      <Route exact path="/signup" render={() => <CreateAccount />} />
    </Router>
  );
};

export default App;
