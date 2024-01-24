# Basic NFT Marketplace end to end

This code is from the Tutorial [Build your own NFT Marketplace from Scratch](https://docs.alchemy.com/alchemy/) built by [alchemy.com](https://alchemy.com)

## Setup

Create a `.env` file like this:
```
ETHERLINK_RPC_URL=https://node.ghostnet.etherlink.com

NIGHTLY_RPC_URL=https://node.2024-01-22.etherlink-nightly.tzalpha.net
REACT_APP_NIGHTLY_CHAINID=20240122
NIGHTLY_EXPLORER=https://explorer.2024-01-22.etherlink-nightly.tzalpha.net

PRIVATE_KEY=
NIGHTLY_PRIVATE_KEY=
ETHERLINK_API_KEY=

REACT_APP_PINATA_KEY=
REACT_APP_PINATA_SECRET=

MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/<api-key>
POLYGONSCAN_API_KEY=
```

Then install dependencies and deploy the Marketplace contract:
```
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network etherlink
```

## Run locally

To run it locally, you can use:
```
npm start
```

## Usage

If you want to use the marketplace, remember to add the correct network in your metamask.