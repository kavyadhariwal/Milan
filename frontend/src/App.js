import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Mycomponents/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Navbar from './Mycomponents/Navbar';
import Banner from './Mycomponents/Banner';
import About from './Mycomponents/About';
import Comments from './Mycomponents/Comments';
import Stats from './Mycomponents/Stats';
import Feedback from './Mycomponents/Feedback';
import Report from './Mycomponents/Report';
import ReportFound from './Mycomponents/ReportFound';
import FoundPage from './Mycomponents/FoundPage.js';
import Info from './Mycomponents/Info';
import Claim from './Mycomponents/Claim';
import Login from './Mycomponents/Login';
import AllReports from './Mycomponents/AllReports';
import Story from './Mycomponents/Story';
import Profile from './Mycomponents/Profile';
import Verify from './Mycomponents/Verify';
function App() {
  return (
    <AuthProvider>
      <Router>
        <>
          <Navbar />
          <Routes>

            <Route
              path="/"
              element={
                <>   
                  <Banner />
                  <About />
                  <Comments />
                  <Stats />
                  <Feedback />
                </>
              }
            />

            {/* Other routes */}
            <Route path="/report" element={<Report />} />
            <Route path="/foundPage" element={<FoundPage />} />
            <Route path="/info" element={<Info />} />
            <Route path="/claim/:id" element={<Claim />} />
            <Route path="/reportFound" element={<ReportFound />} />
            <Route path="/allReports" element={<AllReports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/story/:id" element={<Story />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verify />}/>

          </Routes>
        </>
      </Router>
    </AuthProvider>
  );
}

export default App;