# Klaytn Market Bapp

[![Generic badge](https://img.shields.io/badge/build-passing-green.svg)](https://shields.io/) [![Generic badge](https://img.shields.io/badge/licence-MIT-blue.svg)](https://shields.io/)

This is an Market-Blockchain-Application using Klaytn infrastructure. This app can be used from mobile using Kakao Klip Wallet directly, or from browsers using QR.

Support following features from app UI:

- Show KLAY wallet Balance.
- Show selling NFTs.
- Mint a new NFT(KIP17).
- Display user's NFTs on the market.
- Buy other's NFTs.

## Deplyoed Smart Contracts

---

Cypress Mainnet

- NFT: [0x660a15ea27fd0707ca804ccf7a384a0dce8a7c4f](https://scope.klaytn.com/account/0x660a15ea27fd0707ca804ccf7a384a0dce8a7c4f?tabId=txList)

- Market: [0x3c21785793eA7CeA01e680430da45eBd8c4DA08d](https://scope.klaytn.com/account/0x3c21785793eA7CeA01e680430da45eBd8c4DA08d?tabId=txList)

Baobab Testnet

- NFT: [0x3c21785793eA7CeA01e680430da45eBd8c4DA08d](https://baobab.scope.klaytn.com/account/0x3c21785793eA7CeA01e680430da45eBd8c4DA08d?tabId=txList)

- Market: [0xAE4F4D50e0d5383Cd25214c610366241d1324820](https://baobab.scope.klaytn.com/account/0xAE4F4D50e0d5383Cd25214c610366241d1324820?tabId=txList)

---

## How to run

```
yarn start
```

---

## References

- https://docs.klipwallet.com/rest-api/rest-api-a2a
- https://wallet.klaytn.com/
- https://ko.docs.klaytn.com/bapp/sdk/caver-js
- https://refs.klaytnapi.com/ko/th/latest#operation/getNftsByOwnerAddress
- https://github.com/klaytn/klaytn-contracts/tree/master/contracts/token

## Dependencies

- react, caver.js, bootstrap, react-bootstrap, axios, fontawesome
