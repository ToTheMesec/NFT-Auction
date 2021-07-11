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
                    <li><a href="#">Buy</a></li>
                    <li><a href="#">Create</a></li>
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

            <div class="row">
                <div style = {{alignItems: 'center'}} data-aos="fade-left">
                    
                    
                <div class=" content" data-aos="fade-right" >
                    <h3>ToTheMoon team has created a simple auction house for you to use.</h3>
                    <p class="fst-italic">
                    We aspire to provide a simple to use platform where you can buy, sell and create your art collectibles. Services that we provide are:
                    </p>
                    <ul>
                    <li><i class="bi bi-check-circle"></i> Create your NFT on the create tab.</li>
                    <li><i class="bi bi-check-circle"></i> Set the starting price of your NFT and you are good to go.</li>
                    <li><i class="bi bi-check-circle"></i> You can also scroll through the variety of art collectibles on our website and maybe even do some bidding on them.</li>
                    </ul>
                    <p>
                    Once you proceed to the marketplace you will have your wallet automatically connect to our website. 
                    There is no need for you to create an account or register. So what are you waiting for? Head to our marketplace and experience a whole new way of trading NFTs.

                    </p>
                   
                </div>
                 <div><img src="https://i.imgur.com/vRSA9xD.jpg" class="img-fluid" alt="" /></div>
                </div>
            </div>
            </div>
            </section>

            <section id="why-us" class="why-us">
            <div class="container">

                <div class="row">

                <div class="col-lg-4" data-aos="fade-up">
                    <div class="box">
                    <span>01</span>
                    <h4>Fast</h4>
                    <p>Ulamco laboris nisi ut aliquip ex ea commodo consequat. Et consectetur ducimus vero placeat</p>
                    </div>
                </div>

                <div class="col-lg-4 mt-4 mt-lg-0" data-aos="fade-up" data-aos-delay="150">
                    <div class="box">
                    <span>02</span>
                    <h4>Safe</h4>
                    <p>Dolorem est fugiat occaecati voluptate velit esse. Dicta veritatis dolor quod et vel dire leno para dest</p>
                    </div>
                </div>

                <div class="col-lg-4 mt-4 mt-lg-0" data-aos="fade-up" data-aos-delay="300">
                    <div class="box">
                    <span>03</span>
                    <h4>Decentralized</h4>
                    <p>Molestiae officiis omnis illo asperiores. Aut doloribus vitae sunt debitis quo vel nam quis</p>
                    </div>
                </div>

                </div>

            </div>
            </section>

            <section id="marketplace" class="services">
            <div class="container">

                <div class="section-title">
                <span>Marketplace</span>
                <h2>Marketplace</h2>
                </div>

                <div class="row">
                <div class="col-lg-6 col-md-6 d-flex align-items-stretch" data-aos="fade-up">
                    <div class="icon-box">
                    <div class="icon"><i class="bx bxl-dribbble"></i></div>
                    <h4><a href="">Buy</a></h4>
                    <p>Intereseted in buying an NFT? You can buy your first NFT right here.</p>
                    </div>
                </div>

                <div class="col-lg-6 col-md-6 d-flex align-items-stretch mt-4 mt-lg-0" data-aos="fade-up" data-aos-delay="300">
                    <div class="icon-box">
                    <div class="icon"><i class="bx bx-tachometer"></i></div>
                    <h4><a href="">Create</a></h4>
                    <p>Got an interesting NFT you want to sell. Head on over to the Create section.</p>
                    </div>
                </div>

                </div>

            </div>
            </section>

            <section id="cta" class="cta">
            <div class="container" data-aos="zoom-in">
            </div>
            </section>
            
        </main>

    

        </div>
        )
    }
}
export default Main;