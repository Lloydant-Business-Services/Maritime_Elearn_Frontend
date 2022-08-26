import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import * as Unicons from '@iconscout/react-unicons';
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Line} from 'react-chartjs-2';
import {Link} from "react-router-dom";
import moment from "moment";
import Spinner from '../Front/Spinner';


class StudentDashboard extends Component {
	state = {
		pageLoading: false,
		institutionDetails: [],
		studentStats: [],
		myCourses: [],
		myAssignments: [],
		
		chartData: {
			labels: [
				"April",
				"May",
				"June",
				"July",
				"August",
			],
			datasets: [
				{
					label: "Courses Registered",
					backgroundColor: 'rgba(209,221,233, .6)',
					borderColor: "#6F78E3",
					data: [1, 1, 2, 3, 0,],
					fill: true,
				}
			]
		},
		
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
	
	loadDataFromServer = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		if (user.fullName) {
			let firstName = user.fullName.substr(0, user.fullName.indexOf(' '));
			this.setState({pageLoading: true, user: user, firstName: firstName});
		console.log(firstName, "Firstname")

		}
		
		// Endpoint.getInstitutionDetails()
		// 	.then((res) => {
		// 		this.setState({institutionDetails: res.data, pageLoading: false})
		// 	})
		// 	.catch((error) => {
		// 		this.loadDataError(error, this);
		// 		this.setState({pageLoading: false});
		// 	});
		
		Endpoint.getStudentStats(user.personId)
			.then((res) => {
				this.setState({studentStats: res.data, pageLoading: false});
			})
			.catch((error) => {
			this.loadDataError(error, this);
			this.setState({pageLoading: false});
		});
		
		Endpoint.getActiveSessionSemester()
			.then((res) => {
				this.setState({activeSessionSemester: res.data});
				
				let regProps = {
					personId: user.personId,
					sessionSemesterId: res.data.id
				};
				
				Endpoint.getRegisteredCourses(regProps)
					.then((res2) => {
						let coursePreview = res2.data.slice(0,3);
						this.setState({myCourses: coursePreview})
					})
					.catch((error) => {
						this.loadDataError(error, this);
						this.setState({pageLoading: false});
					});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		Endpoint.getStudentAssignments(user.userId)
			.then((res) => {
				let assignmentPreview = res.data.slice(0,3);
				this.setState({myAssignments: assignmentPreview, pageLoading: false})
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
	};
	
	componentDidMount() {
		this.loadDataFromServer();
	}
	
	render() {
		return (
			<>
				{this.state.pageLoading ?
					<Spinner
						message={"Just a moment"}
					/>
					: null
				}
				
				<Toaster
					position="top-center"
					reverseOrder={false}
				/>
				
				<div className="container-fluid py-5">
					<h1 className="mb-3 text-primary" style={{fontSize:"21px"}}>
						<Unicons.UilApps size="24" className="mr-2"/>
						Dashboard
					</h1>
					
					<div className="row mb-5">
						<div className="col-12 col-sm-6 col-xl-3">
							<div className="card illustration flex-fill">
								<div className="card-body p-0 d-flex flex-fill">
									<div className="row no-gutters w-100 align-items-center">
										<div className="col-6">
											<div className=" p-3 m-1">
												<h4 className=" my-auto">Welcome Back, {this.state.firstName}</h4>
											</div>
										</div>
										
										<div className="col-6 align-self-end text-right">
											<img src={illustration} alt="" className="img-fluid illustration-img"/>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div className="col-12 col-sm-6 col-xl-3 mt-2 mt-xl-0">
							<div className="card flex-fill">
								<div className="card-body p-3">
									<div className="media">
										<div className="media-body">
											<h1>{this.state.studentStats.coursesRegistered}</h1>
											<p className="mb-0">Courses</p>
										</div>
										
										<div className="ml-2">
											<div className="stat">
												<Unicons.UilBookOpen size="24"/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div className="col-12 col-sm-6 col-xl-3 mt-4 mt-xl-0">
							<div className="card flex-fill">
								<div className="card-body p-3">
									<div className="media">
										<div className="media-body">
											<h1>{this.state.studentStats.assignmentsAttempted}<span className="h4">/{this.state.studentStats.totalAssignmentsAvailable}</span></h1>
											<p className="mb-0">Assignments</p>
										</div>
										
										<div className="ml-2">
											<div className="stat">
												<Unicons.UilPen size="24"/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div className="col-12 col-sm-6 col-xl-3 mt-4 mt-xl-0">
							<div className="card flex-fill">
								<div className="card-body p-3">
									<div className="media">
										<div className="media-body">
											<h1>0<span className="h4">/0</span></h1>
											<p className="mb-0">Quiz</p>
										</div>
										
										<div className="ml-2">
											<div className="stat">
												<Unicons.UilFileEditAlt size="24"/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div className="row">
						<div className="col-lg-7 mb-5">
							<div className="mr-3">
								{/*<div className="d-flex flex-wrap justify-content-between">*/}
								{/*	<h2 className="mb-1">Course Activity</h2>*/}
								{/*</div>*/}
								
								{/*<div className="card bg-lightest mb-5">*/}
								{/*	<div className="card-body">*/}
								{/*		<div className="w-100" style={{height: '250px'}}>*/}
								{/*			*/}
								{/*			<Line*/}
								{/*				data={this.state.chartData}*/}
								{/*				options={{*/}
								{/*					title:{*/}
								{/*						display:false,*/}
								{/*					},*/}
								{/*					legend:{*/}
								{/*					},*/}
								{/*					maintainAspectRatio:false,*/}
								{/*					scales: {*/}
								{/*						// xAxes: [{*/}
								{/*						// 	gridLines: {*/}
								{/*						// 		display:false*/}
								{/*						// 	}*/}
								{/*						// }],*/}
								{/*						yAxes: [{*/}
								{/*							gridLines: {*/}
								{/*								display:false*/}
								{/*							}*/}
								{/*						}]*/}
								{/*					}*/}
								{/*				}}*/}
								{/*			/>*/}
								{/*		</div>*/}
								{/*	</div>*/}
								{/*</div>*/}
								
								
								<div className="mr-3">
									<div className="d-flex flex-wrap justify-content-between">
										<h2 className="mb-1">My Courses</h2>
										
										<Link className="ml-auto" to={{pathname:"/student/courses"}} >
											<p className="mb-0 my-auto cursor-pointer text-sm font-weight-500">All Courses <Unicons.UilAngleRight/></p>
										</Link>
									</div>
									
									
									{
										this.state.myCourses && this.state.myCourses.length ?
											this.state.myCourses.map((course, index) => {
												return (
													<div className="card mb-3 bg-lightest" key={index}>
														<div className="px-3 py-3">
															<div className="d-flex align-items-center">
																<div className="bg-primary mr-2 courses-icon" style={{}}>
																	<h3 className="courses-icon-text">{course.courseTitle.charAt(0)}</h3>
																</div>
																
																<div className="mr-2">
																	<Link className="ml-auto" to={{pathname:"/student/course", state:{data:course}}} >
																		<h4 className="mb-0">{course.courseCode} {course.courseTitle} </h4>
																	</Link>
																	<p className="mb-0 small">{course.courseLecturer}</p>
																</div>
																
															</div>
														</div>
													</div>
												)
											})
											:
											<div className="card mb-3 bg-lightest">
												<p className="text-center font-weight-600 my-3">No courses yet</p>
											</div>
									}
									
								</div>
								
							</div>
						</div>
						
						<div className="col-lg-5">
							{/*<div>*/}
							{/*	<h2 className="mb-1">Announcements</h2>*/}
							{/*	*/}
							{/*	<div className="card bg-lightest mb-4">*/}
							{/*		<div className="card-body">*/}
							{/*			<div className="card mb-3 shadow-none bg-lightest">*/}
							{/*				<div className="">*/}
							{/*					<div className="d-flex align-items-center">*/}
							{/*						<div className="flex-shrink-0">*/}
							{/*							<div className="w-100 h-100 icon-bg">*/}
							{/*								<Unicons.UilNewspaper size="35"/>*/}
							{/*							</div>*/}
							{/*						</div>*/}
							{/*						*/}
							{/*						<div className="flex-grow-1 ml-3">*/}
							{/*							<p className="mb-0 font-weight-600">*/}
							{/*								Exams starting date fixed.*/}
							{/*								<br/>*/}
							{/*								<span className="text-sm text-muted mt-auto font-weight-300">*/}
							{/*							Office of the School Administration*/}
							{/*						</span>*/}
							{/*							</p>*/}
							{/*						</div>*/}
							{/*					</div>*/}
							{/*				</div>*/}
							{/*			</div>*/}
							{/*			*/}
							{/*			<div className="card mb-3 shadow-none bg-lightest">*/}
							{/*				<div className="">*/}
							{/*					<div className="d-flex align-items-center">*/}
							{/*						<div className="flex-shrink-0">*/}
							{/*							<div className="w-100 h-100 icon-bg">*/}
							{/*								<Unicons.UilNewspaper size="32" />*/}
							{/*							</div>*/}
							{/*						</div>*/}
							{/*						*/}
							{/*						<div className="flex-grow-1 ml-3">*/}
							{/*							<p className="mb-0 font-weight-600">*/}
							{/*								Course Registration Deadline...*/}
							{/*								<br/>*/}
							{/*								<span className="text-sm text-muted mt-auto font-weight-300">*/}
							{/*							Office of the School Administration*/}
							{/*						</span>*/}
							{/*							</p>*/}
							{/*						</div>*/}
							{/*					</div>*/}
							{/*				</div>*/}
							{/*			</div>*/}
							{/*			*/}
							{/*			<div className="card shadow-none bg-lightest">*/}
							{/*				<div className="">*/}
							{/*					<div className="d-flex align-items-center">*/}
							{/*						<div className="flex-shrink-0">*/}
							{/*							<div className="w-100 h-100 icon-bg">*/}
							{/*								<Unicons.UilNewspaper size="32" />*/}
							{/*							</div>*/}
							{/*						</div>*/}
							{/*						*/}
							{/*						<div className="flex-grow-1 ml-3">*/}
							{/*							<p className="mb-0 font-weight-600">*/}
							{/*								General Studies Course Registration...*/}
							{/*								<br/>*/}
							{/*								<span className="text-sm text-muted mt-auto font-weight-300">*/}
							{/*							HOD, General Studies Department*/}
							{/*						</span>*/}
							{/*							</p>*/}
							{/*						</div>*/}
							{/*					</div>*/}
							{/*				</div>*/}
							{/*			</div>*/}
							{/*		</div>*/}
							{/*	</div>*/}
							{/*</div>*/}
							
							<div>
								<h2 className="mb-1">Assignment Schedule</h2>
								
								{
									this.state.myAssignments && this.state.myAssignments.length > 0 ?
										this.state.myAssignments.map((assignment, index) => {
											return (
												<div className={`card mb-3
												${index===0 ? "bg-info-light" : ""}
												${index===1 ? "bg-primary-light" : ""}
												${index===2 ? "bg-yellow-light" : ""}
												`} key={index}>
													<div className="px-3 py-3">
														<div className={`d-flex align-items-center pr-3
														${index===0 ? "bord-l-info" : ""}
														${index===1 ? "bord-l-primary" : ""}
														${index===2 ? "bord-l-yellow" : ""}
														`}>
															<div className="flex-grow-1 ml-3">
																<Link to={{pathname:"/student/assignment", state:{data:assignment}}}>
																	<p className="mb-1 font-weight-600">
																		{assignment.assignmentName}
																		<span className="font-weight-300 text-sm ml-1 mb-1">[{assignment.courseCode}]</span>
																	</p>
																</Link>
																
																<p className="text-sm mt-auto mb-0 font-weight-300">
																	Deadline: <span className="text-danger">{moment(assignment.dueDate).format('lll')}</span>
																</p>
															</div>
														</div>
													</div>
												</div>
											)
										})
										:
										<div className="card mb-3 bg-info-light">
											<div className="px-3 py-3">
												<p className="text-center mb-0">No assignments yet.</p>
											</div>
										</div>
								}
								
							</div>
						</div>
					</div>
				</div>
			</>
		
		)
	}
	
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDashboard);