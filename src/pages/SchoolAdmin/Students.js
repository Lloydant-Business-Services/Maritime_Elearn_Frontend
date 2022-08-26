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
import ReactTooltip from "react-tooltip";
import {Link} from "react-router-dom";
import Spinner from '../Front/Spinner';


class SchoolAdminStudents extends Component {
	state = {
		pageLoading: false,
		
		allFaculties: [],
		allDepartments: [],
	};
	
	toggleNewStudents = () => {
		this.setState({newStudents: !this.state.newStudents});
	};
	openNewStudents = () => {
		this.setState({newStudents: true});
	};
	closeNewStudents = () => {
		this.setState({newStudents: false});
	};
	
	newStudentsSuccess = () => toast.success("Students uploaded successfully", {
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
	
	studentFileSelect(e) {
		this.setState({studentFile: e.target.files[0]});
	}
	
	createStudents = (e) => {
		e.preventDefault();
		
		if (!this.state.studentFile) {
			this.setState({newStudentFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newStudentFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({newStudentsLoading: true, success: false, error: false});
		
		const studentProps = new FormData;
		studentProps.append("file", this.state.studentFile);
		
		Endpoint.createStudents(studentProps)
			.then((res) => {
				console.log(res.data);
				if(res.status === 200) {
					this.setState({
						error: false,
						success: true,
						newStudents: false,
						newStudentsLoading: false,
						studentFile: null,
					});
					
					this.newStudentsSuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				}
			})
	};
	
	loadDataFromServer = () => {
		this.setState({pageLoading: true});
		
		Endpoint.getAllFaculties(false)
			.then((res) => {
				this.setState({allFaculties: res.data, pageLoading: false});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		Endpoint.getAllDepartments()
			.then((res) => {
				this.setState({allDepartments: res.data, pageLoading: false});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
	};
	
	componentDidMount() {
		this.loadDataFromServer();
	};
	
	render() {
		return (
			<>
				{this.state.pageLoading ?
					<Spinner message={'Just a moment'}/>
					: null
				}
				
				<Toaster
					position="top-center"
					reverseOrder={false}
				/>
				
				<div className="container-fluid py-5">
					<div className="d-flex flex-wrap justify-content-between">
						<div className="d-flex">
							<h1 className="mb-3 mr-2 text-primary my-auto">
								<Unicons.UilUserCircle size="26" className="mr-2"/>
								Students
							</h1>
							
							<a className="mb-0 my-auto"
							   data-for="main"
							   data-tip="Hello"
							   data-iscapture="true"
							>
								<Unicons.UilInfoCircle size="22" className="mr-2"/>
							</a>
							<ReactTooltip id="main" type="dark" effect="float" place="right">
								<span>Select a department to add students to.</span>
							</ReactTooltip>
						</div>
					</div>
				</div>
				
				<div className="row justify-content-center mt-4">
					<div className="col-lg-9">
						<div className="card">
							<Accordion open={0}>
								{
									this.state.allFaculties.length ?
										this.state.allFaculties.map((faculty, index) => {
											return (
												<Accordion.Item key={faculty.id}>
													<Accordion.Header>
														<div className="d-flex flex-wrap justify-content-between w-100">
															<h3 className="text-center mb-0 text-primary"><Unicons.UilBookAlt size="26" className="mr-2"/>{faculty.name} </h3>
														</div>
													</Accordion.Header>
													
													<Accordion.Body>
														<div className="table-responsive mt-4">
															<table className="table table-hover table-striped">
																<thead>
																<tr>
																	<th>Department Name</th>
																	<th>Actions</th>
																</tr>
																</thead>
																
																<tbody>
																{
																	this.state.allDepartments.length ?
																		this.state.allDepartments.map((department, index) => {
																			return (
																				<>
																					{
																						department.facultyId === faculty.id ?
																							<tr>
																								<td className="capital">{department.name}</td>
																								<td>
																									<Link to={{pathname:"/schooladmin/departmentstudents",
																										state:{data:department}}}
																										  className="btn btn-sm btn-outline-primary">
																										<Unicons.UilEye size="19"/> View Students
																									</Link>
																								</td>
																							</tr>
																							:
																							null
																					}
																				</>
																			
																			)
																		})
																		:
																		<tr>
																			<td colSpan="2" className="text-center">No departments in this faculty.</td>
																		</tr>
																}
																</tbody>
															</table>
														</div>
													</Accordion.Body>
												</Accordion.Item>
											)
										})
										:
										<p className="text-center">No faculties created yet.</p>
								}
							</Accordion>
						</div>
					</div>
				</div>
			</>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SchoolAdminStudents);