import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import * as Unicons from '@iconscout/react-unicons';
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {MDBDataTableV5} from "mdbreact";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from "react-select";
import {Link} from "react-router-dom";
import Spinner from '../Front/Spinner';
import Folder from "../../assets/images/empty2.png";


class StudentCourses extends Component {
	state = {
		pageLoading: false,
		
		registerCourse: false,
		registerMultiple: false,
		activeSessionSemester: [],
		myCourses: [],
		multipleCourses: [],
	};
	
	openRegisterCourse = () => {
		this.setState({registerCourse: true})
	};
	
	toggleRegisterCourse = () => {
		this.setState({registerCourse: !this.state.registerCourse})
	};
	
	openRegisterMultiple = () => {
		this.setState({registerMultiple: true})
	};
	
	toggleRegisterMultiple = () => {
		this.setState({registerMultiple: !this.state.registerMultiple})
	};
	
	setRegisterCourseId = (e) => {
		if (e) {
			this.setState({registerCourseId: e.value});
		}
	};
	
	registerCourseExists = () => toast.error("This course has already been registered this semester", {
		style: {
			border: '1px solid #FFCC00',
			padding: '16px',
			background: '#FFCC00',
			color: '#000',
			borderRadius: '2rem',
		},
		iconTheme: {
			primary: '#000',
			secondary: '#FFCC00',
		},
	});
	
	registerCourseSuccess = () => toast.success("Course registered successfully", {
		style: {
			border: '1px solid #56b39d',
			padding: '16px',
			background: '#56b39d',
			color: '#fff',
			borderRadius: '2rem',
		},
		iconTheme: {
			primary: '#FFFAEE',
			secondary: '#56b39d',
		},
	});
	
	generalSuccess = (msg) => toast.success(msg, {
		style: {
			border: '1px solid #56b39d',
			padding: '16px',
			background: '#56b39d',
			color: '#fff',
			borderRadius: '2rem',
		},
		iconTheme: {
			primary: '#FFFAEE',
			secondary: '#56b39d',
		},
	});
	
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
	
	toggleAddMultipleCourse = (allocationId) => {
		let courses = this.state.multipleCourses;
		
		if (courses.find(o => o.courseAllocationId === allocationId)) {
			for (let i = 0; i < courses.length; i++) {
				if (allocationId === courses[i].courseAllocationId) {
					courses.splice(i,1);
					
					break;
				}
			}
			this.setState({multipleCourses: courses});
		}
		else {
			let obj = {"courseAllocationId": allocationId};
			courses.push(obj);
			this.setState({multipleCourses: courses});
		}
	};
	
	registerMultipleCourses = (e) => {
		e.preventDefault();
		
		if (!this.state.multipleCourses.length) {
			this.setState({error: true, errorMessage: "Please select at least one course"});
			
			setTimeout(() => {
				this.setState({error: false, errorMessage: ""});
			}, 3000);
		}
		
		let multipleProps = {
			personId: this.state.user.personId,
			courseAllocation: this.state.multipleCourses,
		};
		// console.log(multipleProps);
		
		this.setState({registerMultipleLoading: true});
		
		Endpoint.registerCoursesInBulk(multipleProps)
			.then((res) => {
				console.log(res.data);
				this.setState({registerMultipleLoading: false, registerMultiple: false});
				this.generalSuccess("Courses registered successfully");
				this.loadDataFromServer();
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({registerMultipleLoading: false});
			})
	};
	
