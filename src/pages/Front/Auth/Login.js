import React, { Component } from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps, stateKeys } from "../../../redux/actions";
import axios from "axios";
import { Link } from "react-router-dom";
import { handleFormSubmissionError } from "../../../utils/helpers";
import Endpoint from "../../../utils/endpoint";
import { URL, postData } from "../../../utils/config";
import ClipLoader from "react-spinners/ClipLoader";
import PulseLoader from "react-spinners/PulseLoader";
import { loginUser } from "../../../utils/auth";
import bg from "../../../assets/images/auth2.png";
import * as Unicons from "@iconscout/react-unicons";
import { userLoggedIn } from "../../../utils/auth";
import toast, { Toaster } from "react-hot-toast";
import lgImg from "../../../assets/images/bg_1.jpg";
import $ from "jquery";
import Logo from "../../../assets/images/home/logo2.png";
import Spinner from "../Spinner";
import { Input, Button, Col, Row, Select, InputNumber, DatePicker, AutoComplete,Result, Cascader, Tooltip, Space, Alert } from "antd";
import { Slide, Fade, AttentionSeeker } from "react-awesome-reveal";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { ThemeProvider } from "react-bootstrap";



const FORGOT_PASSWORD = 'forgot_password'
const OTP_REQUEST = 'otp_request'
const CREATE_NEW_PASSWORD = 'new_password'
const LOGIN = 'login'

class Login extends Component {
    state = {
        username: "",
        password: "",
        remember_me: false,
        formIncomplete: false,
        loading: false,
        success: false,
        pageLoading: true,
        loginForm: true,
        headText: null,
        headText: "Sign In",
        buttomText:"Enter login credentials",
        // buttomText:null,
        otpSection:false,
        resetSuccessful: false
    };

    handleInput = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    loadDataError = (error) =>
        toast.error(error, {
            style: {
                border: "1px solid #DC2626",
                padding: "16px",
                background: "#DC2626",
                color: "#fff",
                borderRadius: "3rem",
            },
            iconTheme: {
                primary: "#FFFAEE",
                secondary: "#DC2626",
            },
        });

