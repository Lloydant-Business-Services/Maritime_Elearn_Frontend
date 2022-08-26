import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import * as Unicons from '@iconscout/react-unicons';
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {fas} from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import {MDBDataTableV5} from "mdbreact";
import ReactTooltip from 'react-tooltip';
import moment from "../Student/LiveLectures";
import Spinner from "../Front/Spinner"


class HODCourses extends Component {
	state = {
		pageLoading: false,
		
		allCourses: [],
		newCourse: false,
		newCourseFormIncomplete: false,
		newCourseCode: '',
		newCourseTitle: '',
		
		assignCourse: false,
		assignCourseFormIncomplete: false,
		
		allLevels: [],
		
		newSubInstructor: false,
		getSubInstructor: false,
		currentCourse: [],
		newSubInstructorCourse: [],
		currentCourseSubInstructors: [],
		
		subInstructorsLoading: false,
		profileProps: JSON.parse(localStorage.getItem('ELearnUserProfilre'))
	};
	
	assignCourseSuccess = () => toast.success("Course allocated successfully", {
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
	
	addSubInstructorSuccess = () => toast.success("Sub Instructor added successfully", {
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
	
	removeSubInstructorSuccess = () => toast.success("Sub Instructor removed successfully", {
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
	
	newCourseSuccess = () => toast.success("Course created successfully", {
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
	
	assignCourseExists = () => toast.error("Course already assigned for current semester", {
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
	
	addSubInstructorExists = () => toast.error("The Sub Instructor has already been added to this course", {
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
	
	toggleNewCourse = () => {
		this.setState({newCourse: !this.state.newCourse})
	};
	
	openNewCourse = () => {
		this.setState({newCourse: true})
	};
	
	openNewSubInstructor = (course) => {
		this.setState({newSubInstructor: true, newSubInstructorCourse: course, newSubInstructorCourseId: course.courseAllocationId});
	};
	
	openGetSubInstructors = (course) => {
		this.setState({getSubInstructor: true, currentCourse: course, subInstructorsLoading: true});
		Endpoint.getCourseSubInstructors(course.courseId)
			.then((res) => {
				console.log(res.data);
				this.setState({currentCourseSubInstructors: res.data, subInstructorsLoading: false});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, subInstructorsLoading: false});
			});
	};
	
	toggleGetSubInstructor = () => {
		this.setState({getSubInstructor: !this.state.getSubInstructor});
	};
	
	toggleAssignCourse = () => {
		this.setState({assignCourse: !this.state.assignCourse})
	};
	
	openAssignCourse = () => {
		this.setState({assignCourse: true})
	};
	
	setAssignCourseId = (e) => {
		if (e) {
			this.setState({assignCourseId: e.value});
		}
	};
	
	setAssignInstructorId = (e) => {
		if (e) {
			this.setState({assignInstructorId: e.value});
		}
	};
	
	setAddSubInstructorId = (e) => {
		if (e) {
			this.setState({addSubInstructorId: e.value});
		}
	};
	
	createCourse = (e) => {
		e.preventDefault();
		
		if (!this.state.newCourseCode || !this.state.newCourseTitle) {
			this.setState({newCourseFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newCourseFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({
			newCourseLoading: true, success: false, error: false
		});
		
		const courseProps = {
			courseCode: this.state.newCourseCode,
			courseTitle: this.state.newCourseTitle,
			userId: this.state.user.userId,
			levelId: 1,
		};
		
		Endpoint.createCourse(courseProps)
			.then((res) => {
				console.log(res.data);
				this.setState({error: false, success: true, newCourseLoading: false, newCourse: false, newCourseTitle: '', newCourseCode: ''});
				
				this.newCourseSuccess();
				
				setTimeout(() => {
					this.loadDataFromServer()
				}, 2000);
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, newCourseLoading: false});
			})
	};
	
	assignCourse = (e) => {
		e.preventDefault();
		if (!this.state.assignCourseId || !this.state.assignInstructorId || !this.state.assignLevelId) {
			this.setState({assignCourseFormIncomplete: true});
			// this.setState({assignCourseId: null, assignInstructorId: null});

			setTimeout(() => {
				this.setState({assignCourseFormIncomplete: false});
			}, 3000);

			return;
		}
		
		this.setState({
			assignCourseLoading: true, success: false, error: false
		});
		
		const assignCourseProps = {
			userId: this.state.user.userId,
			courseId: this.state.assignCourseId,
			instructorId: this.state.assignInstructorId,
			levelId: parseInt(this.state.assignLevelId),
		};
		console.log(assignCourseProps);
		
		Endpoint.allocateCourse(assignCourseProps)
			.then((res) => {
				console.log(res.data);
				if (res.data.statusCode === 200) {
					this.assignCourseSuccess();
					this.setState({courseId: null, instructorId: null, assignCourseLoading: false, assignCourse: false});
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else if (res.data.statusCode === 208) {
					this.assignCourseExists();
					this.setState({assignCourseLoading: false});
				}
				
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, assignCourseLoading: false});
			})
	};
	
	toggleNewSubInstructor = () => {
		this.setState({newSubInstructor: !this.state.newSubInstructor});
	};
	
	addNewSubInstructor = (e) => {
		e.preventDefault();
		if (!this.state.addSubInstructorId || !this.state.newSubInstructorCourseId) {
			this.setState({error: true, errorMessage: "Please Select a Sub Instructor to add."});
			
			setTimeout(() => {
				this.setState({error: false, errorMessage: ""});
			}, 3000);
			
			return;
		}
		
		this.setState({
			addNewSubInstructorLoading: true, success: false, error: false
		});
		
		const addSubInstructorProps = {
			userId: this.state.addSubInstructorId,
			courseAllocationId: this.state.newSubInstructorCourseId
		};
		
		console.log(addSubInstructorProps);
		
		Endpoint.addSubInstructor(addSubInstructorProps)
			.then((res) => {
				console.log(res.data);
				if (res.data.statusCode === 200) {
					this.addSubInstructorSuccess();
					this.setState({addSubInstructorId: null, newSubInstructorCourseId: null, addNewSubInstructorLoading: false, newSubInstructor: false});
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else if (res.data.statusCode === 208) {
					this.addSubInstructorExists();
					this.setState({addNewSubInstructorLoading: false})
				}
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
	};
	
	removeSubInstructor = (instructor) => {
		Endpoint.removeSubInstructor(instructor.id)
			.then((res) => {
				console.log(res.data);
				this.removeSubInstructorSuccess();
				this.setState({getSubInstructor: false});
				
				setTimeout(() => {
					this.loadDataFromServer()
				}, 2000);
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
	};
	
	loadDataFromServer = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({
			pageLoading: true,
			user: JSON.parse(localStorage.getItem('user')),
			currentCourseSubInstructors: null,
		});
		
		Endpoint.getUserProfile(user.userId)
			.then((res) => {
				this.setState({profile: res.data, pageLoading: false});
				// console.log(res.data);
				
				Endpoint.getInstructorsByDepartment(res.data.department.id)
					.then((res) => {
						// console.log(res.data);
						let newInstructorObj = [];
						for (let i=0; i<res.data.length; i++) {
							let entry = {value: res.data[i].userId, label: res.data[i].fullName };
							newInstructorObj.push(entry);
						}
						this.setState({allInstructors: res.data, allInstructorNames: newInstructorObj, pageLoading: false});
					})
					.catch((error) => {
						this.loadDataError(error, this);
						this.setState({pageLoading: false});
					});
				
				
				Endpoint.getAllocatedCoursesByDepartment(res.data.department.id)
					.then((res) => {
						// console.log(res.data);
						this.setState({departmentCourses: res.data, pageLoading: false});
						
						let mappedData = res.data.map((course, i) => {
							return{
								sNo: i + 1,
								title: <span searchvalue={course.courseTitle} className="capital">{course.courseTitle}</span>,
								code: course.courseCode,
								lecturer: course.courseLecturer,
								actions:
									<div>
										<button className="btn btn-sm btn-outline-primary" onClick={() => this.openNewSubInstructor(course)}>
											<Unicons.UilPlus size="19"/> Add Sub Instructor
										</button>
										
										<button className="btn btn-sm btn-primary" onClick={() => this.openGetSubInstructors(course)}>
											<Unicons.UilUsersAlt size="19"/> View Sub Instructors
										</button>
									</div>
							}
						});
						
						let tableData = {
							columns: [
								{
									label: 'S/No',
									field: 'sNo',
								},
								{
									label: 'Course Code',
									field: 'code',
								},
								{
									label: 'Course Title',
									field: 'title',
								},
								{
									label: 'Course Coordinator',
									field: 'lecturer',
								},
								{
									label: 'Actions',
									field: 'actions',
								},
							],
							rows: mappedData,
						};
						
						this.setState({newCourses: tableData});
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
		
		Endpoint.getAllCourses()
			.then((res) => {
				let newCourseObj = [];
				for (let i=0; i<res.data.length; i++) {
					let entry = {value: res.data[i].id, label: res.data[i].courseDetail };
					newCourseObj.push(entry);
				}
				this.setState({allCourses: res.data, allCourseNames: newCourseObj, pageLoading: false})
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		Endpoint.getAllLevels()
			.then((res) => {
				// console.log(res.data);
				this.setState({allLevels: res.data});
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
					<div className="d-flex flex-wrap justify-content-between">
						<div>
							<div className="d-flex">
								<h1 className="mb-3 mr-2 text-primary my-auto">
									<Unicons.UilBookAlt size="26" className="mr-2"/>
									Manage Course Allocation
								</h1>
								
								<a className="mb-0 my-auto"
									data-for="main"
									data-tip="Hello<br />multiline<br />tooltip"
									data-iscapture="true"
								>
									<Unicons.UilInfoCircle size="22" className="mr-2"/>
								</a>
								<ReactTooltip id="main" type="dark" effect="float" place="right">
									<span>After creating a course, assign it to a departmental instructor to see it in the list.</span>
								</ReactTooltip>
							</div>
						</div>
						
						<div>
							<button className="btn btn-outline-primary" onClick={this.openAssignCourse}>
								<Unicons.UilUserCheck size="20"/> Allocate Instructor
							</button>
							
							<button className="btn btn-primary mt-2 mt-md-0" onClick={this.openNewCourse}>
								<Unicons.UilPlus size="20"/> New Course
							</button>
						</div>
					</div>
					
					<hr/>
					
					<div className="overflow-scroll">
						<MDBDataTableV5
							hover
							striped
							entriesOptions={[10, 20, 25]}
							entries={10}
							pagesAmount={4}
							pagingTop
							searchTop
							searchBottom={false}
							data={this.state.newCourses}
							sortRows={['title']}
						/>
					</div>
				</div>
				
				<Modal isOpen={this.state.newCourse} toggle={this.toggleNewCourse} className="mt-5 md" size="lg">
					<form onSubmit={(e) => this.createCourse(e)}>
						<ModalHeader toggle={this.toggleNewCourse}>
							<span className="h2">Add New Course</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group row">
								<div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>Course Code:</b>
									</label>
									
									<div className="">
										<input id="clearName" type="text" className="form-control"
											   value={this.state.newCourseCode}
											   onChange={(e) => this.setState({
												   newCourseCode: e.target.value,
											   })}
										/>
									</div>
								</div>
								
								<div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>Course Title:</b>
									</label>
									
									<div className="">
										<input id="clearName" type="text" className="form-control"
											   value={this.state.newCourseTitle}
											   onChange={(e) => this.setState({
												   newCourseTitle: e.target.value,
											   })}
										/>
									</div>
									
									<div className="mt-3">
										{this.state.newCourseFormIncomplete ?
											<div
												className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
												<p className="small text-white mb-0">
													<Unicons.UilExclamationCircle size="20"/> Please fill all fields.
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
								Add Course
								{
									this.state.newCourseLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.newCourseLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewCourse}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
			
				<Modal isOpen={this.state.assignCourse} toggle={this.toggleAssignCourse} className="mt-5 md" size="lg">
					<form onSubmit={(e) => this.assignCourse(e)}>
						<ModalHeader toggle={this.toggleAssignCourse}>
							<span className="h2">Assign Course To Instructor</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group row">
								<div className="col-md-6">
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
											options={this.state.allCourseNames}
											onChange={this.setAssignCourseId }
										/>
									</div>
								</div>
								
								<div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>Select Instructor:</b>
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
											options={this.state.allInstructorNames}
											onChange={ this.setAssignInstructorId}
										/>
									</div>
								</div>
								
								
								<div className="col-md-6">
									<label className="mt-4 mr-2">
										<b>Select Level:</b>
									</label>
									
									<select className="form-control" style={{borderRadius: 5}} onChange={(e) => this.setState({assignLevelId: e.target.value})}>
										<option value="">Select a level</option>
										{
											this.state.allLevels && this.state.allLevels.length ?
												this.state.allLevels.map((level, index) => {
													return (
														<option value={level.id} key={index}>{level.name}</option>
													)
												})
												:
												null
										}
									</select>
								</div>
								
								
								<div className="col-md-6">
									<div className="mt-5">
										{this.state.assignCourseFormIncomplete ?
											<div
												className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
												<p className="small text-white mb-0">
													<Unicons.UilExclamationCircle size="20"/> Please fill in all fields.
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
								Add Course
								{
									this.state.assignCourseLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.assignCourseLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleAssignCourse}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
				
				<Modal isOpen={this.state.newSubInstructor} toggle={this.toggleNewSubInstructor} className="mt-5 md" size="sm">
					<form onSubmit={(e) => this.addNewSubInstructor(e)}>
						<ModalHeader toggle={this.toggleNewSubInstructor}>
							<span className="h2">Add Sub Instructor to {this.state.newSubInstructorCourse.courseTitle} [{this.state.newSubInstructorCourse.courseCode}]</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group row">
								<div className="col-md-12">
									<label className="mt-2 mr-2 ">
										<b>Select Instructor:</b>
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
											options={this.state.allInstructorNames}
											onChange={ this.setAddSubInstructorId}
										/>
									</div>
								</div>
							</div>
							
							<div className="col-md-12">
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
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Add Instructor
								{
									this.state.addNewSubInstructorLoading ?
										<span className="ml-2">
											<ClipLoader size={20} color={"#fff"}
														Loading={this.state.addNewSubInstructorLoading}/>
										</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewSubInstructor}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
				
				<Modal isOpen={this.state.getSubInstructor} toggle={this.toggleGetSubInstructor} className="mt-5 md" size="lg">
					<ModalHeader toggle={this.toggleGetSubInstructor}>
						<span className="h2">{this.state.currentCourse.courseTitle} | <span className="h4">Sub Instructors</span></span>
					</ModalHeader>
					
					<ModalBody>
						<div className="table-responsive">
							<table className="table table-hover table-striped">
								<thead>
								<tr>
									<th>S/No</th>
									<th>Lecturer Name</th>
									<th>Actions</th>
								</tr>
								</thead>
								
								<tbody>
								{
									this.state.subInstructorsLoading ?
										<tr>
											<td colSpan="3">
												<h4 className="text-center text-primary">
													Loading
													{
														this.state.subInstructorsLoading ?
															<span className="ml-2">
																<ClipLoader size={20} color={"#33297B"}
																			Loading={this.state.subInstructorsLoading}/>
															</span>
															:
															null
													}
												</h4>
											</td>
										</tr>
										:
										this.state.currentCourseSubInstructors && this.state.currentCourseSubInstructors.length ?
											this.state.currentCourseSubInstructors.map((instructor, index) => {
												return (
													<tr key={instructor.id}>
														<td>{index+1}</td>
														<td>{instructor.personName}</td>
														<td>
															<button className="btn btn-sm btn-outline-danger"
																	onClick={() => this.removeSubInstructor(instructor)}>
																<Unicons.UilTrash size="20"/> Remove
															</button>
														</td>
													</tr>
												)
											})
											:
											<tr>
												<td colSpan="3">
													<p className="text-center">No SubInstructors for this course.</p>
												</td>
											</tr>
								}
								
								{/*{*/}
								{/*	this.state.currentCourseSubInstructors && this.state.currentCourseSubInstructors.length ?*/}
								{/*		this.state.currentCourseSubInstructors.map((instructor, index) => {*/}
								{/*			return (*/}
								{/*				<tr key={instructor.id}>*/}
								{/*					<td>{index+1}</td>*/}
								{/*					<td>{instructor.personName}</td>*/}
								{/*					<td>*/}
								{/*						<button className="btn btn-sm btn-outline-danger"*/}
								{/*								onClick={() => this.removeSubInstructor(instructor)}>*/}
								{/*							<Unicons.UilTrash size="20"/> Remove*/}
								{/*						</button>*/}
								{/*					</td>*/}
								{/*				</tr>*/}
								{/*			)*/}
								{/*		})*/}
								{/*		:*/}
								{/*		<tr>*/}
								{/*			<td colSpan="3">*/}
								{/*				<p className="text-center">No SubInstructors for this course.</p>*/}
								{/*			</td>*/}
								{/*		</tr>*/}
								{/*}*/}
								</tbody>
							</table>
						</div>
					
					</ModalBody>
					
					<ModalFooter>
						<button type="button" className="btn btn-danger" onClick={this.toggleGetSubInstructor}>Close</button>
					</ModalFooter>
				</Modal>
			</>
		
		)
	}
	
}

export default connect(mapStateToProps, mapDispatchToProps)(HODCourses);