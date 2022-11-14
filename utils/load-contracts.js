const contract = require('@truffle/contract');
const AuthWalletArtifact = require('../public/contracts/AuthWallet.json');
const AuthVerifierArtifact = require('../public/contracts/AuthVerifier.json');

import Web3 from 'web3';

export const loadContracts = async (name, setWeb3Api) => {
  console.log('inside load contract');
  const _contract = contract(AuthWalletArtifact);
  const contract_address = '0x0d5D3079aBd776E9b809487aCA3EC30c11E48762';
  var web3 = new Web3(
    new Web3.providers.HttpProvider(
      'https://goerli.infura.io/v3/39f892354e0b4252b8e64cabb39944fc',
    ),
  );

  const instance = new web3.eth.Contract(_contract.abi, contract_address);
  setWeb3Api({web3: web3, contract: instance});

  return instance;
};
