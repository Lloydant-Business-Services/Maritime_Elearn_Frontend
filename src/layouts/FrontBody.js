import React, {Component} from 'react';
import Footer from "./Footer";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import {Route, Switch} from "react-router-dom";

import "../assets/css/Front.css";

import ForgotPassword from "../pages/Front/ForgotPassword";
import Home from "../pages/Front/Home";
import Register from "../pages/Front/Auth/Register";
import Login from "../pages/Front/Auth/Login";
import PaymentSuccess from "../pages/Front/PaymentSuccess";
import PageNotFound from "../pages/PageNotFound";

import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../redux/actions";
import Dialog from "../components/Dialog/Dialog";
import FrontHeader from "./FrontHeader";
import {UnAuthRoute} from "../components/Authenticator/Authenticate";

export class FrontBody extends Component {
    render() {
        return (
            <>
                {/* <FrontHeader/> */}
                <main className={this.props[stateKeys.PAGE_CLASS]}>
                    <ErrorBoundary>
                        <Switch>
                            <Route path={'/'} component={Home} exact={true}/>
                            <Route path={'/home'} component={Home}/>
                            
                            <Route path={'/forgot'} component={ForgotPassword}/>
                            <UnAuthRoute path={'/register'} component={Register}/>
                            <Route path={'/login'} component={Login}/>
                            <Route path={'/paymentfeed'} component={PaymentSuccess}/>
                            <Route component={PageNotFound}/>
                        </Switch>
                    </ErrorBoundary>
                    <Dialog/>
                </main>
                {/* <Footer/> */}
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FrontBody);
