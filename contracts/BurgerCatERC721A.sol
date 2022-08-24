
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
// @author Pseudotom

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ERC721A.sol";

contract BurgerCatERC721 is Ownable, ERC721A, PaymentSplitter {

    using Strings for uint;
    enum Step {
        Before, 
        WhitelistSale,
        PublicSale, 
        SoldOut, 
        Reveal
    }

    Step public sellingStep;

    uint private constant MAX_SUPPLY = 5;
    uint private constant MAX_GIFT = 0;
    uint private constant MAX_WHITELIST = 2;
    uint private constant MAX_PUBLIC = 3;
    uint private constant MAX_SUPPLY_MINUS_GIFT = MAX_SUPPLY - MAX_GIFT;

    // Prix des NFTs au mint
    uint public whitelistSalePrice = 0.1 ether;
    uint public publicSalePrice = 0.15 ether;

    // Date d'ouvertude de la public sales
    uint public saleStartTime =1661464800;
    bytes32 public merkleRoot;

    // Stocker les metadatas des NFTs
    string public baseURI;

    // Double mapping amount wallet Private/Public 
    mapping(address => uint) public amountNFTperWalletWhitelistSale;
    mapping(address => uint) public amountNFTperWalletPublicSale;

    // Nombre maximun de NFTS par personne
    uint private constant maxPerAddressDuringWhitelistMint = 1;
    uint private constant maxPerAddressDuringPublicSale = 2;

    // Mettre le contract en pause
    bool public isPaused; 
    // Taille de l'équipe
    uint private teamLenght;

    // Address des wallets de l'équipe
    address[] private _team = [
    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,
    0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    ];

    // Gains partagés par les membres du contract
    uint[] private _teamShares = [
    500,
    500
    ];

    // constructor
    constructor(bytes32 _merkleRoot, string memory _baseURI)
    ERC721A("BurgerCat","BGC")
    PaymentSplitter(_team, _teamShares) {
        merkleRoot= _merkleRoot;
        baseURI= _baseURI;
        teamLenght = _team.length;
    }

    /**
    * @notice Le contract ne peut pas être appeler par un autre contract.
    */
     modifier callerIsUser() {
     require(tx.origin == msg.sender, "Celui qui appel la fonction est un autre contract");
     _;
     }

    /**
    * @notice function pour mint lors de la whitelist sale
    *
    * @param _account Address de l'acheteur
    * @param _quantity Nombre de NFTs à acheter
    * @param _proof Verification de l'address whitelist avec la preuve de Merkle
    *
     */
    function whitelistMint(address _account, uint _quantity, bytes32[] calldata _proof) external payable callerIsUser{
        require(!isPaused, "contract est en pause");
        require(currentTime() >= saleStartTime, "La vente n'as pas encore commence.");
        require(currentTime() <= saleStartTime + 12 hours, "La vente est terminee");
        uint price = whitelistSalePrice;
        require(price != 0, "Le prix du NFT est a 0");
        require(sellingStep == Step.WhitelistSale, "La whiteListSale n'est pas activee");
        require(isWhitelisted(msg.sender, _proof),"Vous n'etes pas whiteliste");
        require(amountNFTperWalletWhitelistSale[msg.sender] + _quantity <= maxPerAddressDuringWhitelistMint, "Vous avez depasse le nombre de NFTs a acheter durant la whitelist");
        require(totalSupply() + _quantity <= MAX_WHITELIST, "Le maximum du supply whitelist est ecoulee");
        require(msg.value >= price * _quantity, "Fonds insuffisant pour acheter");
        amountNFTperWalletWhitelistSale[msg.sender] += _quantity;
        _safeMint(_account, _quantity);
    }


    /**
    * @notice function public mint
    *
    * @param _account address de l'acheteur
    * @param _quantity de NFTs a acheter
     */
    function publicMint(address _account, uint _quantity) external payable callerIsUser{
        require(!isPaused, "contract est en pause");
        require(currentTime() >= saleStartTime + 24 hours, "La public sale n'as pas commence");
        require(currentTime() < saleStartTime + 48 hours, "La public sale est terminee");
        uint price = publicSalePrice;
        require(price != 0, "Le prix du NFT est a 0");
        require(sellingStep == Step.PublicSale, "La sale n'est pas activee");
        require(amountNFTperWalletPublicSale[msg.sender] + _quantity <= maxPerAddressDuringPublicSale, "Vous avez depasse le nombre de NFTs a acheter durant la whitelist");
        require(totalSupply() + _quantity <= MAX_SUPPLY_MINUS_GIFT, "Le maximum du supply est ecoulee");
        require(msg.value >= price * _quantity, "Fonds insuffisant pour acheter");
        amountNFTperWalletWhitelistSale[msg.sender] += _quantity;
        _safeMint(_account, _quantity);
    }

    /**
    * @notice L'owner peut offrir un NFT
    *
    * @param _to address du destinataire qui doit recevoir le gift
    * @param _quantity quantité de NFT offert a _to
     */

    function ownerToGift(address _to, uint _quantity) external onlyOwner {
    require(sellingStep > Step.PublicSale, "Le gift doit etre fait apres la public sale");
    require(totalSupply() + _quantity <= MAX_SUPPLY, "Supply max atteint");
    _safeMint(_to, _quantity);
    }

    /**
    * @notice Cette fonction retourne le chemin de l'URI du token par son ID.
    *
    * @param _tokenId L'identifiant du NFT pour obtenir ses metadatas.
    * @return la chaine de caractères concaténée de l'URI du token par son ID. 
    */
    function tokenURI(uint _tokenId) public view virtual override returns(string memory) {
        // Parcours les tokens pour vérifier son existence => ERC721A _exist(uint256 tokenId)
        require(_exists(_tokenId), "La requete n'existe pas pour ce token");
        // Retourne le chemin URI du token par concanétation
        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }
    /**
    * @notice Cette fonction va permettre de modifier le prix de la whitelist sale.
    *
    * @param _whiteSalePrice Le nouveau prix pour le mint sur whitelist.
     */
     function setWhitelistSalePrice(uint _whiteSalePrice) external onlyOwner {
     whitelistSalePrice = _whiteSalePrice;
     }

    /**
    * @notice Cette fonction va permettre de modifier le prix de la public sale.
    *
    * @param _publicSalePrice Le nouveau prix pour le mint de la public sale.
     */
     function setPublicSalePrice(uint _publicSalePrice) external onlyOwner {
     publicSalePrice = _publicSalePrice;
     }

    /**
    * @notice Cette fonction va permettre de modifier le timestamp de la whitelist.
    *
    * @param _saleStartTime Le nouveau timestamp de départ de la whitelist sale.
     */
     function setSaleStartTime(uint _saleStartTime) external onlyOwner {
     saleStartTime = _saleStartTime;
     }

    /**
    * @notice Cette fonction retourne le timestamp actuel. (date)
    *
    * @return Le timestamp actuel
    */
     function currentTime() internal view returns(uint) {
     return block.timestamp;
     }

    /**
    * @notice Cette fonction permet de modifier le step (l'état du contract)
    *
    * @param _step est le paramètre de l'état du contract que l'on souhaite.
    */
     function setStep(uint _step) external onlyOwner{
     sellingStep = Step(_step);
     }


    /**
    * @notice Cette fonction permet de mettre en pause le contract.
    *
    * @param _isPaused est un boleen qui enclenche la pause.
    */
     function setPaused(bool _isPaused) external onlyOwner{
     isPaused = _isPaused;
     }

    /**
    * @notice Cette fonction permet de modifier le baseURI des NFTs.
    *
    * @param _baseURI est le nouveau baseURI des NFTs.
    */
     function setBaseURI(string memory _baseURI) external onlyOwner{
     baseURI = _baseURI;
     }

    /**
    * @notice Change le merkleRoot.
    *
    * @param _merkleRoot est le nouveau merkleRoot.
    */
     function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner{
     merkleRoot = _merkleRoot;
     }

    /**
    * @notice Retourne une address hash.
    *
    * @param _account est l'address qui doit être hash.
    *
    * @return bytes32 qui représente l'address hash.
    */
     function leaf(address _account) internal pure returns(bytes32){
     return keccak256(abi.encodePacked(_account));
     }

    /**
    * @notice retourne true si la feuille est approuvée et qu'elle est defini dans la racine du MerkleRoot.
    *
    * @param _leaf est l'address hash.
    * @param _proof est la preuve.
    *
    * @return booleen true si la leaf(account hash) est approuvé et determiné dans le tree MerkleRoot.
    */

     function _verify(bytes32 _leaf, bytes32[] memory _proof) internal view returns(bool) {
     return MerkleProof.verify(_proof, merkleRoot, _leaf);
     }

    /**
    * @notice Verifie si l'account est determiné dans le MerkleRoot avec la fonction _verify.
    *
    * @param _account est l'address à hash.
    * @param _proof est la preuve.
    *
    * @return booleen true si la leaf(account hash) est approuvé et determiné dans le tree MerkleRoot.
    */

     function isWhitelisted(address _account, bytes32[] calldata _proof) internal view returns(bool) {
    return _verify(leaf(_account), _proof);
     }

    /**
    * @notice Permet de payer toute l'équipe en parcourant les address de la team.
     */
     function releaseAll() external {
        for(uint i = 0 ; i < teamLenght ; i++){
        release(payable(payee(i)));
        }
     }

    //Pas de reception d'ethers en dehors des mints de fonctions.
     receive() override external payable {
        revert("Seulement des mints du contract");
     }
}


