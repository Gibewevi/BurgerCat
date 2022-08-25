const hre = require("hardhat");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const tokens = require('../tokens.json');


async function main() {

  let tab = [];
  tokens.map((token) => {
  tab.push(token.address);
  });

  console.log("test");
  const leaves = tab.map((address) => keccak256(address));
  const tree = new MerkleTree(leaves, keccak256, { sort: true});
  const root = tree.getHexRoot();
  const baseURI= "ipfs://QmV1T9XWiyb6Azk2Y7bE1PmtabHeESmWdKP5GJk7vFYbB6/";

  console.log("test");
const Contract = await hre.ethers.getContractFactory("BurgerCatERC721A");
const contract = await Contract.deploy(root, baseURI);

await contract.deployed();

console.log("Contract deployed to:", contract.address + " - root"+root+" baseURI " + baseURI);
}
