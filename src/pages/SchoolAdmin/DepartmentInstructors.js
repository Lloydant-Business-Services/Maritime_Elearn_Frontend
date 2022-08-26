import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import * as Unicons from '@iconscout/react-unicons';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Endpoint from "../../utils/endpoint";
import {handleFormSubmissionError} from "../../utils/helpers";
import toast, { Toaster } from 'react-hot-toast';
import ClipLoader from "react-spinners/ClipLoader";
import Folder from "../../assets/images/empty2.png";
import {Accordion} from "../../components/Accordion/Accordion";
import {format} from "date-fns";
import {MDBDataTableV5} from "mdbreact";
import { timers } from 'jquery';

import Spinner from "../Front/Spinner"

class SchoolAdminDepartmentInstructors extends Component {
	state = {
		thisDepartment: [],
		allInstructors: [],
		
		newInstructor: false,
		newOtherName: '',
		newLastName: '',
		newFirstName: '',
		newInstructorLoading: false,
		newInstructorFormIncomplete: false,
		deleteInstructor: false
	};
	
	
	newInstructorSuccess = () => toast.success("Instructor added successfully", {
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
	loadGeneralError = (error) => toast.error(error, {
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
	toggleNewInstructor = () => {
		this.setState({newInstructor: !this.state.newInstructor});
	};
	
	openNewInstructor = () => {
		this.setState({newInstructor: true});
	};

	openDeleteInstructor = (data) => {
		console.log(data)
      this.setState({
		deleteInstructor: true,
		  InstructorId: data.userId
		})
	}
	
	createInstructor = (e) => {
		e.preventDefault();
		
		if (!this.state.newFirstName || !this.state.newLastName || !this.state.newOtherName || !this.state.newEmail) {
			this.setState({newInstructorFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newInstructorFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({newInstructorLoading: true, success: false, error: false});
		
		const instructorProps = {
			firstname: this.state.newFirstName,
			surname: this.state.newLastName,
			othername: this.state.newOtherName,
			email: this.state.newEmail,
			departmentId: this.state.thisDepartment.id,
			roleId: 3,
		};
		
		Endpoint.createInstructor(instructorProps)
			.then((res) => {
				if(res.data.statusCode === 200) {
					console.log(res, "status")
					this.setState({
						error: false,
						success: true,
						newInstructorLoading: false,
						newInstructor: false,
						newFirstName: '',
						newLastName: '',
						newOtherName: '',
						newEmail: '',
					});
					
					this.newInstructorSuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} 
				else if(res.data.statusCode == 208){
					this.setState({error: true, errorMessage: "Email entered already belong to another user", success: false, newInstructorLoading: false});
				}
				else {
					this.setState({error: true, errorMessage: "Something went wrong, try again later", success: false, newInstructorLoading: false});
				}
			})
			.catch((error) => {
				this.loadDataError(error);
				this.setState({newInstructorLoading: false, })
			});
	};
	
	deleteInstructorMethod = (e) => {
		e.preventDefault();
		
		// if (!this.state.deletingDepartment) {
		// 	this.setState({deleteDepartmentFormIncomplete: true});
			
		// 	setTimeout(() => {
		// 		this.setState({deleteDepartmentFormIncomplete: false});
		// 	}, 2000);
			
		// 	return;
		// }
		
		this.setState({
			pageLoading: true, success: false, error: false
		});
		
		// const deleteDepartmentProps = {
		// 	id: this.state.deletingDepartment.id,
		// };
		
		Endpoint.deleteInstructor(this.state.InstructorId)
			.then((res) => {
				this.setState({error: false, success: true, pageLoading: false, deleteDepartment: false, deletingDepartmentName: ''});
				
				this.loadDataFromServer();
				
				setTimeout(() => {
					this.loadDataFromServer()
				}, 2000);
			})
			.catch((err) => {
				this.setState({pageLoading:false, deleteInstructor:false})
				// this.loadGeneralError("Cannot delete! Selected instructor already have courses assign.")
			})
	};

	loadDataFromServer = () => {
		this.setState({pageLoading: true});
		let department = this.props.location.state.data;
		this.setState({thisDepartment: department});
		
		Endpoint.getInstructorsByDepartment(department.id)
			.then((res) => {
				this.setState({allInstructors: res.data, pageLoading: false});
				 console.log(res.data, 'data===instructtooorrs===')
				let mappedData = res.data.map((instructor, i) => {
					return{
						sNo: i + 1,
						name: <span searchvalue={instructor.name} className="capital">{instructor.fullName}</span>,
						email: instructor.email,
						actions:
							<div>
								{/* <button className="btn btn-sm btn-outline-primary">
									<Unicons.UilEditAlt size="19"/> Edit
								</button> */}
						
								<button onClick={() => this.openDeleteInstructor(instructor)} className="btn btn-sm btn-outline-danger">
									<Unicons.UilTrashAlt size="19"/> Delete
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
							label: 'Name',
							field: 'name',
						},
						{
							label: 'Email',
							field: 'email',
						},
						{
							label: 'Actions',
							field: 'actions',
						},
					],
					rows: mappedData,
				};
				
				this.setState({newInstructors: tableData});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
	};
	
	componentDidMount() {
		this.loadDataFromServer();
	}
	toggleDeleteInstructor = () => {
		this.setState({
			deleteInstructor:!this.state.deleteInstructor
		})
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
						<h1 className="mb-3 mr-2 text-primary my-auto">
							<Unicons.UilBookAlt size="26" className="mr-2"/>
							<span className="h2 capital">{this.state.thisDepartment.name}</span> | Instructors
						</h1>
						
						<button className="btn btn-primary" onClick={this.openNewInstructor}>
							<Unicons.UilPlus size="20"/> New Instructor
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
						data={this.state.newInstructors}
						sortRows={['name']}
					/>
					</div>
				</div>
				
				
				<Modal isOpen={this.state.newInstructor} toggle={this.toggleNewInstructor} className="mt-5 md" size="lg">
					<form onSubmit={(e) => this.createInstructor(e)}>
						<ModalHeader toggle={this.toggleNewInstructor}>
							<span className="h2">Add New Instructor</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group row">
								<div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>First Name:</b>
									</label>
									
									<input id="fName" type="text" className="form-control"
										   value={this.state.newFirstName}
										   onChange={(e) => this.setState({
											   newFirstName: e.target.value,
										   }) }
									/>
								</div>
								
								<div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>Last Name:</b>
									</label>
									
									<input id="lName" type="text" className="form-control"
										   value={this.state.newLastName}
										   onChange={(e) => this.setState({
											   newLastName: e.target.value,
										   }) }
									/>
								</div>
								
								<div className="col-md-6 mt-3">
									<label className="mt-2 mr-2 ">
										<b>Other Name:</b>
									</label>
									
									<input id="oName" type="text" className="form-control"
										   value={this.state.newOtherName}
										   onChange={(e) => this.setState({
											   newOtherName: e.target.value,
										   }) }
									/>
								</div>
								
								<div className="col-md-6 mt-3">
									<label className="mt-2 mr-2 ">
										<b>Email:</b>
									</label>
									
									<input id="email" type="email" className="form-control"
										   value={this.state.newEmail}
										   onChange={(e) => this.setState({
											   newEmail: e.target.value,
										   }) }
									/>
									
									{this.state.newInstructorFormIncomplete ?
										<div className="bg-danger border-rad-full text-center p-2 my-3">
											<p className="small text-white mb-0">
												<Unicons.UilExclamationCircle size="20"/> Please fill in all fields.
											</p>
										</div>
										: null
									}
									
									{this.state.error ?
										<div className="bg-danger border-rad-full text-center p-2 my-3">
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
									this.state.newInstructorLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.newInstructorLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewInstructor}>Close</button>
						</ModalFooter>
					</form>
				</Modal>

				<Modal isOpen={this.state.deleteInstructor} toggle={this.toggleDeleteInstructor} className="mt-5 md" size="sm">
					<form onSubmit={(e) => this.deleteInstructorMethod(e)}>
						<ModalHeader toggle={this.toggleDeleteDepartment}>
							<span className="h2">Delete {this.state.deletingDepartmentName}?</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="text-center">
								<h4>Are you sure?</h4>
								<p>This action cannot be undone.</p>
								
								
								
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
								Delete Instructor
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
							
							<button type="button" className="btn btn-danger" onClick={() => this.toggleDeleteInstructor()}>Close
							</button>
						</ModalFooter>
					</form>
				</Modal>
			
			</>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SchoolAdminDepartmentInstructors);