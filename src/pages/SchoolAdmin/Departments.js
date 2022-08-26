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
import {format} from "date-fns";
import moment from "moment";

class SchoolAdminDepartments extends Component {
	state = {
		pageLoading: false,
		thisFaculty: [],
		
		allDepartments: [],
		newDepartment: false,
		newDepartmentFormIncomplete: false,
		newDepartmentName: '',
		
		editingDepartment: [],
		editingDepartmentName: '',
		editDepartment: false,
		editDepartmentFormIncomplete: false,
		mappedDepartments: [],
		newDepartments: [],
		
		deletingDepartment: [],
		deleteDepartmentLoading: false,
	};
	
	toggleNewDepartment = () => {
		this.setState({newDepartment: !this.state.newDepartment})
	};
	closeNewDepartment = () => {
		this.setState({newDepartment: false})
	};
	openNewDepartment = () => {
		this.setState({newDepartment: true})
	};
	
	toggleEditDepartment = () => {
		this.setState({editDepartment: !this.state.editDepartment})
	};
	closeEditDepartment = () => {
		this.setState({editDepartment: false})
	};
	
	toggleDeleteDepartment = () => {
		this.setState({deleteDepartment: !this.state.deleteDepartment})
	};
	closeDeleteDepartment = () => {
		this.setState({deleteDepartment: false})
	};
	
