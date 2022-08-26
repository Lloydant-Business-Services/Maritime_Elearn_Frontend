import React, {Suspense} from 'react';
import Header from "./InstructorHeader";
import {Route, Switch} from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../redux/actions";

import InstructorDashboard from "../pages/Instructor/Dashboard";
import InstructorCourses from "../pages/Instructor/Courses";
import InstructorProfile from "../pages/Instructor/Profile";
import InstructorCourse from "../pages/Instructor/Course";
import InstructorCourseTopic from "../pages/Instructor/CourseTopic";
import InstructorAssignment from "../pages/Instructor/Assignment";
import InstructorAssignmentSubmission from "../pages/Instructor/AssignmentSubmission";
import InstructorAnnouncements from "../pages/Instructor/Announcements";
import InstructorLiveLectures from "../pages/Instructor/LiveLectures";
import EmailNotification from "../pages/Instructor/EmailNotification";
import Quiz from "../pages/Instructor/Quiz";
import QuizSubmission from "../pages/Instructor/QuizSubmission";

const InstructorBody = (props) => {
	return (
		<>
			<div className={props[stateKeys.PAGE_CLASS]}>
				<section className="sidenav-enabled pb-3 pb-md-4">
					<Header/>
					<ErrorBoundary>
						<Suspense fallback={<p>Loading...</p>}>
							<div className="main-content pt-md-5">
								<Switch>
									<Route path={'/instructor/dashboard'} component={InstructorDashboard} exact={true}/>
									<Route path={'/instructor/courses'} component={InstructorCourses} exact={true}/>
									<Route path={'/instructor/profile'} component={InstructorProfile} exact={true}/>
									<Route path={'/instructor/course'} component={InstructorCourse} exact={true}/>
									<Route path={'/instructor/coursetopic'} component={InstructorCourseTopic} exact={true}/>
									<Route path={'/instructor/assignment'} component={InstructorAssignment} exact={true}/>
									<Route path={'/instructor/assignmentsubmission'} component={InstructorAssignmentSubmission} exact={true}/>
									<Route path={'/instructor/announcements'} component={InstructorAnnouncements} exact={true}/>
									<Route path={'/instructor/livelectures'} component={InstructorLiveLectures} exact={true}/>
									<Route path={'/instructor/emailnotification'} component={EmailNotification} exact={true}/>
									<Route path={'/instructor/quiz'} component={Quiz} exact={true}/>
									<Route path={'/instructor/quizsubmission'} component={QuizSubmission} exact={true}/>
								</Switch>
							</div>
						</Suspense>
					</ErrorBoundary>
				</section>
			</div>
		</>
	)
};

export default connect(mapStateToProps, mapDispatchToProps)(InstructorBody);