import React, { Component} from 'react';
import Web3 from 'web3';
import './App.css';
import NFT from '../abis/NFT.json';
import AuctionHouse from '../abis/AuctionHouse.json';

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
          const total = await contractNFT.methods.totalSupply().call()

          this.setState({totalSupply: total})

          const mainDiv = document.getElementById('myId')


          for(var i =1;i<=total;i++){
            const nftSlika = await contractNFT.methods.getUri(i).call()//link od slike
            const nftIme = await contractNFT.methods.getName(i).call()//ime slike
            const nftDesc = await contractNFT.methods.getDesc(i).call()//desc slike
            const _div = document.createElement('span')
            _div.classList = "card"

            const image = document.createElement('img')
            image.className = "card-img-top"
            image.src = nftSlika

            const cardBody = document.createElement('div')
            cardBody.classList = "card-body"

            const title = document.createElement('h5')
            title.classList = "card-title"
            title.innerHTML = nftIme

            const description = document.createElement('p')
            description.classList = "card-text"
            description.innerHTML = nftDesc

            const button = document.createElement('a')
            button.classList = 'btn btn-primary'
            button.innerHTML = "Go to the auction"

            cardBody.appendChild(title)
            cardBody.appendChild(description)
            cardBody.appendChild(button)

            _div.appendChild(image)
            _div.appendChild(cardBody)

            mainDiv.appendChild(_div)

          }
    
    
        }else{
          window.alert('Smart contract not deployed to detected network');
        }
      }

      constructor(props){
        super(props)
        this.state = {
          urlSlike: 'https://i.imgur.com/pANy2tq.png',
          account : '',
          contractNFT: null,
          contractAuction: null,
          totalSupply: 0,
        }
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
                  
                </main>
              </div>
              <div className = "row text-center" style = {{backgroundImage: this.state.urlSlike, backgroundRepeat: 'no-repeat'}}>
                <div id = "myId" className = "col-mb-3 mb-3"></div>
              </div>
            </div>
          </div>
        );
      }
}
    
export default AuctionH;