	newDepartmentSuccess = () => toast.success("Department added successfully", {
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
	
	editDepartmentSuccess = () => toast.success("Department edited successfully", {
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
	
	deleteDepartmentSuccess = () => toast.success("Operation successful!", {
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
	
	createDepartment = (e) => {
		e.preventDefault();
		
		if (!this.state.newDepartmentName) {
			this.setState({newDepartmentFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newDepartmentFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({
			newDepartmentLoading: true, success: false, error: false
		});
		
		const departmentProps = {
			name: this.state.newDepartmentName,
			facultyId: this.state.thisFaculty.id,
		};
		
		Endpoint.createDepartment(departmentProps)
			.then((res) => {
				if(res.status === 200) {
					this.setState({error: false, success: true, newDepartmentLoading: false, newDepartment: false, newDepartmentName: ''});
					
					this.newDepartmentSuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else {
					this.setState({error: true, errorMessage: "Something went wrong, try again later", success: false, newDepartmentLoading: false});
				}
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, newDepartmentLoading: false});
			})
	};
	
	openEditDepartment = (department) => {
		this.setState({
			editingDepartment: department,
			editingDepartmentName: department.name,
			editDepartment: true,
		})
	};
	
	openDeleteDepartment = (department) => {
		this.setState({
			deletingDepartment: department,
			deletingDepartmentName: department.name,
			deleteDepartment: true,
		})
	};
	
	editDepartment = (e) => {
		e.preventDefault();
		
		if (this.state.editingDepartmentName === '' || this.state.editingDepartment.name === this.state.editingDepartmentName) {
			this.setState({editDepartmentFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({editDepartmentFormIncomplete: false});
			}, 2000);
			
			return;
		}
		
		this.setState({
			editDepartmentLoading: true, success: false, error: false
		});
		
		const editDepartmentProps = {
			name: this.state.editingDepartmentName,
			id: this.state.editingDepartment.id,
		};
		
		Endpoint.editDepartment(editDepartmentProps)
			.then((res) => {
				if(res.status === 200) {
					this.setState({error: false, success: true, editDepartmentLoading: false, editDepartment: false, editingDepartmentName: ''});
					
					this.editDepartmentSuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else {
					this.setState({error: true, errorMessage: "Something went wrong, try again later", success: false, editDepartmentLoading: false});
				}
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({editDepartmentLoading: false});
			});
	};
	
	deleteDepartment = (e) => {
		e.preventDefault();
		
		if (!this.state.deletingDepartment) {
			this.setState({deleteDepartmentFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({deleteDepartmentFormIncomplete: false});
			}, 2000);
			
			return;
		}
		
		this.setState({
			deleteDepartmentLoading: true, success: false, error: false
		});
		
		const deleteDepartmentProps = {
			id: this.state.deletingDepartment.id,
		};
		
		Endpoint.deleteDepartment(deleteDepartmentProps)
			.then((res) => {
				this.setState({error: false, success: true, deleteDepartmentLoading: false, deleteDepartment: false, deletingDepartmentName: ''});
				
				this.deleteDepartmentSuccess();
				
				setTimeout(() => {
					this.loadDataFromServer()
				}, 2000);
			})
	};
	
	loadDataFromServer = () => {
		this.setState({pageLoading: true});
		let faculty = this.props.location.state.data;
		this.setState({thisFaculty: faculty});
		
		Endpoint.getDepartmentsByFaculty(this.props.location.state.data.id, true)
			.then((res) => {
				console.log(res.data);
				this.setState({allDepartments: res.data, pageLoading: false});
				
				let mappedData = res.data.map((department, i) => {
					return{
						sNo: i + 1,
						departmentName: <span searchvalue={department.name} className="capital">{department.name}</span>,
						// addedOn: format(new Date(department.dateCreated), "dd-MM-yyyy"),
						addedOn: moment(department.dateCreated).format("MMM Do YYYY"),
						actions:
							<div>
								{/* <button className="btn btn-sm btn-outline-primary"
										onClick={() => this.openEditDepartment(department)}>
									<Unicons.UilEditAlt size="19"/> Edit
								</button> */}
						
								{department.active ? <button className="btn btn-sm btn-outline-danger"
										onClick={() => this.openDeleteDepartment(department)}>
									<Unicons.UilTrashAlt size="19"/> Deativate
								</button> : 
								<button className="btn btn-sm btn-outline-success"
								onClick={() => this.openDeleteDepartment(department)}>
							<Unicons.UilTrashAlt size="19"/> Acitvate
						</button>
								
								} 
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
							label: 'Department Name',
							field: 'departmentName',
						},
						{
							label: 'Added On',
							field: 'addedOn',
						},
						{
							label: 'Actions',
							field: 'actions',
						},
					],
					rows: mappedData,
				};
				
				this.setState({newDepartments: tableData});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
	};
	
	componentDidMount() {

		this.loadDataFromServer();
	};
	
	
	render () {
		return (
			<>
				{this.state.pageLoading ?
					<div className="spin-back">
						<div className="jumbotron jum2">
							<ClipLoader
								size={100}
								color={"#192f59"}
								loading={this.state.pageLoading}
							/>
							
							<h3>Just a moment...</h3>
						</div>
					</div>
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
							<span className="h2">{this.state.thisFaculty.name}</span> | Departments
						</h1>
						
						<button className="btn btn-primary" onClick={this.openNewDepartment}>
							<Unicons.UilPlus size="20"/> New Department
						</button>
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
							data={this.state.newDepartments}
							sortRows={['departmentName']}
						/>
					</div>
				</div>
				
				<Modal isOpen={this.state.newDepartment} toggle={this.toggleNewDepartment} className="mt-5 md">
					<form onSubmit={(e) => this.createDepartment(e)}>
						<ModalHeader toggle={this.toggleNewDepartment}>
							<span className="h2">Add New Department</span>
						</ModalHeader>
						
						<ModalBody>
						<div className="form-group">
								<label className="mt-2 mr-2 ">
									<b>Faculty Name:</b>
								</label>
								
								<div className="custom-form-alert">
									
									
									<input id="clearName" type="text" className="form-control"
										   value={this.state.thisFaculty.name}
										   readOnly
										   
									/>
								</div>
							</div>
							<div className="form-group">
								<label className="mt-2 mr-2 ">
									<b>Department Name:</b>
								</label>
								
								<div className="custom-form-alert">
									{this.state.newDepartmentFormIncomplete ?
										<div
											className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
											<p className="small text-white mb-0">
												<Unicons.UilExclamationCircle size="20"/> Please enter a department name.
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
									{/* this.state.thisFaculty.name */}
									<input id="clearName" type="text" className="form-control"
										   value={this.state.newDepartmentName}
										   onChange={(e) => this.setState({
											   newDepartmentName: e.target.value,
										   })}
									/>
								</div>
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Add Department
								{
									this.state.newDepartmentLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.newDepartmentLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewDepartment}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
				
				<Modal isOpen={this.state.editDepartment} toggle={this.toggleEditDepartment} className="mt-5 md">
					<form onSubmit={(e) => this.editDepartment(e)}>
						<ModalHeader toggle={this.toggleEditDepartment}>
							<span className="h2">Edit Department Name</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group">
								<label className="mt-2 mr-2 ">
									<b>Department Name:</b>
								</label>
								
								<div className="custom-form-alert">
									{this.state.editDepartmentFormIncomplete ?
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
										   value={this.state.editingDepartmentName}
										   onChange={(e) => this.setState({
											   editingDepartmentName: e.target.value,
										   })}
									/>
								</div>
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Edit Department
								{
									this.state.editDepartmentLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.editDepartmentLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleEditDepartment}>Close
							</button>
						</ModalFooter>
					</form>
				</Modal>
				
				<Modal isOpen={this.state.deleteDepartment} toggle={this.toggleDeleteDepartment} className="mt-5 md" size="sm">
					<form onSubmit={(e) => this.deleteDepartment(e)}>
						<ModalHeader toggle={this.toggleDeleteDepartment}>
							{/* <span className="h2">Delete {this.state.deletingDepartmentName}?</span> */}
							<span className="h2">Continue?</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="text-center">
								<h4>Are you sure?</h4>
								<p>This action cannot be undone.</p>
								
								{this.state.deleteDepartmentFormIncomplete ?
									<div
										className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
										<p className="small text-white mb-0">
											<Unicons.UilExclamationCircle size="20"/> Please select a department to delete...
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
							
							<button type="button" className="btn btn-danger" onClick={this.toggleDeleteDepartment}>Close
							</button>
						</ModalFooter>
					</form>
				</Modal>
			</>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SchoolAdminDepartments);