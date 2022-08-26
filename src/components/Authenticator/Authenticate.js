import React from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import { userType, PaymentCheck } from "../../utils/Identifiers";
import { getUser, loadUserInfo, userLoggedIn } from "../../utils/auth";
import StudentProfile from "../../pages/Student/Profile";
import InstructorProfile from "../../pages/Instructor/Profile";
import HODProfile from "../../pages/HOD/Profile";

export const AuthRoute = withRouter(({ component: Component, path, authorized = [], ...rest }) => {
    if (userLoggedIn()) {

        const user = getUser();
        const userTypeMain = user.roleName.toLowerCase();

        if (!user && user.token) {
            //Update full details from server
            loadUserInfo();
        }
        const emailWarning = "Kindly update your email address to continue";
        const passWarning = "Kindly update your password to continue";
           


        //Profile update check
        if ((userTypeMain.includes("student")) && (user.email == null || !user.isPasswordUpdated)) {
            
            return (
                <>
                    <Route path={path} component={Component} {...rest} />
                    <Redirect from={path}
                     to={{
                        pathname: "/student/profile",
                        state: { promptProps: user.email == null ? emailWarning : passWarning }
                      }}
                     />
                    
                </>
            );
        }
        else if (userTypeMain.includes("department administrator") && (user.email == null || !user.isPasswordUpdated)) {
            return (
                <>
                    <Route path={path} component={Component} {...rest} />
                    <Redirect from={path} 
                    to={{
                        pathname: "/hod/profile",
                        state: { promptProps: user.email == null ? emailWarning : passWarning }
                      }}
                     />
                </>
            );
        }
            else if (userTypeMain.includes("instructor") && (user.email == null || !user.isPasswordUpdated)) {
            return (
                <>
                    <Route path={path} component={Component} {...rest} />
                    <Redirect from={path} 
                    to={{
                        pathname: "/instructor/profile",
                        state: { promptProps: user.email == null ? emailWarning : passWarning }
                      }}
                    />
                </>
            );
        }
        if ((userTypeMain.includes("student")) && (user.paymentCheck == PaymentCheck.EnabledAndNotPaid)) {
            
            return (
                <>
                    <Route path={path} component={Component} {...rest} />
                    <Redirect from={path}
                     to={{
                        pathname: "/student/payment",
                      }}
                     />
                    
                </>
            );
        }
        //Authorization
        if (authorized.length && user) {
            const userType = user.roleName;
            if (!authorized.includes(userType)) {
                return <Redirect from={path} to={`/login`} />;
            }
        }

        return <Route path={path} component={Component} {...rest} />;
    } else return <Redirect from={path} to={`/login`} />;
});

export const UnAuthRoute = withRouter(({ component: Component, path, ...rest }) => {
    const user = getUser();
    if (userLoggedIn() && user) {
        if (user.roleName === userType.superadmin) {
            return <Redirect from={path} to={`/admin/dashboard`} />;
        } else if (user.roleName === userType.schooladmin) {
            return <Redirect from={path} to={`/schooladmin/dashboard`} />;
        } else {
            return <Redirect from={path} to={`/home`} />;
        }
    } else return <Route path={path} component={Component} {...rest} />;
});
