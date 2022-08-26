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


class InstructorCourses extends Component {
	state = {
		pageLoading: false,
		
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
		this.setState({pageLoading: true, user: user});
		
		Endpoint.getInstructorCourses(user.userId)
			.then((res) => {
				let newCourses = this.state.myCourses.concat(res.data);
				this.setState({pageLoading: false, myCourses: newCourses,})
				console.log(newCourses);
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		Endpoint.getSubInstructorCourses(user.userId)
			.then((res) => {
				let newCourses = this.state.myCourses.concat(res.data);
				this.setState({myCourses: newCourses});
				console.log(newCourses);
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			})
	};
	
	componentDidMount() {
		this.loadDataFromServer()
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
						<Unicons.UilBook size="24" className="mr-2"/>
						Courses
					</h1>
					
					<hr/>
					
					
					<div className="row">
						{
							this.state.myCourses && this.state.myCourses.length > 0 ?
								this.state.myCourses.map((course, index) => {
									return(
										<div className="col-md-6 col-lg-4 col-xl-3 mb-4" key={index}>
											<Link to={{pathname:"/instructor/course",
												state:{data:course}}}>
												<div className="card bg-custom-light">
													<div className="card-body">
														<p className="mb-1 small font-weight-700"><span className="font-weight-300 text-muted">Course Code:</span> {course.courseCode}</p>
														<h4>{course.courseTitle ? course.courseTitle : course.courseName}</h4>
														
														<hr className="my-2"/>
														
														<div className="d-flex align-items-center">
															<div className="profile-icon-sm">
																<Unicons.UilBookReader size="30" className=""/>
															</div>
															
															<p className="mb-0 small">
																<span className="text-muted">Students: </span>
																<span className="font-weight-600">{course.registeredStudents}</span>
															</p>
														</div>
													
													</div>
												</div>
											</Link>
										</div>
									)
								})
								:
								<div className="col-12">
									<p className="text-center font-weight-600">No Courses have been assigned to you yet.</p>
								</div>
						}
					</div>
				</div>
			
			</>
		)
	}
}

export default InstructorCourses