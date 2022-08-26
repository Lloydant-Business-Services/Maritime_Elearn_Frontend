import React, {Component} from 'react';
import * as Unicons from '@iconscout/react-unicons';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Link} from "react-router-dom";
import Endpoint from "../../utils/endpoint";
import {handleFormSubmissionError} from "../../utils/helpers";
import toast, {Toaster} from 'react-hot-toast';
import ClipLoader from "react-spinners/ClipLoader";
import Folder from "../../assets/images/empty2.png";
import { MDBDataTableV5 } from 'mdbreact';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import moment from "moment";
import { timers } from 'jquery';
import Spinner from "../Front/Spinner"

class SchoolAdminFaculties extends Component {
	state = {
		pageLoading: false,
		
		allFaculties: [],
		newFaculty: false,
		newFacultyFormIncomplete: false,
		newFacultyName: '',
		
		editingFaculty: [],
		editingFacultyName: '',
		editFaculty: false,
		editFacultyFormIncomplete: false,
		mappedFaculties: [],
		newFaculties: [],
		deleteFaculty: false,
		facultyId: 0
	};
	
	toggleNewFaculty = () => {
		this.setState({newFaculty: !this.state.newFaculty})
	};
	closeNewFaculty = () => {
		this.setState({newFaculty: false})
	};
	openNewFaculty = () => {
		this.setState({newFaculty: true})
	};

	toggleEditFaculty = () => {
		this.setState({editFaculty: !this.state.editFaculty})
	};
	closeEditFaculty = () => {
		this.setState({editFaculty: false})
	};
	
