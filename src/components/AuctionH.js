import React, { Component} from 'react';
import Web3 from 'web3';
import './App.css';
import NFT from '../abis/NFT.json'
import AuctionHouse from '../abis/AuctionHouse.json'
import axios from 'axios';
import {Image} from 'cloudinary-react';

class AuctionH extends Component{

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

            const total = await contract.methods.totalSupply().call()
            const mainDiv = document.getElementById('myId')

            for(var i =1;i<=total;i++){
                const nft = await contract.methods.getUri(i).call()//link od slike
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


      render() {
        return (
          <div>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
              <a
                className="navbar-brand col-sm-3 col-md-2 mr-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="logo">NFT Tokens</p>
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
                  
                </main>
              </div>
              <hr/>
              <div className = "row text-center" style = {{backgroundImage: this.state.urlSlike}} id = "myId">
                <div id = 'myId'></div>
              </div>
            </div>
          </div>
        );
      }
}
    
export default App;