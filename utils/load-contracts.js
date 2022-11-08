const contract = require('@truffle/contract');
import AuthVerifier from '../public/contracts/AuthVerifier.json';
const contractArtifact = require('../public/contracts/AuthVerifier.json');
import web3 from 'web3';

export const loadContracts = async (name, provider) => {
  console.log('inside load contract', provider);
  // const res = await fetch(`../public/contracts/AuthVerifier.json`);
  // const Artifact = await res.json();
  const _contract = contract(contractArtifact);
  _contract.setProvider(provider);
  console.log('contract', _contract);
  // console.log("ddd")
  const contract_address = '0xb9F3312CE266C7a4B70ddFb2A5b476C59F32A93F';
  const instance = await web3.eth.contract(_contract.abi, contract_address);
  console.log(instance);
  // const instance = await _contract.at(contract_address);
  try {
    console.log(instance);
  } catch (err) {
    console.log(err);
  }

  // const deployedContract = await _contract.deployed();
  // console.log('hi', deployedContract);
  // return deployedContract;
};