        InitiateForgotPassword = (e) => {
            e.preventDefault();
    
            if (!this.state.email) {
                this.setState({ error: true, loading: false });
                this.loadDataError("Please enter an email address")
                return;
            }
            this.setState({ loading: true, success: false, error: false });
            $("#reset_password").attr('disabled', true)
          
    
            Endpoint.resetPassword(this.state.email)
                .then((res) => {
                    console.log(res, "result11");
                    if (res.status === 200) {
                        console.log(res, "result");
                        this.setState({ otpSection: true, forgotPassword:false, loginForm:false, loading: false, buttomText:null });
                        //$("#reset_password").attr('disabled', true)

                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({loading: false });

                    // this.loadDataError(error.message);
                });
    
            return false;
        };

    handleLogin = (e) => {
        e.preventDefault();
        this.setState({ loading: true, success: false, error: false });

        if (!this.state.username || !this.state.password) {
            this.setState({ formIncomplete: true, loading: false });
            return;
        }

        const LoginProps = {
            userName: this.state.username,
            password: this.state.password,
        };

        Endpoint.login(LoginProps)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ error: false, success: true, loading: false });
                    loginUser(res.data.token, res.data, true);
                } else if (res.status === 204) {
                    this.setState({ error: true, errorMessage: "Username or password incorrect", success: false, loading: false });
                } else {
                    this.setState({ error: true, errorMessage: "Something went wrong, try again later", success: false, loading: false });
                }
            })
            .catch((error) => {
                this.loadDataError("Invalid Login Credentials")
                this.setState({loading:false})
            });

        return false;
    };
    clearInputFields() {
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        this.setState({ pageLoading: false });
    }
    componentDidMount() {
        setTimeout(() => {
        this.setState({ pageLoading: false });
            this.clearInputFields();
        }, 2000);
        // window.addEventListener('focus', setClear(true));

        this.props.setState("login", stateKeys.PAGE_CLASS);

        if (localStorage.getItem("user") && localStorage.getItem("token")) {
            let user = JSON.parse(localStorage.getItem("user"));
            let token = localStorage.getItem("token");
            console.log(user);

            if (user.userId) {
                this.setState({ pageLoading: true });

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
    resolveClickAction = (event) => {
        if(event === FORGOT_PASSWORD){
            this.setState({
                forgotPassword:true, 
                loginForm:false, 
                otpSection:false, 
                newPasswordSection:false,
                headText:"Password Reset",
                buttomText: "Enter your registered email address"
            })
        }
        else if(event === LOGIN){
            this.setState({
                forgotPassword:false, 
                loginForm:true, 
                otpSection:false, 
                newPasswordSection:false,
                headText:"Sign In",
                buttomText: "Enter login credentials",
                resetSuccessful: false,
            })
            // this.clearInputFields();
        }
    }

    otpValidation = (e) => {
        e.preventDefault();
    
            if (!this.state.email || !this.state.otp) {
                this.setState({ error: true, loading: false });
                this.loadDataError("Please enter OTP");
                return;
            }
            this.setState({ loading: true, success: false, error: false });
          
    
            Endpoint.validatePasswordOTP(this.state.email, this.state.otp)
                .then((res) => {
                    console.log(res, "result11");
                    if (res.status === 200) {
                        console.log(res, "result");
                        this.setState({ otpSection: false, forgotPassword:false, loginForm:false, loading: false, buttomText:null,resetSuccessful:true,headText:false });
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({loading: false });

                    // this.loadDataError(error.message);
                });
    
            return false;
    }
    render() {
        require("../../../assets/css/login.css");
        require("antd/dist/antd.css");

        return (
            <>
                {this.state.pageLoading ? <Spinner /> : null}

                <Toaster position="top-center" reverseOrder={false} />

                <div className="d-lg-flex half">
                    <div className="bg order-1 order-md-2 login__bg">
                        <div className="container p-top-30-vh">
                            <h1 style={{ color: "#FFF", fontSize: "4em", fontWeight:"bolder" }} className="text-center">
                                e-Learn NMU
                            </h1>
                        </div>
                    </div>
                    <div className="contents order-2 order-md-1">
                        <div className="container">
                            <div className="row p-top-scr-vh justify-content-center">
                                <div className="col-md-7">
                                    {this.state.headText ? <center>
                                        <img src={Logo} style={{ height: "130px" }} />
                                        <br />
                                        <br />
                                        <h3 style={{ fontSize: "2em" }}>{this.state.headText}</h3>
                                        {/* <h3>LlodAnt Elearning Solution</h3> */}
                                        <br />
                                        <br />
                                    </center> : null}
                                    <div className="mb-4">
                                        {/* <h3 style={{fontSize:'14px'}}>Sign In</h3> */}
                                        {this.state.buttomText ? <p className="mb-4">{this.state.buttomText}</p> : null}
                                    </div>
                                    {
                                        this.state.loginForm ? 
                                        <Fade>
                                            <AttentionSeeker effect={"shake"} duration={300}>
                                                <section>
                                        <form
                                        method="post"
                                        onSubmit={(e) => {
                                            this.handleLogin(e);
                                        }}
                                    >
                                        <div className="form-group row justify-content-center">
                                            <div className="col-md-12">
                                                {/* <input value={this.state.username} placeholder="Username" id="username" type="text" className="form-control" onChange={(e) => this.setState({ username: e.target.value })} required /> */}
                                                <Input
                                                    placeholder="Input Username"
                                                    size="large"
                                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                    style={{ borderRadius: "20px" }}
                                                    id="username"
                                                    onChange={(e) => this.setState({ username: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row justify-content-center">
                                            <div className="col-md-12">
                                                {/* <input placeholder="Password" onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} id="password" type="password" className="form-control" required /> */}
                                                {/* <span>
                                                    <i className="fa fa-eye" />
                                                </span> */}
                                                {/*<Link to="forgotpassword" className="d-block">*/}
                                                {/*    <span className="small text-primary text-left">*/}
                                                {/*        Forgot Password?*/}
                                                {/*    </span>*/}
                                                {/*</Link>*/}

                                                <Space direction="vertical" style={{ width: "100%" }}>
                                                    {/* <Input.Password placeholder="input password" /> */}
                                                    <Input.Password
                                                        placeholder="Input password"
                                                        size="large"
                                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                        style={{ borderRadius: "20px" }}
                                                        id="password"
                                                        onChange={(e) => this.setState({ password: e.target.value })}
                                                    />
                                                </Space>
                                            </div>

                                            {/* 
                                            <Input.Group compact>
                                                <Input style={{ width: "calc(100% - 200px)" }} defaultValue="git@github.com:ant-design/ant-design.git" />
                                                <Tooltip title="copy git url">
                                                    <Button icon={<i className="fa fa-eye" />} />
                                                </Tooltip>
                                            </Input.Group> */}
                                        </div>

                                        <div className="form-group row justify-content-center">
                                            <div className="col-md-12 text-left d-flex">
                                                <button className="btn btn-primary mr-4 btn-arrow-right" type="submit">
                                                    Login <Unicons.UilArrowRight />
                                                </button>

                                                {this.state.loading ? (
                                                    <div className="d-flex">
                                                        <div className=" mt-2">
                                                            <PulseLoader size={10} color={"#192f59"} Loading={this.state.loading} />
                                                        </div>

                                                        {/* <div className=" align-content-center mt-2">
                                                            <span className="ml-2 ">just a moment...</span>
                                                        </div> */}
                                                    </div>
                                                ) : null}
                                                <p style={{ color: "#3a56a7", fontSize: "14px", cursor: "pointer" }} onClick={() => this.resolveClickAction(FORGOT_PASSWORD)}>Forgot password?</p>
                                            </div>
                                        </div>
                                    </form> 
                                    </section>
                                            </AttentionSeeker>
                                        </Fade>
                                    : null}

                                    {this.state.forgotPassword ? (
                                        <Fade>
                                            <AttentionSeeker effect={"shake"} duration={300}>
                                                <section>
                                                    <form
                                                        method="post"
                                                        onSubmit={(e) => {
                                                            this.handleLogin(e);
                                                        }}
                                                    >
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-12">
                                                                {/* <input value={this.state.username} placeholder="Username" id="username" type="text" className="form-control" onChange={(e) => this.setState({ username: e.target.value })} required /> */}
                                                                <Input
                                                                    placeholder="Email address"
                                                                    size="large"
                                                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                                    style={{ borderRadius: "20px" }}
                                                                    id="email"
                                                                    onChange={(e) => this.setState({ email: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-12 text-left d-flex">
                                                                <button className="btn btn-primary mr-4 btn-arrow-right" id="reset_password" type="button" onClick={(e) => this.InitiateForgotPassword(e)}>
                                                                    Reset Password <Unicons.UilArrowRight />
                                                                </button>

                                                                {this.state.loading ? (
                                                                    <div className="d-flex">
                                                                        <div className=" mt-2">
                                                                            <PulseLoader size={8} color={"#192f59"} Loading={this.state.loading} />
                                                                        </div>

                                                                    </div>
                                                                ) : null}
                                                                &nbsp;
                                                                &nbsp;
                                                                &nbsp;
                                                                <p style={{ color: "#3a56a7", fontSize: "14px", cursor: "pointer" }} onClick={() => this.resolveClickAction(LOGIN)}><i className="fa fa-arrow-left" /> Login</p>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </section>
                                            </AttentionSeeker>
                                        </Fade>
                                    ) : null}

                                    {/* OTP Section */}
                                    {this.state.otpSection ? (
                                         <Fade>
                                         <AttentionSeeker effect={"shake"} duration={300}>
                                             <section>
                                        <form
                                            method="post"
                                            // onSubmit={(e) => {
                                            //     this.handleLogin(e);
                                            // }}
                                        >
                                            <div className="form-group row justify-content-center">
                                                <div className="col-md-12" style={{marginBottom:'10px'}}>
                                                <Alert
                                                    message="OTP Sent"
                                                    description="An OTP has been sent to the email address provided. Enter OTP to complete this process."
                                                    type="success"
                                                    showIcon
                                                    />


                                                </div>
                                                <div className="col-md-12">
                                                    {/* <input value={this.state.username} placeholder="Username" id="username" type="text" className="form-control" onChange={(e) => this.setState({ username: e.target.value })} required /> */}
                                                    <Input
                                                        placeholder="Enter OTP"
                                                        size="large"
                                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                        style={{ borderRadius: "20px" }}
                                                        id="otp"
                                                        onChange={(e) => this.setState({ otp: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group row justify-content-center">
                                                <div className="col-md-12 text-left d-flex">
                                                    <button className="btn btn-primary mr-4 btn-arrow-right" type="button" onClick={(e) => this.otpValidation(e)}>
                                                        Validate OTP<Unicons.UilArrowRight />
                                                    </button>

                                                    {this.state.loading ? (
                                                        <div className="d-flex">
                                                            <div className=" mt-2">
                                                                <PulseLoader size={10} color={"#192f59"} Loading={this.state.loading} />
                                                            </div>

                                                            {/* <div className=" align-content-center mt-2">
                                                                <span className="ml-2 ">just a moment...</span>
                                                            </div> */}
                                                        </div>
                                                    ) : null}
                                                    {/* <p style={{ color: "#3a56a7", fontSize: "14px", cursor: "pointer" }}>Forgot password?</p> */}
                                                </div>
                                            </div>
                                        </form>
                                         </section>
                                         </AttentionSeeker>
                                     </Fade>
                                    ) : null}

                                    {/* Newpassword Section */}

                                    {this.state.resetSuccessful ? (
                                         <Fade>
                                         <AttentionSeeker effect={"shake"} duration={300}>
                                             <section>
                                        <form
                                            method="post"
                                            onSubmit={(e) => {
                                                this.handleLogin(e);
                                            }}
                                        >
                                            <div className="row justify-content-center">
                                                <div className="col-md-12">
                                                <Result
                                                    status="success"
                                                    title="Password Reset Successful!"
                                                    subTitle="Your password reset request was successful. Login in with '1234567' as your password and change immediately once logged in."
                                                    extra={[
                                                    <Button type="primary" key="console" onClick={() => this.resolveClickAction(LOGIN)}>
                                                       Login
                                                    </Button>,
                                                    <Button key="buy">Go to Home</Button>,
                                                    ]}
                                                />
                                                </div>
                                            </div>

                                    

                                           
                                        </form>
                                        </section>
                                         </AttentionSeeker>
                                     </Fade>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
