import React, { Component} from 'react';
import Web3 from 'web3';
import './App.css';
import NFT from '../abis/NFT.json'
import axios from 'axios';
import {Image} from 'cloudinary-react';

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
      const abi = NFT.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({contract: contract})
      ///////////////////////////////////////////////////////////////////
      const total = await contract.methods.totalSupply().call()
      const mainDiv = document.getElementById('myId')
      for(var i =0;i<=total;i++){
        const nft = await contract.methods.nftImages(i).call()//link od slike
        const _div = document.createElement('div')
        const image = document.createElement('img')
        image.src = nft
        image.classList = "slika"
        _div.appendChild(image)
        _div.classList = "token"
        mainDiv.appendChild(_div)
        console.log(nft)
      }
    }else{
      window.alert('Smart contract not deployed to detected network');
    }
  }

  registerNFT = (urlSlike) => {
    this.state.contract.methods.registerNFT(urlSlike).send({from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({
        nfts: [...this.state.nfts, urlSlike]
      })
    })
  }

  constructor(props){
    super(props)
    this.state = {
      urlSlike: '',
      podaciSlike: '',
      selectedFile: null,
      account : '',
      contract: null,
      totalSupply: 0,
      nfts: []
    }
  }

  render() {
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
}


export default App;