	registerCourse = (e) => {
		e.preventDefault();
		
		if (!this.state.registerCourseId) {
			this.setState({registerCourseFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({registerCourseFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({
			registerCourseLoading: true, success: false, error: false
		});
		
		let RegisterProps = {
			sessionSemesterId: 1,
			courseAllocationId: this.state.registerCourseId,
			personId: this.state.user.personId
		};
		// console.log(RegisterProps);
		Endpoint.registerCourse(RegisterProps)
			.then((res) => {
				console.log(res.data);
				if (res.data.statusCode === 200) {
					this.setState({error: false, success: true, registerCourseLoading: false,
						registerCourse: false, registerCourseId: null});
					RegisterProps = {};
					
					this.registerCourseSuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else if (res.data.statusCode === 208) {
					this.registerCourseExists();
					this.setState({registerCourseLoading: false, registerCourseId: null});
					RegisterProps = {}
				}
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, registerCourseLoading: false});
			});
	};
	
	loadDataFromServer = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({pageLoading: true, user: user});
		
		Endpoint.getAllCourses()
			.then((res) => {
				let newCourseObj = [];
				for (let i=0; i<res.data.length; i++) {
					let entry = {value: res.data[i].id, label: res.data[i].courseTitle };
					newCourseObj.push(entry);
				}
				this.setState({allCourses: res.data, allCourseNames: newCourseObj, pageLoading: false})
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		Endpoint.getAllocatedCourses()
			.then((res) => {
				let newCourseObj = [];
				for (let i=0; i<res.data.length; i++) {
					let entry = {value: res.data[i].courseAllocationId, label: res.data[i].courseTitle };
					newCourseObj.push(entry);
				}
				this.setState({allocatedCourses: res.data, allocatedCourseNames: newCourseObj, pageLoading: false})
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
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
						this.setState({myCourses: res2.data})
					})
					.catch((error) => {
						this.loadDataError(error, this);
						this.setState({pageLoading: false});
					});
			})
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
					<div className="d-flex flex-wrap justify-content-between">
						<h1 className="text-primary">
							<Unicons.UilBookAlt size="24" className="mr-2"/>
							Courses
						</h1>
						
						<div>
							<button className="btn btn-outline-primary my-auto" onClick={this.openRegisterCourse}>
								<Unicons.UilCheckCircle size="24" className="mr-2"/>
								Register Single
							</button>
							
							<button className="btn btn-primary my-auto" onClick={this.openRegisterMultiple}>
								<Unicons.UilCopyAlt size="24" className="mr-2"/>
								Register Multiple
							</button>
						</div>
						
					</div>
					
					<hr/>
					
					<div className="row">
						{
							this.state.myCourses && this.state.myCourses.length > 0 ?
								this.state.myCourses.map((course, index) => {
									return(
										<div className="col-md-6 col-lg-4 col-xl-3 mb-4" key={index}>
											<div className="card bg-custom-light">
												<div className="card-body">
													<div className="d-flex align-items-center">
														<div className="profile-icon-sm">
															<Unicons.UilUserCircle size="30" className=""/>
														</div>
														
														<p className="mb-0 small">
															<span className="text-muted">Instructor: </span>
															<span className="font-weight-600">{course.courseLecturer}</span>
														</p>
													</div>
													
													<hr className="my-2"/>
													
													<Link to={{pathname:"/student/course", state:{data:course}}}>
														<p className="mb-1 small font-weight-700 text-primary">
															<span className="font-weight-300 text-muted">Course Code:</span> {course.courseCode}
														</p>
														<h4 className="text-primary">{course.courseTitle}</h4>
													</Link>
												</div>
											</div>
										</div>
									)
								})
								: 
								<div className='container'>
									 <div className='row'>
                    <div className="col-sm-12 text-center">
                      <h4>You haven't registered a course yet.</h4>

                      <img
                        src={Folder}
                        alt="empty folder"
                        className="mt-3"
                        height="100px"
                      />

                     
                    </div>
                  </div>
								</div>
						}
						
					</div>
				</div>
				
				
				<Modal isOpen={this.state.registerCourse} toggle={this.toggleRegisterCourse} className="mt-5 md">
					<form onSubmit={(e) => this.registerCourse(e)}>
						<ModalHeader toggle={this.toggleRegisterCourse}>
							<span className="h2">Register Course</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group row">
								<div className="col-md-12">
									<label className="mt-2 mr-2 ">
										<b>Select Course:</b>
									</label>
									
									<div className="">
										<Select
											className="basic-single"
											classNamePrefix="select"
											defaultValue={0}
											isDisabled={false}
											isLoading={false}
											isClearable={true}
											isRtl={false}
											isSearchable={true}
											name="Course"
											options={this.state.allocatedCourseNames}
											onChange={this.setRegisterCourseId }
										/>
									</div>
									
									<div className="mt-3">
										{this.state.registerCourseFormIncomplete ?
											<div
												className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
												<p className="small text-white mb-0">
													<Unicons.UilExclamationCircle size="20"/> Please select a course to register.
												</p>
											</div>
											: null
										}
										
										{this.state.error ?
											<div className="bg-danger border-rad-full text-center p-2 mb-3">
												<p className="small text-white mb-0">
													<Unicons.UilBell size="20"/> {this.state.errorMessage}
												</p>
											</div>
											: null
										}
									</div>
								
								</div>
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Register
								{
									this.state.registerCourseLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.registerCourseLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleRegisterCourse}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
			
				<Modal isOpen={this.state.registerMultiple} toggle={this.toggleRegisterMultiple} className="mt-5 md" size="lg">
					<form onSubmit={(e) => this.registerMultipleCourses(e)}>
						<ModalHeader toggle={this.toggleRegisterMultiple}>
							<span className="h2">Register Multiple Courses</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group row">
								<div className="col-md-12">
									<label className="mt-2 mr-2 ">
										<b>Select Courses:</b>
									</label>
									
									<div className="row">
										{
											this.state.allocatedCourses && this.state.allocatedCourses.length ?
												this.state.allocatedCourses.map((course, index) => {
													return (
														<div className="col-lg-6" key={index}>
															<div className="form-group">
																<input type="checkbox" value={course.courseAllocationId} className="mr-2"
																	   name="allocatedCourse" onChange={() => this.toggleAddMultipleCourse(course.courseAllocationId)}/>
																<label>{course.courseTitle}</label>
															</div>
														</div>
													)
												})
												:
												null
										}
										
									</div>
									
									<div className="mt-3">
										{this.state.error ?
											<div className="bg-danger border-rad-full text-center p-2 mb-3">
												<p className="small text-white mb-0">
													<Unicons.UilBell size="20"/> {this.state.errorMessage}
												</p>
											</div>
											: null
										}
									</div>
								
								</div>
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Register
								{
									this.state.registerMultipleLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.registerMultipleLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleRegisterMultiple}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
			
			</>
		
		)
	}
	
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentCourses);