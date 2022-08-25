const { ethers } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
var chai = require('chai');
const { expect } = require('chai');
const tokens = require('../tokens.json');

describe("Tests BurgerCat ERC721A", function(){
  before(async function(){
    [this.owner, this.addr1, this.addr2, this.addr3,...this.addrs] = await ethers.getSigners();
    console.log(this.addr1);
  })
})