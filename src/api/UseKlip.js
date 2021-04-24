import axios from "axios";
import MARKET_ABI from "../abi/market.json";
import NFT_ABI from "../abi/nft.json";
import {
  NFT_CONTRACT_ADDRESS,
  MARKET_CONTRACT_ADDRESS,
  CHAIN_ID,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
} from "../constants.cypress";
const A2A_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = "KLAY_MARKET";
const isMobile = window.screen.width >= 1280 ? false : true;
const getKlipAccessUrl = (method, request_key) => {
  if (method === "QR") {
    return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
  }
  if (method === "iOS") {
    return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
  }
  if (method === "android") {
    return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
  }
  return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
};
export const listingCard = async (fromAddress, tokenId, setQrvalue, cb) => {
  const urijson =
    '{ "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
  executeContract(
    NFT_CONTRACT_ADDRESS,
    urijson,
    "0",
    `[\"${fromAddress}\",\"${MARKET_CONTRACT_ADDRESS}\",\"${tokenId}\"]`,
    setQrvalue,
    cb
  );
};
export const buyCard = async (tokenId, setQrvalue, cb) => {
  const urijson =
    '{ "constant": false, "inputs": [ { "name": "tokenId", "type": "uint256" }, { "name": "NFT", "type": "address" } ], "name": "buyNFT", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }';
  executeContract(
    MARKET_CONTRACT_ADDRESS,
    urijson,
    "10000000000000000",
    `[\"${tokenId}\",\"${NFT_CONTRACT_ADDRESS}\"]`,
    setQrvalue,
    cb
  );
};

export const mintCardWithURI = async (
  toAddress,
  tokenId,
  uri,
  setQrvalue,
  cb
) => {
  const urijson =
    '{"constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
  executeContract(
    NFT_CONTRACT_ADDRESS,
    urijson,
    "0",
    `[\"${toAddress}\",\"${tokenId}\",\"${uri}\"]`,
    setQrvalue,
    cb
  );
};

export const executeContract = (
  txTo,
  functionJson,
  value,
  params,
  setQrvalue,
  cb
) => {
  axios
    .post(A2A_PREPARE_URL, {
      bapp: {
        name: APP_NAME,
      },
      type: "execute_contract",
      transaction: {
        to: txTo,
        abi: functionJson, //MintWithTokenURIJSON,
        value: value,
        params: params,
      },
    })
    .then((res) => {
      const { request_key } = res.data;
      setQrvalue(getKlipAccessUrl("QR", request_key));
      let id = setInterval(() => {
        axios
          .get(
            `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
          )
          .then((res) => {
            if (res.data.result) {
              clearInterval(id);
              cb(res.data.result);
            }
          });
      }, 1000);
    })
    .catch((e) => console.log(`execute contract error ${e}`));
};
export const getAddress = (setQrvalue, cb) => {
  axios
    .post(A2A_PREPARE_URL, {
      bapp: {
        name: APP_NAME,
      },
      type: "auth",
    })
    .then((res) => {
      const { request_key } = res.data;
      if (isMobile) {
        window.location.href = getKlipAccessUrl("android", request_key);
      } else {
        setQrvalue(getKlipAccessUrl("QR", request_key));
      }

      // window.location.href = getKlipAccessUrl("QR", request_key);

      let id = setInterval(() => {
        axios
          .get(
            `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
          )
          .then((res) => {
            if (res.data.result) {
              console.log(`[Get Address Result]${JSON.stringify(res.data)}`);
              clearInterval(id);
              cb(res.data.result.klaytn_address);
            }
          });
      }, 1000);
    });
};

// export const mintCardWithURI = async (
//   toAddress,
//   tokenId,
//   uri,
//   setQrvalue,
//   cb
// ) => {
//   const minturijson =
//     '{"constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
//   axios
//     .post(A2A_PREPARE_URL, {
//       bapp: {
//         name: APP_NAME,
//       },
//       type: "execute_contract",
//       transaction: {
//         to: NFT_CONTRACT_ADDRESS,
//         abi: minturijson, //MintWithTokenURIJSON,
//         value: "0",
//         params: `[\"${toAddress}\",\"${tokenId}\",\"${uri}\"]`,
//       },
//     })
//     .then((res) => {
//       const { request_key } = res.data;
//       setQrvalue(getKlipAccessUrl("QR", request_key));
//       let id = setInterval(() => {
//         axios
//           .get(
//             `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
//           )
//           .then((res) => {
//             if (res.data.result) {
//               clearInterval(id);
//               cb(res.data.result);
//             }
//           });
//       }, 1000);
//     })
//     .catch((e) => console.log(`mint error ${e}`));
// };
