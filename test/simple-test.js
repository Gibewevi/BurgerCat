const { ethers } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
var chai = require('chai');
const { expect } = require('chai');
const tokens = require('../tokens.json');
const { hexStripZeros } = require('ethers/lib/utils');

describe("Tests BurgerCat ERC721A", function(){
  before(async function(){
    [this.owner, this.addr1, this.addr2, this.addr3,...this.addrs] = await ethers.getSigners();

    let tab = [];
    tokens.map((token) => {
    tab.push(token.address);
    });
    const leaves = tab.map((address) => keccak256(address));
    this.tree = new MerkleTree(leaves, keccak256, { sort: true});
    const root = this.tree.getHexRoot();
    this.merkleTreeRoot = root;
  })

  it('should deploy the smart contract', async function(){
    this.baseURI = "ipfs://CID/";
    this.contract = await hre.ethers.getContractFactory("BurgerCatERC721A");
    this.deployedContract = await this.contract.deploy(
      this.merkleTreeRoot, 
      this.baseURI
      )
  })

  it('sellingStep should equal 0 after deploying the smart contract', async function() {
    expect(await this.deployedContract.sellingStep()).to.equal(0);
  })

  it('merkleRoot should be defined and have a lenght of 66', async function(){
  expect(await this.deployedContract.merkleRoot()).to.have.lengthOf(66);
  })

  it('should NOT change the sellingStep if NOT THE OWNER', async function(){
  await expect(this.deployedContract.connect(this.addr1).setStep(1)).to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('should set the saleStartTime', async function(){
    let saleStartTime = 1661431947;
    await this.deployedContract.setSaleStartTime(saleStartTime);
    expect(await this.deployedContract.saleStartTime()).to.equal(saleStartTime);
  })

  it('should change the step to 1 (whitelist sale)', async function() {
  await this.deployedContract.setStep(1);
  expect(await this.deployedContract.sellingStep()).to.be.equal(1);
  })

  it('should be change isPaused by the other owner address', async function() {
    await expect(this.deployedContract.connect(this.addr1).setPaused(true)).to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('should mint one NFT on the whitelist sale if the user is whitelisted', async function() {
    const leaf = keccak256(this.addr1.address);
    const proof = this.tree.getHexProof(leaf);

    let price = await this.deployedContract.whitelistSalePrice();

    const overrides = {
      value: price
    }

     await this.deployedContract.connect(this.addr1).whitelistMint(this.addr1.address, 1, proof, overrides);
  })

  it('should mint one NFT on the whitelist sale if the user is NOT whitelisted', async function() {
    const leaf = keccak256(this.addr3.address);
    const proof = this.tree.getHexProof(leaf);

    let price = await this.deployedContract.whitelistSalePrice();

    const overrides = {
      value: price
    }

     await expect(this.deployedContract.connect(this.addr3).whitelistMint(this.addr3.address, 1, proof, overrides)).to.be.revertedWith("Vous n'etes pas whiteliste");
  })

  it('should get the total supply and the totalSupply shoulb be equal to 1', async function(){
    expect(await this.deployedContract.totalSupply()).to.equal(1);
  })
})