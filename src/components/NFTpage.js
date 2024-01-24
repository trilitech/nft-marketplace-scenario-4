import Navbar from "./Navbar";
import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function NFTPage (props) {
  const [data, updateData] = useState({});
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");
  const params = useParams();
  const tokenId = params.tokenId;

  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    var tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    const isForSale = (await contract.idToListedToken(tokenId))[4];

    let item = {
      price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
      isForSale: isForSale
    }
    console.log(item);
    updateData(item);
    console.log("address", addr)
    updateCurrAddress(addr);
  }

  async function buyNFT(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
      const salePrice = ethers.utils.parseUnits(data.price, 'ether')
      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
      //run the executeSale function
      let transaction = await contract.executeSale(tokenId, {value:salePrice});
      await transaction.wait();

      alert('You successfully bought the NFT!');
      updateMessage("");
      window.location.replace("/");
    }
    catch(e) {
      alert("Upload Error"+e);
    }
  }

  useEffect(() => {
    if (tokenId === 'undefined' || isNaN(tokenId))
      return;
    getNFTData(tokenId);
  // if(typeof data.image == "string")
  //   data.image = GetIpfsUrlFromPinata(data.image);
  }, [tokenId]);

  const printAction = () => {
    if (currAddress !== data.owner && currAddress !== data.seller) {
      if (data.isForSale) {
        return <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
      } else {
        return <div className="text-emerald-700">This NFT is not listed for sale</div>
      }
    } else {
      return <div className="text-emerald-700">You are the owner of this NFT</div>
    }
  };

  return(
    <div style={{"height":"100vh"}}>
      <Navbar></Navbar>
      <div className="flex ml-20 mt-20">
        <img src={data.image} alt="" className="w-72 h-80" />
        <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
          <div>
            Name: {data.name}
          </div>
          <div>
            Description: {data.description}
          </div>
          <div>
            Price: <span className="">{data.price + " ETH"}</span>
          </div>
          <div>
            Owner: <span className="text-sm">{data.owner}</span>
          </div>
          <div>
            Seller: <span className="text-sm">{data.seller}</span>
          </div>
          <div>
            {printAction()}
            <div className="text-green text-center mt-3">{message}</div>
          </div>
        </div>
      </div>
    </div>
  )
}