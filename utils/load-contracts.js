const contract = require("@truffle/contract");
const AuthWalletArtifact = require("../public/contracts/AuthWallet.json");
const AuthVerifierArtifact = require("../public/contracts/AuthVerifier.json");

import { ethers } from "ethers";
import Web3 from "web3";

export const loadContracts = async (name, setContract, signer) => {
  console.log("inside load contract");
  console.log(signer);
  let _contract;
  let contract_address;
  if (name == "AuthWallet") {
    _contract = contract(AuthWalletArtifact);
    contract_address = "0x0d5D3079aBd776E9b809487aCA3EC30c11E48762";
    const instance = new ethers.Contract(
      contract_address,
      _contract.abi,
      signer
    );
    setContract(instance);

    return instance;
  } else if (name == "AuthVerifier") {
    _contract = contract(AuthVerifierArtifact);
    contract_address = "0x0Ab470Db314C441F4163b6Ab219372A756fCD613";
    const instance = new ethers.Contract(
      contract_address,
      _contract.abi,
      signer
    );
    setContract(instance);

    return instance;
  }

  // var web3 = new Web3(
  //   new Web3.providers.HttpProvider(
  //     "https://goerli.infura.io/v3/39f892354e0b4252b8e64cabb39944fc"
  //   )
  // );
};
