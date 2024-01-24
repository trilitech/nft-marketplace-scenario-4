import fullLogo from '../full_logo.png';
import {
  Link
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const CHAINID = '0x' + Number(process.env.REACT_APP_NIGHTLY_CHAINID).toString(16);
// const CHAINID = '0x' + Number(128123).toString(16); // Etherlink
// const CHAINID = '0x' + Number(80001).toString(16); // Mumbai

function Navbar() {

const [connected, toggleConnect] = useState(false);
const location = useLocation();
const [currAddress, updateAddress] = useState('0x');

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if(chainId !== CHAINID) {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAINID }],
      })
    }
    if (connected === true)
      return;
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        // updateButton();
        console.log("here");
        getAddress();
        toggleConnect(true);
        // window.location.replace(location.pathname)
      });
  }

  useEffect(() => {
    const init = async () => {
      if(window.ethereum === undefined)
        return;
      const accounts = await window.ethereum.request({method: 'eth_accounts'});       
      if (accounts.length) {
        getAddress();
        toggleConnect(true);
        // updateButton();
      }
      window.ethereum.on("accountsChanged", accounts => {
        if (accounts.length > 0) {
          console.log(`Account connected: ${accounts[0]}`);
          updateAddress(accounts[0]);
          toggleConnect(true);
        }
        else {
          console.log("Account disconnected");
          updateAddress("0x");
          toggleConnect(false);
        }
      });
      window.ethereum.on('chainChanged', (chainId) => window.location.reload());
    }
    init();
    return () => {
      // clean listener
    };
  }, []);

  return (
    <div className="">
      <nav className="w-screen">
        <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
        <li className='flex items-end ml-5 pb-2'>
          <Link to="/">
          <img src={fullLogo} alt="" width={120} height={120} className="inline-block -mt-2"/>
          <div className='inline-block font-bold text-xl ml-2'>
            NFT Marketplace
          </div>
          </Link>
        </li>
        <li className='w-3/6'>
          <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
            {location.pathname === "/" ? 
            <li className='border-b-2 hover:pb-0 p-2'>
              <Link to="/">Marketplace</Link>
            </li>
            :
            <li className='hover:border-b-2 hover:pb-0 p-2'>
              <Link to="/">Marketplace</Link>
            </li>              
            }
            {location.pathname === "/seeAllNFT" ? 
            <li className='border-b-2 hover:pb-0 p-2'>
              <Link to="/seeAllNFT">See All NFT</Link>
            </li>
            :
            <li className='hover:border-b-2 hover:pb-0 p-2'>
              <Link to="/seeAllNFT">See All NFT</Link>
            </li>
            }
            {location.pathname === "/sellNFT" ? 
            <li className='border-b-2 hover:pb-0 p-2'>
              <Link to="/sellNFT">List My NFT</Link>
            </li>
            :
            <li className='hover:border-b-2 hover:pb-0 p-2'>
              <Link to="/sellNFT">List My NFT</Link>
            </li>              
            }              
            {location.pathname === "/profile" ? 
            <li className='border-b-2 hover:pb-0 p-2'>
              <Link to="/profile">Profile</Link>
            </li>
            :
            <li className='hover:border-b-2 hover:pb-0 p-2'>
              <Link to="/profile">Profile</Link>
            </li>              
            }  
            <li>
              {!connected && <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>Connect Wallet</button>}
              {connected && <button className="enableEthereumButton bg-green-500 hover:bg-green-70 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>Connected</button>}
            </li>
          </ul>
        </li>
        </ul>
      </nav>
      <div className='text-white text-bold text-right mr-10 text-sm'>
        {currAddress !== "0x" ? "Connected to":"Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? (currAddress.substring(0,6)+'...'+ currAddress.substring(currAddress.length-4)):""}
      </div>
    </div>
  );
}

export default Navbar;