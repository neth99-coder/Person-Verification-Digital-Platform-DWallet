const contract = require('@truffle/contract');
const AuthWalletArtifact = require('../public/contracts/AuthWallet.json');
const AuthVerifierArtifact = require('../public/contracts/AuthVerifier.json');

import Web3 from 'web3';

export const loadContracts = async (name, provider) => {
  console.log('inside load contract');
  const _contract = contract(AuthWalletArtifact);
  await _contract.setProvider(provider);
  console.log('contract', _contract);
  const contract_address = '0xb9F3312CE266C7a4B70ddFb2A5b476C59F32A93F';
  var web3 = new Web3(
    new Web3.providers.HttpProvider('http://192.168.1.2:7545/'),
  );
  const instance = new web3.eth.Contract(_contract.abi, contract_address);
  instance.setProvider(provider);
  console.log('instance', instance);

  return instance;
};
