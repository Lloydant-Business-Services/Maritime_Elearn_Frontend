import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import * as Unicons from '@iconscout/react-unicons';
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Link} from "react-router-dom";
import Spinner from "../Front/Spinner"


class HODDashboard extends Component {
	state = {
		pageLoading: false,
		departmentDetails: [],
		departmentMaterials: [],
		departmentCourses: [],
		profile: [],
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
		this.setState({pageLoading: true});
		
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({user: user});
		
		Endpoint.getUserProfile(user.userId)
			.then((res) => {
				this.setState({
					profile: res.data,
				});
				localStorage.setItem("ELearnUserProfilre", JSON.stringify(res.data))
				// this.setState({pageLoading: false,});
				console.log(res.data);
				
				Endpoint.getDepartmentDetails(res.data.department.id)
					.then((res2) => {
						this.setState({departmentDetails: res2.data, pageLoading: false})
					})
					.catch((error) => {
						this.loadDataError(error, this);
						this.setState({pageLoading: false});
					});
				
				Endpoint.getCourseMaterialsByDepartment(res.data.department.id)
					.then((res3) => {
						let materialPreview = res3.data.slice(0,4);
						this.setState({departmentMaterials: materialPreview, pageLoading: false})
					})
					.catch((error) => {
						this.loadDataError(error, this);
						this.setState({pageLoading: false});
					});
				
				Endpoint.getCoursesByDepartment(res.data.department.id)
					.then((res4) => {
						console.log(res4.data);
						let coursePreview = res4.data.slice(0,4);
						this.setState({departmentCourses: coursePreview, pageLoading: false});
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
					<h1 className="mb-3 text-primary">
						<Unicons.UilApps size="24" className="mr-2"/>
						Dashboard
					</h1>
					
					<div className="row mb-3">
						<div className="col-xl-8">
							<div className="card illustration flex-fill">
								<div className="card-body p-0 d-flex flex-fill">
									<div className="row no-gutters w-100 align-items-center">
										<div className="col-12 col-lg-3 align-self-end text-center">
											<img src={illustration} alt="" className="dash-welcome-img illustration-img mr-3"/>
										</div>
										<div className="col-12 col-lg-9">
											<div className="illustration-text p-3 m-1">
												<h4 className="illustration-text text-center" style={{fontSize:'16px'}}>Welcome Back!
												
												</h4>
												
												{this.state.profile?.department != null ? <h3 className='text-center' style={{fontSize:'23px'}}><b>Logged in as HOD {this.state.profile?.department?.name}</b></h3> : null}
											</div>
										</div>
									
									</div>
								</div>
							</div>
							
							<div className="row mt-lg-4 ">
								<div className="col-12 col-sm-6 col-xl-4 mt-4 mt-xl-0">
									<Link to={{pathname:"/hod/courses"}}>
										<div className="card flex-fill">
											<div className="card-body p-3">
												<div className="media">
													<div className="media-body">
														<h1>{this.state.departmentDetails.allDepartmentCourses}</h1>
														<p className="mb-0">Courses</p>
													</div>
													
													<div className="ml-2">
														<div className="stat">
															<Unicons.UilBuilding size="24"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</Link>
								</div>
								
								<div className="col-12 col-sm-6 col-xl-4 mt-4 mt-xl-0">
									<Link to={{pathname:"/hod/students"}}>
										<div className="card flex-fill">
											<div className="card-body p-3">
												<div className="media">
													<div className="media-body">
														<h1>{this.state.departmentDetails.allDepartmentStudents}</h1>
														<p className="mb-0">Students</p>
													</div>
													
													<div className="ml-2">
														<div className="stat">
															<Unicons.UilUserCheck size="24"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</Link>
								</div>
								
								<div className="col-12 col-sm-6 col-xl-4 mt-4 mt-xl-0">
									<Link to={{pathname:"/hod/instructors"}}>
										<div className="card flex-fill">
											<div className="card-body p-3">
												<div className="media">
													<div className="media-body">
														<h1>{this.state.departmentDetails.allDepartmentInstructors}</h1>
														<p className="mb-0">Instructors</p>
													</div>
													
													<div className="ml-2">
														<div className="stat">
															<Unicons.UilBookReader size="24"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</Link>
								</div>
							</div>
							
							{/*<div className="d-flex flex-wrap justify-content-between mt-5">*/}
							{/*	<h3 className="mb-1">Course Materials</h3>*/}
							{/*	*/}
							{/*	<p className="mb-0 my-auto cursor-pointer text-sm font-weight-500 mt-sm-2">View All <Unicons.UilAngleRight/></p>*/}
							{/*</div>*/}
							
							{/*<div className="table-responsive">*/}
							{/*	<table className="table table-striped">*/}
							{/*		<thead>*/}
							{/*		<tr>*/}
							{/*			<th>Course Title</th>*/}
							{/*			<th>Course Instructor</th>*/}
							{/*			<th>Students</th>*/}
							{/*			<th>Material Name</th>*/}
							{/*		</tr>*/}
							{/*		</thead>*/}
							{/*		<tbody>*/}
							{/*		*/}
							{/*		{*/}
							{/*			this.state.departmentMaterials && this.state.departmentMaterials.length > 0 ?*/}
							{/*				this.state.departmentMaterials.map((material, index) => {*/}
							{/*					return (*/}
							{/*						<tr key={index}>*/}
							{/*							<td>*/}
							{/*								<h4 className="mb-0">PHI101 - Introduction to Philosophy <Unicons.UilExternalLinkAlt size="16"/></h4>*/}
							{/*							</td>*/}
							{/*							<td><span className="my-auto d-inline-block">Okeke Miracle</span></td>*/}
							{/*							<td>23 students</td>*/}
							{/*							<td>Plato's Principles 1 [PDF]</td>*/}
							{/*						</tr>*/}
							{/*					)*/}
							{/*				})*/}
							{/*				:*/}
							{/*				<tr>*/}
							{/*					<td colSpan="4"> <p className="text-center">No materials yet.</p> </td>*/}
							{/*				</tr>*/}
							{/*		}*/}
							{/*		</tbody>*/}
							{/*	</table>*/}
							{/*</div>*/}
						</div>
						
						<div className="col-xl-4 mt-5 mt-lg-3">
							<div className="d-flex flex-wrap justify-content-between">
								<h3 className="mb-1">Ongoing Live Lectures</h3>
								
								<Link to={{pathname:"/hod/courses"}}>
									<p className="mb-0 my-auto cursor-pointer text-sm font-weight-500 mt-sm-2">View All <Unicons.UilAngleRight/></p>
								</Link>
							</div>
							
							<div className="card bg-custom-light mb-4">
								<div className="card-body">
									
									{
										this.state.departmentCourses && this.state.departmentCourses.lengthv < 0 ?
											this.state.departmentCourses.map((course, index) => {
												return (
													<div className="card bg-white mb-3" key={index}>
														<div className="px-3 py-3">
															<div className="d-flex align-items-center">
																<div className="mr-2 courses-icon" style={{}}>
																	{/* <h3 className="courses-icon-text">{course.courseTitle.charAt(0)}</h3> */}
																	<i className='fa fa-circle' style={{color:'green'}}/>
																</div>
																
																<div className="mr-2">
																	<h4 className="mb-0">{course.courseCode} - {course.courseTitle}</h4>
																	<p className="mb-0 small">{course.courseLecturer}</p>
																</div>
															</div>
														</div>
													</div>
												)
											})
											:
											<div className="card bg-white mb-3">
												<div className="px-3 py-3">
													<div>
														<p className="text-center mb-0">No courses yet.</p>
													</div>
												</div>
											</div>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		
		)
	}
	
}

export default connect(mapStateToProps, mapDispatchToProps)(HODDashboard);