import React, {Suspense} from 'react';
import Header from "./StudentHeader";
import {Route, Switch} from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../redux/actions";

import StudentDashboard from "../pages/Student/Dashboard";
import StudentCourses from "../pages/Student/Courses";
import StudentProfile from "../pages/Student/Profile";
import StudentCourse from "../pages/Student/Course";
import StudentCourseTopic from "../pages/Student/CourseTopic";
import StudentAssignment from "../pages/Student/Assignment";
import StudentAnnouncements from "../pages/Student/Announcements";
import StudentLiveLectures from "../pages/Student/LiveLectures"
import EmailNotification from "../pages/Student/EmailNotification"
import Quiz from "../pages/Student/Quiz"
import Payment from "../pages/Student/Payment"
import AssignmentReport from "../pages/Student/AssignmentReport"

const StudentBody = (props) => {
	return (
		<>
			<div className={props[stateKeys.PAGE_CLASS]}>
				<section className="sidenav-enabled pb-3 pb-md-4">
					<Header/>
					<ErrorBoundary>
						<Suspense fallback={<p>Loading...</p>}>
							<div className="main-content pt-md-5">
								<Switch>
									<Route path={'/student/dashboard'} component={StudentDashboard} exact={true}/>
									<Route path={'/student/courses'} component={StudentCourses} exact={true}/>
									<Route path={'/student/profile'} component={StudentProfile} exact={true}/>
									<Route path={'/student/course'} component={StudentCourse} exact={true}/>
									<Route path={'/student/coursetopic'} component={StudentCourseTopic} exact={true}/>
									<Route path={'/student/assignment'} component={StudentAssignment} exact={true}/>
									<Route path={'/student/announcements'} component={StudentAnnouncements} exact={true}/>
									<Route path={'/student/livelectures'} component={StudentLiveLectures} exact={true}/>
									<Route path={'/student/emailnotification'} component={EmailNotification} exact={true}/>
									<Route path={'/student/quiz'} component={Quiz} exact={true}/>
									<Route path={'/student/payment'} component={Payment} exact={true}/>
									<Route path={'/student/assignmentreport'} component={AssignmentReport} exact={true}/>
								</Switch>
							</div>
						</Suspense>
					</ErrorBoundary>
				</section>
			</div>
		</>
	)
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentBody);