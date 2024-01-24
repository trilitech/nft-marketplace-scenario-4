import Navbar from "./Navbar";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import NFTTile from "./NFTTile";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Profile () {
  const [data, updateData] = useState([]);
  const [address, updateAddress] = useState("0x");
  const [totalPrice, updateTotalPrice] = useState("0");

  useEffect(() => {
    const init = async () => {
      if(window.ethereum === undefined)
        return;
      const accounts = await window.ethereum.request({method: 'eth_accounts'});       
      if (accounts.length)
        getNFTData();
      window.ethereum.on("accountsChanged", accounts => {
        if (accounts.length > 0) {
          console.log(`Account connected: ${accounts[0]}`);
          getNFTData();
        }
        else {
          console.log("Account disconnected");
          updateAddress("0x");
          updateData([]);
          updateTotalPrice("0");
        }
      });
    }
    init();
  }, []);

  async function getNFTData() {
    try {
      const ethers = require("ethers");
      let sumPrice = 0;
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
      //create an NFT Token
      let transaction = await contract.getMyNFTs()
      /*
      * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
      * and creates an object of information that is to be displayed
      */
      
      const items = await Promise.all(transaction.map(async i => {
        let tokenURI = await contract.tokenURI(i.tokenId);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        }
        sumPrice += Number(price);
        return item;
      }))

      updateData(items);
      updateAddress(addr);
      updateTotalPrice(sumPrice.toPrecision(3));
    } catch(e) {
      console.log("ERRRROOOORR: ", e);
      return;
    }
  }

  return (
    <div className="profileClass" style={{"minHeight":"100vh"}}>
      <Navbar></Navbar>
      <div className="profileClass">
        <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
          <div className="mb-5">
            <h2 className="font-bold">Wallet Address</h2>  
            {address}
          </div>
        </div>
        <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
          <div>
            <h2 className="font-bold">No. of NFTs</h2>
            {data.length}
          </div>
          <div className="ml-20">
            <h2 className="font-bold">Total Value</h2>
            {totalPrice} ETH
          </div>
        </div>
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="font-bold">Your NFTs</h2>
          <div className="flex justify-center flex-wrap max-w-screen-xl">
            {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
            })}
          </div>
          <div className="mt-10 text-xl">
              {data.length === 0 ? "Oops, No NFT data to display (Are you logged in?)":""}
          </div>
        </div>
      </div>
    </div>
  )
};