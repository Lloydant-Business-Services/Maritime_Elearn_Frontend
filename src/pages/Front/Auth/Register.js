import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../../redux/actions";
import {Link} from "react-router-dom";
import Endpoint from '../../../utils/endpoint';
import {handleFormSubmissionError} from "../../../utils/helpers";
import ClipLoader from "react-spinners/ClipLoader";
import {loginUser} from "../../../utils/auth";

class Register extends Component {
    state = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: '',
        phone: '',
        terms: false,
        passCorrect: 'unset',
        formIncomplete: false,
    };

    changeText = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    comparePassword = () => {
        if (this.state.password === this.state.password_confirm) {
            this.setState({passCorrect: 'equal'})
        } else {
            this.setState({passCorrect: 'unequal'})
        }
    };

    register = (e) => {
        e.preventDefault();
        this.setState({loading: true, success: false, error: false});

        if (!this.state.first_name || !this.state.last_name || !this.state.email || !this.state.password || !this.state.password_confirm
            || !this.state.phone || !this.state.terms) {
            this.setState({formIncomplete: true, loading: false});
            return
        }

        if (this.state.password !== this.state.password_confirm) {
            this.setState({loading: false});
            return
        }

        const RegProps = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirm,
            terms: this.state.terms,
            phone: this.state.phone,
            // account_id: this.state.account_id
        };

        Endpoint.register(RegProps)
            .then((res) => {
                this.setState({error: false, success: true, loading: false});
                loginUser(res.data.data.token, res.data.data.user, true, true);
            })
            .catch((error) => handleFormSubmissionError(error, this));

        return false;
    };

    componentDidMount() {
        this.props.setState('home', stateKeys.PAGE_CLASS);

        this.props.setState('Sample content for dialog', stateKeys.DIALOG_CONTENT);
    }

    render() {
        const override = {
            display: 'block',
            margin: '0 auto',
            // borderColor: 'red',
        };

        return (
            <>
                {/*Hero section*/}

                <div className="container py-4 py-lg-5 my-4">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card border-0 box-shadow">
                                <div className="card-body">
                                    <h2 className="h4 mb-3">No account? Register</h2>
                                    <p className="font-size-sm text-muted mb-4">Registration takes less than a minute
                                        but
                                        gives you full control over your orders.</p>

                                    {this.state.formIncomplete ?
                                        <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                                            <p className="small text-light mb-0">
                                                <i className="czi-bell mr-2"/> Please fill in all fields.
                                            </p>
                                        </div>
                                        : null
                                    }
                                    {this.state.error ?
                                        <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                                            <p className="small text-light mb-0">
                                                <i className="czi-bell mr-2"/> {this.state.errorMessage}
                                            </p>
                                        </div>
                                        : null
                                    }
                                    <form className="needs-validation" noValidate onSubmit={this.register}>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="reg-fn">First Name</label>
                                                    <input className="form-control" onChange={this.changeText}
                                                           name='first_name' type="text" required id="reg-fn"/>
                                                    <div className="invalid-feedback">Please enter your first name!
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="reg-ln">Last Name</label>
                                                    <input className="form-control" onChange={this.changeText}
                                                           name='last_name' type="text" required id="reg-ln"/>
                                                    <div className="invalid-feedback">Please enter your last name!</div>
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="reg-email">E-mail Address</label>
                                                    <input className="form-control" onChange={this.changeText}
                                                           name='email' type="email" required id="reg-email"/>
                                                    <div className="invalid-feedback">Please enter valid email
                                                        address!
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="reg-phone">Phone Number</label>
                                                    <input className="form-control" onChange={this.changeText}
                                                           name='phone' type="text" required id="reg-phone"/>
                                                    <div className="invalid-feedback">Please enter your phone number!
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="reg-password">Password</label>
                                                    <input className="form-control" onChange={this.changeText}
                                                           onKeyUp={this.comparePassword}
                                                           name='password' type="password" required id="reg-password"/>
                                                    <div className="invalid-feedback">Please enter password!</div>
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="reg-password-confirm">Confirm Password</label>
                                                    <input className="form-control" onChange={this.changeText}
                                                           onKeyUp={this.comparePassword}
                                                           name='password_confirm' type="password" required
                                                           id="reg-password-confirm"/>
                                                    {this.state.passCorrect === 'unequal' ?
                                                        <div className="small text-danger my-2"><i
                                                            className="czi-close-circle mr-2"/> Passwords do not match!
                                                        </div>
                                                        : null
                                                    }
                                                    {this.state.passCorrect === 'equal' ?
                                                        <div className="small text-success my-2"><i
                                                            className="czi-check-circle mr-2"/>Passwords match!</div>
                                                        : null
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-checkbox">
                                            <input className="custom-control-input" onChange={this.changeText}
                                                   name='terms' type="checkbox" checked={this.state.terms}
                                                   id="remember_me"/>
                                            <label className="custom-control-label" htmlFor="remember_me">
                                                I agree to the <Link target={'_blank'} to={'/terms'}>Terms of Use</Link>
                                            </label>
                                        </div>

                                        <hr/>

                                        <div className="d-flex justify-content-between pt-4">
                                            <p>Already have an account? <span className='font-weight-bold'> <Link
                                                to={'/login'}> Login</Link></span></p>

                                            {this.state.loading ?
                                                <div className="sweet-loading">
                                                    <ClipLoader
                                                        css={override}
                                                        size={30}
                                                        color={"#FF9595"}
                                                        loading={this.state.loading}
                                                    />
                                                </div>
                                                :
                                                <button className="btn btn-custom" type="submit">
                                                    <i className="czi-user mr-2 ml-n1"/>Sign Up
                                                </button>
                                            }

                                        </div>
                                    </form>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Register);