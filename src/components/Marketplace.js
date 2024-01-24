import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);

  useEffect(() => {
    const init = async () => {
      if(window.ethereum === undefined)
        return;
      const accounts = await window.ethereum.request({method: 'eth_accounts'});       
      if (accounts.length)
        getAllListedNFTs();
      window.ethereum.on("accountsChanged", accounts => {
        if (accounts.length > 0) {
          console.log(`Account connected: ${accounts[0]}`);
          getAllListedNFTs();
        }
        else {
          console.log("Account disconnected");
          updateData([]);
          updateFetched(false);
        }
      });
    }
    init();
  }, []);

  async function getAllListedNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction;
    try {
      transaction = await contract.getAllListedNFTs();
    } catch (e) {
      console.log("ERRRROOOORR: ", e);
      return;
    }

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
      var tokenURI = await contract.tokenURI(i.tokenId);
      console.log("getting this tokenUri", tokenURI);
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
      };
      return item;
    }));

    updateFetched(true);
    updateData(items);
  }

  const printNFTs = () => {
    if (data.length === 0) {
      return <p className="mt-5 text-white">There are no NFTs for sell right now!</p>
    } else {
      return (
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      );
    }
  }

  return (
    <div style={{"minHeight":"100vh"}}>
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">
          Top NFTs
        </div>
        {!dataFetched && (<div className="flex mt-10">
          <p className="text-white">No data received, connect your wallet or reload the page.</p>
        </div>)}
        {dataFetched && printNFTs()}
      </div>
    </div>
  );

}