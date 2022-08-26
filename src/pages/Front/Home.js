import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import {useMergeState} from "../../utils/helpers";
import Particles from "react-particles-js";
import Test from '../../assets/images/home/test.svg';
import Report from '../../assets/images/home/report.svg';
import Go from '../../assets/images/home/go.svg';
import Prof1 from '../../assets/images/home/prof1.jpg';
import Prof2 from '../../assets/images/home/prof2.jpg';
import Laptop from '../../assets/images/home/laptop2.png';
import Header from '../../layouts/FrontHeader';
import Footer from '../../layouts/Footer';

import App from '../../assets/images/home/hero.png';

const Home = props => {
    const [state, setState] = useMergeState({
        featured: [],
        attendants: [],
        shopSchedule: []
    });
    
    const HeroStyle = {
        width: "100%",
        minHeight: "70vh",
        // backgroundImage: "url(" + Hero + ")",
        backgroundColor: "#EAECEF",
        position: "relative",
        overflow: "hidden"
    };
    
    const Abs = {
        width: "100%",
        minHeight: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    };
    
    const HeroContent = {
        zIndex: 10
    };
    
    const VertCenter = {
        paddingTop: "30%"
    };
    
    const ImgStyles = {
        height: 300,
    };
    
    const Br1 = {
        backgroundColor: "#4040bf",
        duration: ".1s"
    };
    
    const Br2 = {
        backgroundColor: "#bf4060",
        duration: ".5s"
    };
    
    const Be = {
        totalDuration: "1.2s",
    };
    
    const show = () => {
        this.setState({
            btn: true
        })
    };
    
    const toggleNavs = (e, state, index) => {
        e.preventDefault();
        this.setState({
            [state]: index
        });
    };
    
    useEffect(() => {
    
    }, []);

    return <>
        <div className="min-vh-100">
    <Header/>
        
            <div style={HeroStyle}>
                <div style={Abs}>
                
                    <Particles className={Abs}
                               height={"70vh"}
                               params={{
                                   "particles": {
                                       "number": {
                                           "value": 70,
                                           "density": {
                                               "enable": false
                                           }
                                       },
                                       "color": {
                                           "value": "#3e4e5e",
                                       },
                                       "size": {
                                           "value": 3,
                                           "random": true,
                                           "anim": {
                                               "speed": 4,
                                               "size_min": 0.3
                                           }
                                       },
                                       "line_linked": {
                                           "enable": true,
                                           "color": "#94a6b8",
                                       },
                                       "move": {
                                           "random": true,
                                           "speed": .8,
                                           "direction": "all",
                                           "out_mode": "out"
                                       }
                                   },
                                   "interactivity": {
                                       "events": {
                                           "onhover": {
                                               "enable": true,
                                               "mode": "bubble"
                                           },
                                           "onclick": {
                                               "enable": true,
                                               "mode": "repulse"
                                           }
                                       },
                                       "modes": {
                                           "bubble": {
                                               "distance": 250,
                                               "duration": 2,
                                               "size": 0,
                                               "opacity": 0
                                           },
                                           "repulse": {
                                               "distance": 400,
                                               "duration": 4
                                           }
                                       }
                                   }
                               }}
                    />
                
                    <div style={Abs}>
                        <div className={'container'} style={HeroContent}>
                            <div className={'row'}>
                                <div className={'col-lg-6'}>
                                    <div style={VertCenter}>
                                    
                                        <h3 className="fade-in one font-weight-600">
                                            Learn, test and interact wherever you are.
                                        </h3>
                                    
                                        <h1 className="h1-custom home-title">
                                            <span>Online Learning</span>
                                            <span>Made Easy</span>
                                        </h1>
                                    
                                        <h2 className="fade-in two maitree display-4" style={{fontSize:"23px"}}>With e-Learn Nigeria Maritime University</h2>
                                    
                                        <a href="/login" className="fade-in two btn btn-primary mt-3">
                                            Get Started
                                            <i className="fa fa-arrow-right ml-2"/>
                                        </a>
                                
                                    </div>
                                </div>
                            
                                <div className="col-lg-6 text-right">
                                    <img src={App} alt="" className="mt-6 fade-in one" />
                                </div>
                            </div>
                        </div>
                    </div>
            
                </div>
            </div>
        
            <div className="container">
                <div className="row justify-content-center">
                
                    <div className="col-12 col-md-8 text-center">
                        <h2 className="h1 font-weight-bolder mb-3 mt-5">
                            Meet our intuitive platform
                        </h2>
                        <p className="lead font-weight-400 mb-5" style={{fontSize:"17px"}}>
                            e-Learn NMU provides the best solution to online learning in Nigeria.
                            <br />
                            Built for educational institutions looking to adopt an internet-based
                            approach to learning,
                            <br />
                            e-Learn NMU is the all-in-one platform you need.
                        </p>
                    </div>
            
                </div>
            </div>
        
            <div className="container mt-7">
                <div className="row">
                    <div className="col-lg-4 col-md-6 mb-7">
                        <div className="card card-lift--hover border border-primary cards-bg-tint">
                            <div className="card-body">
                                <div className="info text-left">
                                    <div className="icon icon-lg icon-shape icon-shape-primary shadow rounded-circle mb-4">
                                        <img src={Test} alt=""/>
                                    </div>
                                
                                    <h3 className="info-title text-uppercase text-primary pl-0">
                                        Test Online
                                    </h3>
                                
                                    <p className="description font-weight-400 opacity-8">
                                        Set, take and review tests and exams online at your convenience.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                
                    <div className="col-lg-4 col-md-6 mt--5 mb-5">
                        <div className="card card-lift--hover border border-primary cards-bg-tint">
                            <div className="card-body">
                                <div className="info text-left">
                                    <div className="icon icon-lg icon-shape icon-shape-primary shadow rounded-circle mb-4">
                                        <img src={Go} alt=""/>
                                    </div>
                                
                                    <h3 className="info-title text-uppercase text-primary pl-0">
                                        Learn on the go!
                                    </h3>
                                
                                    <p className="description font-weight-400 opacity-8">
                                        Access your classes, materials and tutors anywhere, from any device.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                
                    <div className="col-lg-4 col-md-6 mb-5">
                        <div className="card card-lift--hover border border-primary cards-bg-tint">
                            <div className="card-body">
                                <div className="info text-left">
                                    <div className="icon icon-lg icon-shape icon-shape-primary shadow rounded-circle mb-4">
                                        <img src={Report} alt=""/>
                                    </div>
                                
                                    <h3 className="info-title text-uppercase text-primary pl-0">
                                        Live Reports
                                    </h3>
                                
                                    <p className="description font-weight-400 opacity-8">
                                        Get summaries and details of all activities in your school and classroom.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
            </div>
        
            <div>
                <div className="container">
                    <div className='row'>
                        <div className="col-lg-4">
                            <div className="my-auto pt-5 text-center">
                                <h2 className='font-weight-bold mt-5'>Platform designed for real-life learning</h2>
                                <p>
                                    Move your education journey forward without putting life on hold. eLearn NG helps you with learning that fits your routine.
                                </p>
                            </div>
                    
                        </div>
                        <div className="col-lg-8">
                            <div className="text-center">
                                <img src={Laptop} alt="" style={{width: '100%'}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            <div className="bg-sky py-6">
                <div className="container">
                    <h2 className="font-weight-bold text-center mb-3 mt-5">
                        Trusted by renowned Academia.
                    </h2>
                    <p className="text-center">
                        The e-Learn NMU platform is used by some of the best institutions in the country.
                    </p>
                
                    {/*<div className="row mt-4">*/}
                    {/*    <div className="col-lg-6">*/}
                    {/*        <div className="card card-testimonial pt-4">*/}
                    {/*            <div className="card-avatar">*/}
                    {/*                <a href="#pablo">*/}
                    {/*                    <img src={Prof1} alt="" className="img img-raised rounded"/>*/}
                    {/*                </a>*/}
                    {/*            </div>*/}
                    {/*        */}
                    {/*            <div className="card-body text-center">*/}
                    {/*                <p className="card-description">*/}
                    {/*                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod*/}
                    {/*                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim*/}
                    {/*                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea*/}
                    {/*                    commodo consequat.*/}
                    {/*                </p>*/}
                    {/*                <h3 className="card-title mb-0">Oscar Okolo</h3>*/}
                    {/*                <h5 className="category text-muted">*/}
                    {/*                    Ph.D*/}
                    {/*                </h5>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    
                    {/*    <div className="col-lg-6">*/}
                    {/*        <div className="card card-testimonial pt-4">*/}
                    {/*            <div className="card-avatar">*/}
                    {/*                <a href="#pablo">*/}
                    {/*                    <img src={Prof2} alt="" className="img img-raised rounded"/>*/}
                    {/*                </a>*/}
                    {/*            </div>*/}
                    {/*        */}
                    {/*            <div className="card-body text-center">*/}
                    {/*                <p className="card-description">*/}
                    {/*                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod*/}
                    {/*                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim*/}
                    {/*                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea*/}
                    {/*                    commodo consequat.*/}
                    {/*                </p>*/}
                    {/*                <h3 className="card-title mb-0">Jonah Anyanwu</h3>*/}
                    {/*                <h5 className="category text-muted">*/}
                    {/*                    Ph.D*/}
                    {/*                </h5>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
        
            </div>
    <Footer/>

        </div>

    </>
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);