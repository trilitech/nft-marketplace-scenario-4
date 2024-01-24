# Basic NFT Marketplace end to end

This code is from the Tutorial [Build your own NFT Marketplace from Scratch](https://docs.alchemy.com/alchemy/) built by [alchemy.com](https://alchemy.com)

The `.env` file should follow this:
```
REACT_APP_API_URL=https://node.ghostnet.etherlink.com

REACT_APP_API_URL_NIGHTLY=https://node.2024-01-09.etherlink-nightly.tzalpha.net

REACT_APP_PRIVATE_KEY=
REACT_APP_ETHERLINK_API_KEY=YOUCANCOPYME0000000000000000000000

REACT_APP_PINATA_KEY=
REACT_APP_PINATA_SECRET=
```

First deploy the Marketplace contract:
```
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network etherlink
```

Run the marketplace locally, run the below
```bash
npm start
```