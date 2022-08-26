import React, {Component} from 'react';
import "./assets/css/App.css";
import "./assets/css/Helpers.css";
import "./assets/css/Colors.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import FrontBody from "./layouts/FrontBody";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import PageLoader from "./components/Loader/PageLoader/PageLoader";
import {AuthRoute} from "./components/Authenticator/Authenticate";
import ToastContainer from "./components/Popup/ToastContainer";
import {userType} from "./utils/Identifiers";
import SuperAdminBody from "./layouts/SuperAdminBody";
import SchoolAdminBody from "./layouts/SchoolAdminBody";
import StudentBody from "./layouts/StudentBody";
import HODBody from "./layouts/HODBody";
import InstructorBody from "./layouts/InstructorBody";
import CompleteProfileContextProvider from "./contexts/CompleteProfileContext";

export class App extends Component {
    render() {
        return (
            <Router>
                <ScrollToTop>
                    <Switch>
                        
                        <AuthRoute path="/admin" authorized={[userType.superadmin]} component={SuperAdminBody}/>
                        <AuthRoute path="/schooladmin" authorized={[userType.schooladmin]} component={SchoolAdminBody}/>
                        <AuthRoute path="/hod" authorized={[userType.hod]} component={HODBody}/>
                        <AuthRoute path="/instructor" authorized={[userType.instructor]} component={InstructorBody}/>
                        <AuthRoute path="/student" authorized={[userType.student]} component={StudentBody}/>
                        
                        <Route component={FrontBody}/>
                    </Switch>
                    
                    <CompleteProfileContextProvider/>
                    <PageLoader/>
                    <ToastContainer/>
                </ScrollToTop>
            </Router>
        )
    }
}

export default App
