import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import SeeAllNFT from './components/SeeAllNFT.js';
import {
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Marketplace />}/>
        <Route path="/nftPage" element={<NFTPage />}/>        
        <Route path="/profile" element={<Profile />}/>
        <Route path="/sellNFT" element={<SellNFT />}/>             
        <Route path="/seeAllNFT" element={<SeeAllNFT />}/>             
      </Routes>
    </div>
  );
}

export default App;
