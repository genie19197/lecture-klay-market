import Caver from "caver-js";
import MARKET_ABI from "../abi/market.json";
import NFT_ABI from "../abi/nft.json";

import { NFT_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS, CHAIN_ID, ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "../constants";

const option = {
  headers: [
    {
      name: "Authorization",
      value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
    },
    { name: "x-chain-id", value: CHAIN_ID },
  ],
};
const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));

const NFTcontract = new caver.contract(NFT_ABI, NFT_CONTRACT_ADDRESS);
const MarketContract = new caver.contract(MARKET_ABI, MARKET_CONTRACT_ADDRESS);

const addDeployer = (deployer) => {
  if (!caver.wallet.isExisted(deployer.address)) {
    caver.wallet.add(deployer);
  }
};
export const fetchCardsOf = async (address) => {
  // 아래 걸로 나중에 교체
  // curl -X GET "https://th-api.klaytnapi.com/v2/contract/nft/0x660a15ea27fd0707ca804ccf7a384a0dce8a7c4f/owner/0x5536F6FaB59Ff40cEce71D58BD94983BFc52E7A4" --header "x-chain-id: 8217" -u KASKX02VFJ23LZU6GFCH2WEK:jE7tt4GBW3F37PLxuhtkcwslEUeSBUDkCian29G0
  // {"items":[{"tokenId":"0x6e","owner":"0x5536f6fab59ff40cece71d58bd94983bfc52e7a4","previousOwner":"0x3c21785793ea7cea01e680430da45ebd8c4da08d","tokenUri":"https://i.pinimg.com/originals/c9/4e/c8/c94ec894c1bbe63c97ad5345e37e45e3.jpg","transactionHash":"0xc2e7508d48d837f80ba5e4bd2d8cb05f5f01b77d09ea65de4d82046d3f9a3fac","createdAt":1618934494,"updatedAt":1618935512},{"tokenId":"0xc","owner":"0x5536f6fab59ff40cece71d58bd94983bfc52e7a4","previousOwner":"0x0000000000000000000000000000000000000000","tokenUri":"wow","transactionHash":"0xb0a2b42da54bcd09a125f7a54161a5ff10e1bd6a489a5e51f349ef0ca4a50c97","createdAt":1618857434,"updatedAt":1618857434},{"tokenId":"0xb","owner":"0x5536f6fab59ff40cece71d58bd94983bfc52e7a4","previousOwner":"0x0000000000000000000000000000000000000000","tokenUri":"","transactionHash":"0xdfe852f12724095821e5883b879de1516cbb1cd6a70f31fcc1bf7b6c9628f1f6","createdAt":1618857377,"updatedAt":1618857377}],"cursor":""}
  const balance = await NFTcontract.methods.balanceOf(address).call(); // int
  console.log(`[NFT BALANCE]${balance}`);
  const cardIds = [];
  const cardUris = [];
  for (let i = 0; i < balance; i++) {
    const id = await NFTcontract.methods.tokenOfOwnerByIndex(address, i).call();
    cardIds.push(id);
  }
  console.log(`[CardID LIST]${cardIds}`);

  for (let i = 0; i < balance; i++) {
    const id = await NFTcontract.methods.tokenURI(cardIds[i]).call();
    cardUris.push(id);
  }
  console.log(`[CardURI LIST]${cardUris}`);
  const nfts = [];
  for (let i = 0; i < balance; i++) {
    nfts.push({ uri: cardUris[i], id: cardIds[i] });
  }
  return nfts;
};

export const mintCardWithURI = async (toAddress, tokenId, uri, privatekey) => {
  try {
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    // caver.wallet.add(deployer);
    addDeployer(deployer);
    const receipt = await NFTcontract.methods.mintWithTokenURI(toAddress, tokenId, uri).send({
      from: deployer.address,
      gas: "0x4bfd200",
    });
    console.log(receipt);
    return true;
  } catch (e) {
    console.log(`MINT ERROR: ${e}`);
  }
  return false;
};

export const listingCard = async (tokenId, privatekey) => {
  // Send Token to Market Address
  try {
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    addDeployer(deployer);
    const receipt = await NFTcontract.methods.safeTransferFrom(deployer.address, MARKET_CONTRACT_ADDRESS, tokenId).send({
      from: deployer.address,
      gas: "0x4bfd200",
    });
    console.log(receipt);
    return true;
  } catch (e) {
    console.log(`SAFE_TRANSFER_FROM ERROR: ${e}`);
  }
  return false;
};

export const buyCard = async (tokenId, privatekey) => {
  try {
    const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
    addDeployer(deployer);
    const receipt = await MarketContract.methods.buyNFT(tokenId, NFT_CONTRACT_ADDRESS).send({
      from: deployer.address,
      value: 10 ** 16,
      gas: "0x4bfd200",
    });
    console.log(receipt);
    return true;
  } catch (e) {
    console.log(`BUY_CARD ERROR: ${e}`);
  }
  return false;
};
export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((res) => {
    const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(res));
    return balance;
  });
};
