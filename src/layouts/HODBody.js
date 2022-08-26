import React, {Suspense} from 'react';
import Header from "./HODHeader";
import {Route, Switch} from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../redux/actions";

import HODDashboard from "../pages/HOD/Dashboard";
import HODInstructors from "../pages/HOD/Instructors";
import ManageInstructors from "../pages/HOD/manage_instructors";
import HODCourses from "../pages/HOD/Courses";
import HODAnnouncements from "../pages/HOD/Announcements";
import HODProfile from "../pages/HOD/Profile";
import EmailNotification from "../pages/HOD/EmailNotification";

const HODBody = (props) => {
	return (
		<>
			<div className={props[stateKeys.PAGE_CLASS]}>
				<section className="sidenav-enabled pb-3 pb-md-4">
					<Header/>
					<ErrorBoundary>
						<Suspense fallback={<p>Loading...</p>}>
							<div className="main-content pt-md-5">
								<Switch>
									<Route path={'/hod/dashboard'} component={HODDashboard} exact={true}/>
									<Route path={'/hod/instructors'} component={HODInstructors} exact={true}/>
									<Route path={'/hod/courses'} component={HODCourses} exact={true}/>
									<Route path={'/hod/announcements'} component={HODAnnouncements} exact={true}/>
									<Route path={'/hod/profile'} component={HODProfile} exact={true}/>
									<Route path={'/hod/manage_instructor'} component={ManageInstructors} exact={true}/>
									<Route path={'/hod/emailnotification'} component={EmailNotification} exact={true}/>
								</Switch>
							</div>
						</Suspense>
					</ErrorBoundary>
				</section>
			</div>
		</>
	)
};

export default connect(mapStateToProps, mapDispatchToProps)(HODBody);