import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import CampaignPage from './components/CampaignPage';
import MyCampaign from './components/MyCampaign';
import Explore from './components/Explore';
import CreateCampaign from './components/CreateCampaign';
import Home from './components/Home';
import Following from './components/Following';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/campaignpage" element={<CampaignPage />} />
        <Route path="/mycampaign" element={<MyCampaign />} />
        <Route path="/createcampaign" element={<CreateCampaign />} />
        <Route path = "/register" element={<Register/>}/>
        <Route path = "/" element={<Home/>}/>
        <Route path = "/following" element={<Following/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
