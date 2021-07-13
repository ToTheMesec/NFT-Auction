import React, { Component} from 'react';
import './App.css';

class Main extends Component{
    render(){
        return(

        <div>

        <header id="header" class="d-flex align-items-center">
            <div class="container d-flex align-items-center justify-content-between">

            <h1 class="logo"><a href="./public/index.html">TTM</a></h1>

            <nav id="navbar" class="navbar">
                <ul>
                <li><a class="nav-link scrollto active" href="#hero">Home</a></li>
                <li><a class="nav-link scrollto" href="#about">About</a></li>
                <li class="dropdown"><a href="#marketplace"><span>Marketplace</span> <i class="bi bi-chevron-down"></i></a>
                    <ul>
                    <li><a href="AuctionH.js">Buy</a></li>
                    <li><a href="App.js">Create</a></li>
                    </ul>
                </li>
                </ul>
                <i class="bi bi-list mobile-nav-toggle"></i>
            </nav>

            </div>
        </header>


        <section id="hero" class="d-flex align-items-center">
            <div class="container position-relative" data-aos="fade-up" data-aos-delay="500">
            <h1>Welcome to TTM</h1>
            <h2>We are team of talented students who created this platform for you so you could buy, sell and create NFTs</h2>
            <a href="#about" class="btn-get-started scrollto">Get Started</a>
            </div>
        </section>

        <main id="main">

            <section id="about" class="about">
            <div class="container">

           
            </div>
            <div class="container" data-aos="zoom-in">
            </div>
            </section>
            
        </main>

    

        </div>
        )
    }
}
export default Main;