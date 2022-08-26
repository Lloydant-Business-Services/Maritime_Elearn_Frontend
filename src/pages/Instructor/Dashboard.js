import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import Dash from "../../assets/images/dasnhin.gif"
import corso from "../../assets/images/corso.gif"
import studd from "../../assets/images/studd.gif"
import * as Unicons from '@iconscout/react-unicons';
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Link} from "react-router-dom";
import Spinner from '../Front/Spinner';


class InstructorDashboard extends Component {
	state = {
		pageLoading: false,
		institutionDetails: [],
		profile: [],
		announcements: [],
		myCourses: [],
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
		let firstName = user.fullName.substr(0, user.fullName.indexOf(' '));
		this.setState({pageLoading: true, user: user, firstName: firstName});
		
		Endpoint.getInstitutionDetails()
			.then((res) => {
				this.setState({institutionDetails: res.data, pageLoading: false})
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		Endpoint.getInstructorCourses(user.userId)
			.then((res3) => {
				let coursePreview = res3.data.slice(0,3);
				console.log(coursePreview);
				this.setState({pageLoading: false, myCourses: coursePreview,})
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		Endpoint.getUserProfile(user.userId)
			.then((res) => {
				this.setState({profile: res.data, pageLoading: false,});
				
				Endpoint.getAnnouncements(res.data.department.id)
					.then((res2) => {
						let newsPreview = res2.data.slice(0,3);
						console.log(newsPreview);
						this.setState({announcements: newsPreview});
					})
					.catch((error) => {
						this.loadDataError(error, this);
						this.setState({pageLoading: false, })
					});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, })
			});
		
	};

	setlocal = (course) =>{
        localStorage.setItem('courseAllocationId', course?.courseAllocationId)
		localStorage.setItem('courseId', course?.courseId)
	}
	
	componentDidMount() {
		this.loadDataFromServer();
	}
	
	render() {

		return (
			<>
				{this.state.pageLoading ?
					<Spinner message={"Just a moment"}/>
					: null
				}
				
				<Toaster
					position="top-center"
					reverseOrder={false}
				/>
				
				<div className="container-fluid py-5">
					<h1 className="mb-3 text-primary" style={{fontSize:"21px"}}>
						<Unicons.UilApps size="24" className="mr-2"/>
						Instructor Dashboard
					</h1>
					
					<div className="row">
						<div className="col-12 col-sm-6 col-xl-3">
							<div className="card illustration flex-fill">
								<div className="card-body p-0 d-flex flex-fill">
									<div className="row no-gutters w-100 align-items-center">
										<div className="col-6">
											<div className="illustration-text p-3 m-1">
												<h4 className=" my-auto">Welcome Back, {this.state.firstName}</h4>
											</div>
										</div>
										
										{/* <div className="col-6 align-self-end text-right">
											<img src={Dash} alt="" className="img-fluid illustration-img"/>
										</div> */}
									</div>
								</div>
							</div>
						</div>
						
						<div className="col-12 col-sm-6 col-xl-3 mt-2 mt-xl-0">
							<div className="card flex-fill">
								<div className="card-body p-3">
									<div className="media">
										<div className="media-body">
											{/* <h1>{this.state.institutionDetails.allDepartments}</h1> */}
											<h1>1</h1>
											<p className="mb-0">Courses</p>
										</div>
										
										<div className="ml-2">
											<div className="stat">
												{/* <Unicons.UilBuilding size="24"/> */}
												<img src={corso} style={{width:"50px"}}/>
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
											<h1>
												{/* {this.state.institutionDetails.allInstructors} */}
												0
												</h1>
											<p className="mb-0">Students</p>
										</div>
										
										<div className="ml-2">
											<div className="stat">
											<img src={studd} style={{width:"50px"}}/>

												{/* <Unicons.UilUserCheck size="24"/> */}
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
											{/* <h1>{this.state.institutionDetails.allStudents}</h1> */}
											<h1>0</h1>
											<p className="mb-0">Assignments</p>
										</div>
										
										<div className="ml-2">
											<div className="stat">
												<Unicons.UilBookReader size="24"/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div className="row mt-5">
						<div className="col-lg-7 col-xl-6">
							
							<div>
								<div className="d-flex flex-wrap justify-content-between">
									<h2 className="mb-1 mr-2">My Courses</h2>
									
									<Link to={{pathname:"/instructor/courses"}} className="mt-auto mb-2">
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
																<h4 className="mb-0">{course.courseCode} {course.courseTitle} </h4>
																<p className="mb-0 small">{course.registeredStudents} students</p>
															</div>
															
															<Link className="ml-auto" to={{pathname:"/instructor/course", state:{data:course }}}>
																<button onClick={() => {this.setlocal(course)}} 
																className="btn btn-sm btn-outline-primary ml-auto">Open Course</button>
															</Link>
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
						
						
						<div className="col-lg-5 col-xl-6">
							<div>
								
								<div className="d-flex flex-wrap justify-content-between mt-4 mt-lg-0">
									<h2 className="mb-1 mr-2">Announcements</h2>
									
									<Link to={{pathname:"/instructor/announcements"}} className="mt-auto mb-2">
										<p className="mb-0 mt-auto cursor-pointer text-sm font-weight-500">All Announcements <Unicons.UilAngleRight/></p>
									</Link>
								</div>
								
								<div className="card bg-lightest mb-4">
									<div className="card-body-sm">
										
										{
											this.state.announcements && this.state.announcements.length > 0 ?
												this.state.announcements.map((announcement, index) => {
													return (
														<div className="card mb-2 shadow-none bg-lightest" key={index}>
															<div className="">
																<div className="d-flex align-items-center">
																	<div className="flex-shrink-0">
																		<div className="w-100 h-100 icon-bg">
																			<Unicons.UilNewspaper size="35"/>
																		</div>
																	</div>
																	
																	<div className="flex-grow-1 ml-3">
																		<p className="mb-0 font-weight-600">
																			<Link to={{pathname:"/instructor/announcements"}}>
																				{announcement.title}
																			</Link>
																			<br/>
																			<span className="text-sm text-muted mt-auto font-weight-300">
																				Office of the {announcement.sender}
																			</span>
																		</p>
																	</div>
																</div>
															</div>
														</div>
													
													)
												})
												:
												<p className="text-center font-weight-600">No announcements yet</p>
										}
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

export default connect(mapStateToProps, mapDispatchToProps)(InstructorDashboard);