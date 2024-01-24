import { Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";
import MarketplaceJSON from "../Marketplace.json";
import { useEffect, useState } from "react";

function NFTTile (data) {
  const [isForSale, setIsForSale] = useState(false);
  const newTo = {
    pathname:"/nftPage/"+data.data.tokenId
  }
  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

  const calculateIsForSale = async () => {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, provider);
    try {
      const tokenData = await contract.idToListedToken(data.data.tokenId);
      setIsForSale(tokenData[4]);
    } catch (e) {
      console.log("Error: ", e);
      setIsForSale(false);
    }
  }

  useEffect(() => {
    calculateIsForSale();
  }, []);

  return (
    <Link to={newTo}>
      <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
        {isForSale ? 
          <p className="absolute rounded-lg bg-green-600 text-white">For Sale</p>
          :
          <p className="absolute rounded-lg bg-red-600 text-white">Not For Sale</p>
        }
        
        <img src={IPFSUrl} alt="" className="w-72 h-80 rounded-lg object-cover" />
        <div className= "text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
          <strong className="text-xl">{data.data.name}</strong>
          <p className="display-inline">
            {data.data.description}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default NFTTile;
