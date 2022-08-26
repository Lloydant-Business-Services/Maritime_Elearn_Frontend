import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import * as Unicons from '@iconscout/react-unicons';
import {Modal, ModalBody, ModalFooter, ModalHeader, Button} from "reactstrap";
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Link} from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import Spinner from "../Front/Spinner"

class StudentLiveLectures extends Component {
	state = {
		pageLoading: false,
		myCourses: [],
		thisCourseLectures: [],
		
		courseLecturesModal: false,
		currentCourseLectures: [],
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
	
	handleCourseLectures = (course) => {
		this.setState({pageLoading: true, currentCourse: course, courseLecturesModal: true});
		console.log(course);
		
		Endpoint.getCourseMeetings(course.courseId)
			.then((res) => {
				console.log(res.data);
				this.setState({thisCourseLectures: res.data, pageLoading: false})
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		// for(let i=0; i<this.state.myCourses.length; i++) {
		// 	if (course.courseId === this.state.myCourses[i].courseId) {
		// 		this.state.currentCourse = this.state.myCourses[i];
		// 		break;
		// 	}
		// }
	};
	
	loadDataFromServer = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({pageLoading: true, user: user});
		
		Endpoint.getActiveSessionSemester()
			.then((res) => {
				// console.log(res.data);
				this.setState({activeSessionSemester: res.data});
				
				let regProps = {
					personId: user.personId,
					sessionSemesterId: res.data.id
				};
				
				// console.log(regProps);
				Endpoint.getRegisteredCourses(regProps)
					.then((res2) => {
						console.log(res2.data);
						this.setState({myCourses: res2.data, pageLoading: false})
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
					<div className="d-flex flex-wrap justify-content-between">
						<h1 className="mb-0 text-primary">
							<Unicons.UilPresentationLinesAlt size="24" className="mr-1"/>
							My Live Lectures
						</h1>
						
					</div>
					
					<hr className="my-3"/>
					
					<div className="table-responsive">
						<table className="table table-hover table-striped">
							<thead>
							<tr>
								<th>S/No</th>
								<th>Course Code</th>
								<th>Course Title</th>
								<th>Instructor</th>
								<th>Actions</th>
							</tr>
							</thead>
							
							<tbody>
							{
								this.state.myCourses ?
									this.state.myCourses.map((course, index) => {
										return (
											<tr key={course.courseId}>
												<td> {index+1} </td>
												<td> {course.courseCode} </td>
												<td> {course.courseTitle} </td>
												<td>{course.courseLecturer}</td>
												<td>
													<button className="btn btn-sm btn-outline-primary"
															onClick={() => this.handleCourseLectures(course)}>
														View Course Lectures
													</button>
												</td>
											</tr>
										)
									})
									: null
							}
							</tbody>
						</table>
					</div>
				
				</div>
				
				<Modal size="lg" isOpen={this.state.courseLecturesModal} className="mdal">
					<ModalHeader className="border-bottom">
						{
							this.state.currentCourse ?
								<h3 className="mb-0"> {this.state.currentCourse.courseCode} Live Lectures</h3>
								:
								<h3 className="mb-0"> No Course Selected </h3>
						}
					</ModalHeader>
					
					<ModalBody>
						<div className="table-responsive">
							<table className="table table-hover table-striped">
								<thead>
								<tr>
									<th>S/No</th>
									<th>Topic</th>
									<th>Start Time</th>
									{/* <th>Duration</th> */}
									<th>Join Url</th>
								</tr>
								</thead>
								
								<tbody>
								{
									this.state.thisCourseLectures ?
										this.state.thisCourseLectures.map((lecture, index) => {
											return (
												<tr key={lecture.id}>
													<td>{index+1}</td>
													<td>{lecture.topic}</td>
													<td>{moment(lecture.date).format("lll")}</td>
													{/* <td>{lecture.duration} minutes</td> */}
													<td>
														<a href={lecture.join_Meeting_Url} target="_blank" className="btn btn-sm btn-outline-primary">Join Lecture</a>
														{lecture.time == 777 ? <span className='badge badge-danger badge-sm'>Pre-recorded</span> : null}
													</td>
												</tr>
											)
										})
										:
										<p className="text-center">No available Lectures.</p>
								}
								</tbody>
							</table>
						</div>
					</ModalBody>
					
					<ModalFooter className="border-top">
						
						<Button className="ok-btn" color={"danger"} onClick={()=>this.setState({courseLecturesModal: false})} >
							Close
						</Button>
					</ModalFooter>
				</Modal>
			
			</>
		)
	}
	
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentLiveLectures);
