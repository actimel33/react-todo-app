import React from 'react';

import './App.css';
import Board from './components/Board';
import Header from './components/Header';
import Modal from './components/Modal';

function App() {
  return (
    <div className="App">
      <Header />
      <Board />
      <Modal />
    </div>
  );
}

export default App;
