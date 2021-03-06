import React, { Component} from 'react';
import Web3 from 'web3';
import './App.css';
import NFT from '../abis/NFT.json'
import AuctionHouse from '../abis/AuctionHouse.json'
import axios from 'axios';
import {Image} from 'cloudinary-react';
import {Link} from "react-router-dom"

class App extends Component {

  fileSelectedHandler = event => {
    console.log(event.target.files[0]);
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  fileUploadHandler = () => {
    const formData = new FormData();
    formData.append("file", this.state.selectedFile)
    formData.append("upload_preset", "nftauction")
    axios.post("https://api.cloudinary.com/v1_1/tothemoon/image/upload", formData, {
      onUploadProgress: progressEvent => {
        console.log("Upload progress " + Math.round(progressEvent.loaded/progressEvent.total * 100) + "%")
      }
    })
    .then(res => {
      console.log(res.data);
      this.setState({
        urlSlike: res.data.secure_url,
        podaciSlike: res.data
      })
    })
  }

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockChainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})

    const networkId = await web3.eth.net.getId()
    const networkData = NFT.networks[networkId]

    

    if(networkData){
      const abiNFT = NFT.abi
      const address = networkData.address
      const contractNFT = new web3.eth.Contract(abiNFT, address)

      const abiAuction = AuctionHouse.abi
      const contractAuction = new web3.eth.Contract(abiAuction, address)
      this.setState({contractNFT: contractNFT, contractAuction: contractAuction})
      const total = await contractNFT.methods.totalSupply().call()
      this.setState({totalSupply: total})


    }else{
      window.alert('Smart contract not deployed to detected network');
    }
  }

  registerNFT = (urlSlike) => {
    this.state.contractNFT.methods.registerNFT(urlSlike, this.state.ime, this.state.desc, this.state.cena).send({from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({
        nfts: [...this.state.nfts, urlSlike]
      })
    })
  }
  /*
  createAuction = () => {
    console.log(this.state.contractAuction)
    this.state.contractAuction.methods.createAuction(this.state.account, this.state.ime, 
    this.state.contractNFT.methods.nftImages(this.state.totalSupply),  this.state.cena).send({from: this.state.account})
    .once('receipt', (receipt) => {
      console.log('USPEO SAM DA NAPRAVIM AUKCIJU')
    })
  }
  */

  constructor(props){
    super(props)
    this.state = {
      ime: '',
      desc: '',
      cena: '',
      urlSlike: 'https://i.imgur.com/pANy2tq.png',
      podaciSlike: '',
      selectedFile: null,
      account : '',
      contractNFT: null,
      contractAuction: null,
      totalSupply: 0,
      nfts: []
    }
  }

  updateNameValue(evt) {
    console.log("Stavljamo vrednost imena: " + evt.target.value)
    this.setState({
      ime: evt.target.value,
    });
  }

  updateDescValue(evt) {
    this.setState({
      desc: evt.target.value
    });
  }

  updatePriceValue(evt) {
    this.setState({
      cena: evt.target.value
    });
  }

  render() {
    return (
      <div>
       <header id="header" class="d-flex align-items-center">
    <div class="container d-flex align-items-center justify-content-between">

      <h1 class="logo"><a href="index.html">TTM</a></h1>

      <nav id="navbar" class="navbar">
        <ul>
          <li><a class="nav-link scrollto" href="#hero">Home</a></li>
          <li><a class="nav-link scrollto" href="#about">About</a></li>
		  <li class="dropdown active"><a href="#marketplace"><span>Marketplace</span> <i class="bi bi-chevron-down"></i></a>
            <ul>
              <li><a href="#">Buy</a></li>
              <li><a href="#">Create</a></li>
            </ul>
          </li>
          <li className = "navbar-nav px-3">
            <li className = "nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className = "text-white"><span id = "account">{this.state.account}</span></small>
            </li>
          </li>
        </ul>
        <i class="bi bi-list mobile-nav-toggle"></i>
      </nav>

    </div>
  </header>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
            <div className="prvi">
                <Image  style={{width: "300px", height: "300px"}}cloudName="nftauction" publicId={this.state.urlSlike} className = "slika"/>
              <div className="forme">
                <p className="nftext">NFT Name:</p>
                <input type="text" name="name" onChange = {evt => this.updateNameValue(evt)}/>
                <p className="nftext" id="dva">NFT Description:</p>
                <div className="textarea">
                <input type="text" onChange ={evt => this.updateDescValue(evt)}></input>
                </div>
                <p className="nftext" id="dva">NFT Price (ETH):</p>
                <div className="numberarea">
                <input type="number" onChange = {evt => this.updatePriceValue(evt)}></input>
                </div>

                </div>
              <div className="dugmici">
              <form onSubmit = {(event) => {
                event.preventDefault()
                const urlSlike = this.state.urlSlike
                this.registerNFT(urlSlike)
              }}>
                
                <input id="fileUpload" type = "file" onChange={this.fileSelectedHandler} hidden/>
                <label htmlFor="fileUpload">Choose File</label>
                <button onClick = {this.fileUploadHandler}>Upload</button>
              
              </form>

                </div>
             </div>
              
            </main>
          </div>
          <div className = "row text-center" style = {{backgroundImage: this.state.urlSlike}} id = "myId">
            sadasdasd
          </div>
        </div>
      </div>
    );
  }
}
export default App;

/*render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            NFT Tokens
          </a>
          <ul className = "navbar-nav px-3">
            <li className = "nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className = "text-white"><span id = "account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <form onSubmit = {(event) => {
                event.preventDefault()
                const urlSlike = this.state.urlSlike
                this.registerNFT(urlSlike)
                console.log(this.state.podaciSlike.secure_url)
              }}>
                <input type = "file" onChange={this.fileSelectedHandler} />
                <button onClick = {this.fileUploadHandler}>UPLOAD</button>
              </form>
            </main>
          </div>
          <hr/>
          <div className = "row text-center" style = {{backgroundImage: this.state.urlSlike}} id = "myId">
          <Image style={{width: "500px", height: "500px"}}cloudName="nftauction" publicId= {this.state.urlSlike}/>

          </div>
        </div>
      </div>
    );
  }
 */