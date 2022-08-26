import React from 'react'
import logo2 from '../../src/assets/images/home/logo.png';

const Footer = (props) => {
    return (
        <div className=" bg-primary" style={{bottom: "0 !important",}}>
            <div className="container">
                {/* Footer */}
                <footer className="footer pt-6 bg-primary text-white">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-lg-6">
                            <img src={logo2} className="mr-2" alt="" height={50} width={50}/>
                            <span className="text-sentence font-weight-500"> e-Learn NMU</span>
                
                            <h3 className="mt-5 text-white">Online Learning the right way.</h3>
                
                            <div className="socials my-4">
                                <a href="https://twitter.com/LLOYDANTBS" target="_blank" className="text-white"><i className="fab fa-twitter mr-3"></i></a>
                                <a href="https://www.instagram.com/lloydant_ng/" target="_blank" className="text-white"><i className="fab fa-instagram mr-3"></i></a>
                            </div>
                        </div>
            
                        <div className="col-lg-6 d-flex justify-content-end foot-content">
                            <div style={{paddingRight: '150px'}} className="d-flex flex-column">
                                <h3 className="text-uppercase">About</h3>
                                <a href="https://lloydant.com/Home/About" target="_blank" className="mb-3">About Us</a>
                                {/* <a href="#" className="mb-3">Pricing </a> */}
                                <a href="https://lloydant.com/Home/Contacts" className="mb-3">Support </a>
                            </div>
                
                            <div className="d-flex flex-column">
                                <h3 className="text-uppercase">Company</h3>
                                <a href="https://lloydant.com/Home/Contacts" className="mb-3">Contact Us</a>
                                <a href="https://lloydant.com/Home/" className="mb-3">Our Products </a>
                                {/* <a href="#" className="mb-3">Get a Quote </a> */}
                            </div>
                
                            {/* <div className="d-flex flex-column">
                                <h4 className="text-uppercase">Legal</h4>
                                <a href="#" className="mb-3">Terms of Use</a>
                                <a href="#" className="mb-3">Privacy </a>
                                <a href="#" className="mb-3">Legal </a>
                            </div> */}
                        </div>
                    </div>
        
                    <div className="copyright text-white-50 mt-5">
                        Copyright © {new Date().getFullYear()} <a href="https://www.lloydant.com/" className="font-weight-bold ml-1 text-white" target="_blank" rel="noopener noreferrer">Lloydant</a>. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    )
};

export default Footer
