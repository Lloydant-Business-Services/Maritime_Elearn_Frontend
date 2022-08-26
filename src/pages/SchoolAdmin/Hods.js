import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import * as Unicons from '@iconscout/react-unicons';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Endpoint from "../../utils/endpoint";
import {handleFormSubmissionError} from "../../utils/helpers";
import toast, { Toaster } from 'react-hot-toast';
import ClipLoader from "react-spinners/ClipLoader";
import {Accordion} from "../../components/Accordion/Accordion";
import Folder from "../../assets/images/empty2.png";
import {format} from "date-fns";
import {Link} from "react-router-dom";
import {MDBDataTableV5} from "mdbreact";
import ReactTooltip from "react-tooltip";
import Spinner from "../Front/Spinner"


class SchoolAdminHods extends Component {
	state = {
		pageLoading: false,
		allRoles: [],
		allFaculties: [],
		mappedFaculties: [],
		newFaculties: [],
		allDepartments: [],
		
		newHod: false,
		newHodFormIncomplete: false,
		newFirstName: '',
		newLastName: '',
		newOtherName: '',
		newEmail: '',
		newHodLoading: false
	};
	
	toggleNewHod = () => {
		this.setState({newHod: !this.state.newHod})
	};
	
	openNewHod = () => {
		this.setState({newHod: true})
	};
	
	closeNewHod = () => {
		this.setState({newHod: false})
	};
	
	newHodSuccess = () => toast.success("HOD added successfully", {
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
	
	createHod = (e) => {
		e.preventDefault();
		
		if (!this.state.newFirstName || !this.state.newLastName || !this.state.newOtherName || !this.state.newEmail) {
			this.setState({newHodFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newHodFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({newHodLoading: true, success: false, error: false});
		
		const hodProps = {
			firstname: this.state.newFirstName,
			surname: this.state.newLastName,
			othername: this.state.newOtherName,
			departmentId: this.state.department.Id,
			email: this.state.newEmail,
			roleId: 4,
		};
		console.log(hodProps);
		
		Endpoint.createInstructorandHod(hodProps)
			.then((res) => {
				if(res.status === 200) {
					this.setState({
						error: false,
						success: true,
						newHodLoading: false,
						newHod: false,
						newFirstName: '',
						newLastName: '',
						newOtherName: '',
						newEmail: '',
					});
					
					this.newHodSuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else {
					this.setState({error: true, errorMessage: "Something went wrong, try again later", success: false, newHodLoading: false});
				}
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({newHodLoading: false, })
			})
	};
	
	loadDataFromServer = () => {
		this.setState({pageLoading: true});
		
		
		Endpoint.getAllFaculties(true)
			.then((res) => {
				this.setState({allFaculties: res.data, pageLoading: false});
				console.log(res.data, "facs")
				let mappedData = res.data.map((faculty, i) => {
					return{
						sNo: i + 1,
						facultyName:  <span searchvalue={faculty.name} className="capital" >{faculty.name}</span>,
						addedOn: faculty.dateCreated.substring(0,10),
						actions:
							<div>
								<Link to={{pathname:"/schooladmin/departmentHods",
									state:{data:faculty}}}
									  className="btn btn-sm btn-primary">
									<Unicons.UilUsersAlt size="19"/> HODs
								</Link>
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
							label: 'School Name',
							field: 'facultyName',
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
				
				this.setState({newFaculties: tableData});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		
		Endpoint.getAllDepartments()
			.then((res) => {
				this.setState({allDepartments: res.data, pageLoading: false});
				
				let mappedData = res.data.map((department, i) => {
					return{
						sNo: i + 1,
						departmentName: <span className="capital">{department.name}</span>,
						addedOn: format(new Date(department.dateCreated), "dd-MM-yyyy"),
						actions:
							<div>
								<button className="btn btn-sm btn-outline-primary"
										onClick={() => this.openEditDepartment(department)}>
									<Unicons.UilEditAlt size="19"/> Edit
								</button>
								
								<button className="btn btn-sm btn-outline-danger"
										onClick={() => this.openDeleteDepartment(department)}>
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
		
		Endpoint.getAllRoles()
			.then((res) => {
				this.setState({allRoles: res.data, pageLoading: false});
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
					<div>
						<div className="d-flex">
							<h1 className="mb-3 mr-2 text-primary my-auto">
								<Unicons.UilUserCircle size="26" className="mr-2"/>
								Heads of Department
							</h1>
							
							<a className="mb-0 my-auto"
							   data-for="main"
							   data-tip="Hello"
							   data-iscapture="true"
							>
								<Unicons.UilInfoCircle size="22" className="mr-2"/>
							</a>
							<ReactTooltip id="main" type="dark" effect="float" place="right">
								<span>Select a faculty to view its HODs.</span>
							</ReactTooltip>
						</div>
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
						sortRows={['name']}

					/>
				</div>
				
				<Modal isOpen={this.state.newHod} toggle={this.toggleNewHod} className="mt-5 md" size="lg">
					<form onSubmit={(e) => this.createHod(e)}>
						<ModalHeader toggle={this.toggleNewHod}>
							<span className="h2">Add New HOD</span>
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
								
								<div className="col-md-6">
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
								
								<div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>Email:</b>
									</label>
									
									<input id="email" type="email" className="form-control"
										   value={this.state.newEmail}
										   onChange={(e) => this.setState({
											   newEmail: e.target.value,
										   }) }
									/>
									
									{this.state.newHodFormIncomplete ?
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
								Add HOD
								{
									this.state.newHodLoading ?
										<span className="ml-2">
											<ClipLoader size={20} color={"#fff"}
												Loading={this.state.newHodLoading}/>
										</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewHod}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
			
			</>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SchoolAdminHods);