import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../../redux/actions";
import axios from "axios";
import {Link} from "react-router-dom"
import {handleFormSubmissionError} from "../../../utils/helpers";
import Endpoint from "../../../utils/endpoint";
import {URL, postData} from "../../../utils/config";
import ClipLoader from "react-spinners/ClipLoader";
import {loginUser} from "../../../utils/auth";
import bg from '../../../assets/images/auth2.png';
import * as Unicons from '@iconscout/react-unicons';
import {userLoggedIn} from "../../../utils/auth";
import toast, {Toaster} from "react-hot-toast";

class Login extends Component {
    state = {
        username: '',
        password: '',
        remember_me: false,
        formIncomplete: false,
        loading: false,
        success: false,
    };

    handleInput = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };
    
    loadDataError = (error) => toast.error("Something went wrong, pls check your connection.", {
        style: {
            border: '1px solid #DC2626',
            padding: '16px',
            background: '#DC2626',
            color: '#fff',
            borderRadius: '3rem',
        },
        iconTheme: {
            primary: '#FFFAEE',
            secondary: '#DC2626',
        },
    });
    
    handleLogin = (e) => {
        e.preventDefault();
        this.setState({loading: true, success: false, error: false});

        if (!this.state.username || !this.state.password) {
            this.setState({formIncomplete: true, loading: false});
            return
        }

        const LoginProps = {
            userName: this.state.username,
            password: this.state.password,
        };

        Endpoint.login(LoginProps)
            .then((res) => {
                if(res.status === 200) {
                    this.setState({error: false, success: true, loading: false});
                    loginUser(res.data.token, res.data, true);
                } else if(res.status === 204) {
                    this.setState({error: true, errorMessage: "Username or password incorrect", success: false, loading: false});
                } else {
                    this.setState({error: true, errorMessage: "Something went wrong, try again later", success: false, loading: false});
                }
            })
            .catch((error) => handleFormSubmissionError(error, this));

        return false;
    };

    componentDidMount() {

        // window.addEventListener('focus', setClear(true));

        this.props.setState('login', stateKeys.PAGE_CLASS);
        
        if (localStorage.getItem('user') && localStorage.getItem('token')) {
            let user = JSON.parse(localStorage.getItem('user'));
            let token = localStorage.getItem('token');
            console.log(user);
    
            if (user.userId) {
                this.setState({pageLoading: true});
    
                loginUser(token, user, true);
                // Endpoint.getUserProfile(user.userId)
                //     .then((res) => {
                //         console.log(res.data);
                //         this.setState({pageLoading: false});
                //         loginUser(res.data.token, res.data, true);
                //     })
                //     .catch((error) => {
                //         console.log('error');
                //         this.loadDataError(error, this);
                //         this.setState({pageLoading: false});
                //     })
            }
        }
    }

    render() {
        return (
            <>
    
                {this.state.pageLoading ?
                    <div className="spin-back">
                        <div className="jumbotron jum2">
                            <ClipLoader
                                size={100}
                                color={"#192f59"}
                                loading={this.state.pageLoading}
                            />
                
                            <h3>Just a moment...</h3>
                        </div>
                    </div>
                    : null
                }
    
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
    
                <div className="container py-4 py-lg-5 my-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="card box-shadow bg-custom-light">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="">
                                            <div className="card-body">
                                                <h2 className="mb-1">Login to your account</h2>
                    
                                                <hr className="mt-2 mb-3"/>
                    
                                                {this.state.formIncomplete ?
                                                    <div className="bg-danger border-rad-full text-center p-2 mb-3">
                                                        <p className="small text-white mb-0">
                                                            <Unicons.UilBellSchool size="20"/> Please fill in all fields.
                                                        </p>
                                                    </div>
                                                    : null
                                                }
                    
                                                {this.state.error ?
                                                    <div className="bg-danger border-rad-full text-center p-2 mb-3">
                                                        <p className="small text-white mb-0">
                                                            <Unicons.UilBell size="20"/> {this.state.errorMessage}
                                                        </p>
                                                    </div>
                                                    : null
                                                }
                    
                                                {this.state.success ?
                                                    <div className="bg-success border-rad-full text-center p-2 mb-3">
                                                        <p className="small text-white mb-0">
                                                            <Unicons.UilBell size="20"/> <span>Successful, redirecting...</span>
                                                        </p>
                                                    </div>
                                                    : null
                                                }
                    
                                                <form method="post" onSubmit={(e) => {this.handleLogin(e);}} >
                                                    <div className="form-group row justify-content-center">
                                                        <div className="col-md-12">
                                                            <input value={this.state.username} placeholder="Username"
                                                                   id="username" type="text" className="form-control"
                                                                   onChange={(e) => this.setState({username: e.target.value}) } required />
                                                        </div>
                                                    </div>
                        
                                                    <div className="form-group row justify-content-center">
                                                        <div className="col-md-12">
                                                            <input placeholder="Password"
                                                                   onChange={(e) => this.setState({password: e.target.value})}
                                                                   value={this.state.password} id="password" type="password"
                                                                   className="form-control" required
                                                            />
                                
                                                            {/*<Link to="forgotpassword" className="d-block">*/}
                                                            {/*    <span className="small text-primary text-left">*/}
                                                            {/*        Forgot Password?*/}
                                                            {/*    </span>*/}
                                                            {/*</Link>*/}
                                                        </div>
                        
                                                    </div>
                        
                                                    <div className="form-group row justify-content-center">
                                                        <div className="col-md-12 text-left d-flex">
                                                            <button className="btn btn-primary mr-4 btn-arrow-right" type="submit">
                                                                Login <Unicons.UilArrowRight />
                                                            </button>
    
                                                            {
                                                                this.state.loading ?
                                                                        <div className="d-flex">
                                                                            <div className=" mt-2">
                                                                                <ClipLoader size={30} color={"#192f59"}
                                                                                            Loading={this.state.loading}/>
                                                                            </div>
                                                                            
                                                                           <div className=" align-content-center mt-2">
                                                                               <span className="ml-2 ">just a moment...</span>
                                                                           </div>
                                                                        </div>
                                                                :
                                                                null
                                                            }
                                                            
                                                        </div>
                                                    </div>
                                                </form>
                
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6 overflow-hidden">
                                        <div className="r-card-br w-100 h-100" style={{backgroundImage: "url(" + bg + ")", backgroundPosition: 'center', backgroundSize: "cover"}}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>

            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
