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
import { MDBDataTableV5 } from 'mdbreact';
import {Link} from "react-router-dom";
import ReactTooltip from 'react-tooltip';
import Spinner from "../Front/Spinner"


class SchoolAdminInstructors extends Component {
	state = {
		allFaculties: [],
		allDepartments: [],
		pageLoading: false,
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
						<div className="d-flex">
							<h1 className="mb-3 mr-2 text-primary my-auto">
								<Unicons.UilBookAlt size="26" className="mr-2"/>
								Instructors
							</h1>
							
							<a className="mb-0 my-auto"
							   data-for="main"
							   data-tip="Hello<br />multiline<br />tooltip"
							   data-iscapture="true"
							>
								<Unicons.UilInfoCircle size="22" className="mr-2"/>
							</a>
							<ReactTooltip id="main" type="dark" effect="float" place="right">
								<span>Select a department to add instructors to.</span>
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
																									<Link to={{pathname:"/schooladmin/departmentinstructors",
																										state:{data:department}}}
																										  className="btn btn-sm btn-outline-primary">
																										<Unicons.UilEye size="19"/> View Instructors
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
																		<td colSpan="2" className="text-center">No departments in this faculty.</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(SchoolAdminInstructors);