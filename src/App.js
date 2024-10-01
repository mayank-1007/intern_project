import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import UserSearch from './components/UserSearch';
import TeamManagement from './components/TeamManagement';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import TaskList from './components/TaskList';
import PersonalTask from './components/PersonalTask';
import UserTable from './components/ScoreCard';

function App() {
  return (
    <Provider store={store}>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/hello" element={
            <Provider store={store}>
                <div className="App">
                    <Sidebar />
                    <div className="main-content">
                        <UserSearch />
                        <TeamManagement />
                    </div>
                </div>
            </Provider>
          }/>          
          <Route path="/admin" element={
            <div className="App">
              <h1>Task Management</h1>
              <TaskList />
            </div>
          } />
          <Route path="/addtask" element={
            <Provider store={store}>
                <div className="App">
                    <PersonalTask />
                </div>
            </Provider>
          }/>
          <Route path="/score" element={<UserTable/>} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </div>
    </Router>
    </Provider>
  );
}

export default App;