	newFacultySuccess = () => toast.success("Faculty added successfully", {
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
	
	editFacultySuccess = () => toast.success("Faculty edited successfully", {
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

	deleteFacultySuccess = () => toast.success("Operation successful!", {
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
	
	createFaculty = (e) => {
		e.preventDefault();
		
		if (!this.state.newFacultyName) {
			this.setState({newFacultyFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newFacultyFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({
			newFacultyLoading: true, success: false, error: false
		});
		
		const facultyProps = {
			name: this.state.newFacultyName,
		};
		
		Endpoint.createFaculty(facultyProps)
			.then((res) => {
				if(res.status === 200) {
					this.setState({error: false, success: true, newFacultyLoading: false, newFaculty: false, newFacultyName: ''});
					
					this.newFacultySuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else {
					this.setState({error: true, errorMessage: "Something went wrong, try again later", success: false, newFacultyLoading: false});
				}
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, newFacultyLoading: false});
			})
	};
	
	openEditFaculty = (faculty) => {
		this.setState({
			editingFaculty: faculty,
			editingFacultyName: faculty.name,
			editFaculty: true,
		})
	};
	
	editFaculty = (e) => {
		e.preventDefault();
		
		if (this.state.editingFacultyName === '' || this.state.editingFaculty.name === this.state.editingFacultyName) {
			this.setState({editFacultyFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({editFacultyFormIncomplete: false});
			}, 2000);
			
			return;
		}
		
		this.setState({
			editFacultyLoading: true, success: false, error: false
		});
		
		const editFacultyProps = {
			name: this.state.editingFacultyName,
			id: this.state.editingFaculty.id,
		};
		
		Endpoint.editFaculty(editFacultyProps)
			.then((res) => {
				console.log(res);
				if(res.status === 200) {
					this.setState({error: false, success: true, editFacultyLoading: false, editFaculty: false, editingFacultyName: ''});
					
					this.editFacultySuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else {
					this.setState({error: true, errorMessage: "Something went wrong, try again later", success: false, editFacultyLoading: false});
				}
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({editFacultyLoading: false});
			});
	};


	deletingFaculty = (e) => {
		console.log(this.state.facultyId, 'facultyid======')
		e.preventDefault();
		
		this.setState({
			deleteDepartmentLoading: true, success: false, error: false
		});
		
		const deleteFacultyProps = {
			id: this.state.facultyId,
		};
		
		Endpoint.deleteFaculty(this.state.facultyId)
			.then((res) => {
				this.setState({error: false, success: true, deleteDepartmentLoading: false, deleteDepartment: false, deleteFaculty: false });
				
				this.deleteFacultySuccess();
				
				setTimeout(() => {
					this.loadDataFromServer()
				}, 2000);
			})
	};
	
	loadDataFromServer = () => {
		this.setState({pageLoading: true});
		
		Endpoint.getAllFaculties(true)
			.then((res) => {
				console.log(res.data);
				this.setState({allFaculties: res.data, pageLoading: false});
				
				let mappedData = res.data.map((faculty, i) => {
					return{
						sNo: i + 1,
						facultyName:  faculty.name,
						// addedOn: <span>{moment(faculty.dateCreated).format('lll')}</span>,
						actions:
							<div>
								<Link to={{pathname:"/schooladmin/departments",
									state:{data:faculty}}}
									  className="btn btn-sm btn-primary">
									<Unicons.UilLayerGroup size="19"/> Departments
								</Link>
								
								{/*<button className="btn btn-sm btn-outline-primary"*/}
								{/*		onClick={() => this.openEditFaculty(faculty)}>*/}
								{/*	<Unicons.UilEditAlt size="19"/> Edit*/}
								{/*</button>*/}
								
								{/*<button className="btn btn-sm btn-outline-danger">*/}
								{/*	<Unicons.UilTrashAlt size="19"/> Delete*/}
								{/*</button>*/}
							</div>,

							actions1:
							<div>
	                         	{/* <button className="btn btn-sm btn-outline-primary"
										onClick={() => {this.openEditFaculty(faculty?.id)}}>
									<Unicons.UilEditAlt size="19"/> Edit
								</button> */}
						
								{faculty.active ? <button className="btn btn-sm btn-outline-danger"
										onClick={() => {this.toggleDeleteFaculty(faculty?.id)}}>
									<Unicons.UilTrashAlt size="19"/> Deactivate
								</button> : 
								
								<button className="btn btn-sm btn-outline-success"
										onClick={() => {this.toggleDeleteFaculty(faculty?.id)}}>
									<Unicons.UilTrashAlt size="19"/> Activate
								</button>}
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
							label: 'Faculty',
							field: 'facultyName',
						},
						// {
						// 	label: 'Added On',
						// 	field: 'addedOn',
						// },
						{
							label: 'Actions',
							field: 'actions',
						},
                        
						{
							label: 'Manage',
							field: 'actions1',
						},

					],
					rows: mappedData,
				};
				
				this.setState({newFaculties: tableData});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		// this.mapFaculties();
		
		Endpoint.getAllDepartments()
			.then((res) => {
				// console.log(res.data);
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
	};
	
	componentDidMount() {
		this.loadDataFromServer();
	};

	toggleDeleteFaculty = (id) => {
		this.setState({deleteFaculty: !this.state.deleteFaculty, facultyId: id})
	};
	
	
	render () {
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
						<h1 className="mb-3 mr-2 text-primary my-auto">
							<Unicons.UilBookAlt size="26" className="mr-2"/>
							Faculties
						</h1>
						
						<button className="btn btn-primary" onClick={this.openNewFaculty}>
							<Unicons.UilPlus size="20"/> New Faculty
						</button>
					</div>
					
					<hr/>
					
					<MDBDataTableV5
						responsive
						hover
						striped
						entriesOptions={[10, 20, 25]}
						entries={10}
						pagesAmount={4}
						pagingTop
						searchTop
						searchBottom={false}
						data={this.state.newFaculties}
					/>
				</div>
				
				<Modal isOpen={this.state.newFaculty} toggle={this.toggleNewFaculty} className="mt-5 md">
					<form onSubmit={(e) => this.createFaculty(e)}>
						<ModalHeader toggle={this.toggleNewFaculty}>
							<span className="h2">Add New Faculty</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group">
								<label className="mt-2 mr-2 ">
									<b>Faculty Name:</b>
								</label>
								
								<div className="custom-form-alert">
									{this.state.newFacultyFormIncomplete ?
										<div
											className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
											<p className="small text-white mb-0">
												<Unicons.UilExclamationCircle size="20"/> Please enter a faculty name.
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
									
									<input id="clearName" type="text" className="form-control"
										   value={this.state.newFacultyName}
										   onChange={(e) => this.setState({
											   newFacultyName: e.target.value,
										   })}
									/>
								</div>
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Add Faculty
								{
									this.state.newFacultyLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.newFacultyLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewFaculty}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
				
				<Modal isOpen={this.state.editFaculty} toggle={this.toggleEditFaculty} className="mt-5 md">
					<form onSubmit={(e) => this.editFaculty(e)}>
						<ModalHeader toggle={this.toggleEditFaculty}>
							<span className="h2">Edit Faculty Name</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group">
								<label className="mt-2 mr-2 ">
									<b>Faculty Name:</b>
								</label>
								
								<div className="custom-form-alert">
									{this.state.editFacultyFormIncomplete ?
										<div
											className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
											<p className="small text-white mb-0">
												<Unicons.UilExclamationCircle size="20"/> Please enter a new faculty
												name.
											</p>
										</div>
										: null
									}
									
									{this.state.error ?
										<div className="bg-danger border-rad-full text-center p-2 mb-3">
											<p className="small text-white mb-0">
												<Unicons.UilExclamationCircle size="20"/> {this.state.errorMessage}
											</p>
										</div>
										: null
									}
									
									<input id="clearName" type="text" className="form-control"
										   value={this.state.editingFacultyName}
										   onChange={(e) => this.setState({
											   editingFacultyName: e.target.value,
										   })}
									/>
								</div>
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Edit Faculty
								{
									this.state.editFacultyLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.editFacultyLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleEditFaculty}>Close
							</button>
						</ModalFooter>
					</form>
				</Modal>

				<Modal isOpen={this.state.deleteFaculty} toggle={this.toggleDeleteFaculty} className="mt-5 md" size="sm">
					<form onSubmit={(e) => this.deletingFaculty(e)}>
						<ModalHeader toggle={this.toggleDeleteFaculty}>
							<span className="h2">Continue {this.state.deletingDepartmentName}?</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="text-center">
								<h4>Are you sure?</h4>
								<p>This action cannot be undone.</p>
								
								{this.state.deleteDepartmentFormIncomplete ?
									<div
										className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
										<p className="small text-white mb-0">
											<Unicons.UilExclamationCircle size="20"/> Please select a faculty to delete...
										</p>
									</div>
									: null
								}
								
								{this.state.error ?
									<div className="bg-danger border-rad-full text-center p-2 mb-3">
										<p className="small text-white mb-0">
											<Unicons.UilExclamationCircle size="20"/> {this.state.errorMessage}
										</p>
									</div>
									: null
								}
							
							</div>
							
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Confirm
								{
									this.state.deleteDepartmentLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.deleteDepartmentLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleDeleteFaculty}>Close
							</button>
						</ModalFooter>
					</form>
				</Modal>
			</>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SchoolAdminFaculties);