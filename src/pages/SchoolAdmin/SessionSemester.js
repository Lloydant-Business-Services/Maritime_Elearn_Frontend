import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import {Link} from "react-router-dom"
import * as Unicons from '@iconscout/react-unicons';
import Endpoint from "../../utils/endpoint";
import {handleFormSubmissionError} from "../../utils/helpers";
import toast, { Toaster } from 'react-hot-toast';
import ClipLoader from "react-spinners/ClipLoader";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Spinner from '../Front/Spinner';

let user = JSON.parse(localStorage.getItem('user'));

class SchoolAdminSession extends Component {
	state = {
		pageLoading: false,
		currentSession: [],
		
		allSessions: [],
		newSession: false,
		newSessionFormIncomplete: false,
		newSessionName: '',
		newSessionLoading: false,
		
		allSemesters: [],
		newSemester: false,
		newSemesterFormIncomplete: false,
		newSemesterName: '',
		newSemesterLoading: false,
		
		sessionSemesterLoading: false,
		sessionSemesterIncomplete: false,
	};
	
	toggleNewSession = () => {
		this.setState({newSession: !this.state.newSession})
	};
	confirmSessionSemester = () => {
		this.setState({sessionSemesterConfirm: !this.state.sessionSemesterConfirm})
	}
	openNewSession = () => {
		this.setState({newSession: true})
	};
	closeNewSession = () => {
		this.setState({newSession: false})
	};
	
	toggleNewSemester = () => {
		this.setState({newSemester: !this.state.newSemester})
	};
	openNewSemester = () => {
		this.setState({newSemester: true})
	};
	closeNewSemester = () => {
		this.setState({newSemester: false})
	};
	
	newSessionSuccess = () => toast.success("Session added successfully", {
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
	
	newSemesterSuccess = () => toast.success("Semester added successfully", {
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
	
	sessionSemesterSuccess = () => toast.success("Session/Semester set successfully", {
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
	
	createSession = (e) => {
		e.preventDefault();
		
		if (!this.state.newSessionName) {
			this.setState({newSessionFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newSessionFormIncomplete: false});
			}, 2000);
			
			return;
		}
		
		this.setState({
			newSessionLoading: true, success: false, error: false
		});
		
		const sessionProps = {
			name: this.state.newSessionName,
		};
		let sessionSplit;
		if(sessionProps.name.includes("/")){
			sessionSplit = sessionProps.name.split("/");
			if(sessionSplit.length == 2){
				let sessionSecond = sessionSplit[1];
				let incrementForstSessionByOne = parseInt(sessionSplit[0]) + 1
				console.log(sessionSplit[0], incrementForstSessionByOne)

				if(sessionSecond == incrementForstSessionByOne){

				}
				else{
					alert("session must have only a year between them.")
					this.setState({newSessionLoading:false})
					return
				}
			}
			else{
				alert("Invalis session format")
				this.setState({newSessionLoading:false})

			}
			console.log(sessionSplit, "ff");
		}
		else{
			alert("Session format is wrong. Session value must contain a '/' seperator" )
			this.setState({newSessionLoading:false})
			return;
		}
		Endpoint.createSession(sessionProps)
			.then((res) => {
				if(res.status === 200) {
					this.setState({error: false, success: true, newSessionLoading: false, newSession: false, newSessionName: ''});
					
					this.newSessionSuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else {
					this.setState({error: true, errorMessage: "Something went wrong, try again later", success: false, newSessionLoading: false});
				}
			})
			.catch((error) => {
				handleFormSubmissionError(error, this);
				this.setState({newSessionLoading: false, })
			});
	};
	
	createSemester = (e) => {
		e.preventDefault();
		
		if (!this.state.newSemesterName) {
			this.setState({newSemesterFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newSemesterFormIncomplete: false});
			}, 2000);
			
			return;
		}
		
		this.setState({
			newSemesterLoading: true, success: false, error: false
		});
		
		const semesterProps = {
			name: this.state.newSemesterName,
		};
		
		Endpoint.createSemester(semesterProps)
			.then((res) => {
				if(res.status === 200) {
					this.setState({error: false, success: true, newSemesterLoading: false, newSemester: false, newSemesterName: ''});
					
					this.newSemesterSuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else {
					this.setState({error: true, errorMessage: "Something went wrong, try again later", success: false, newSemesterLoading: false});
				}
			})
			.catch((error) => {
				handleFormSubmissionError(error, this);
				this.setState({newSemesterLoading: false, })
			});
	};
	
	setSessionSemester = (e) => {
		e.preventDefault();
		if (!this.state.sessionId || !this.state.semesterId) {
			this.setState({sessionSemesterIncomplete: true,sessionSemesterConfirm: false});
			
			setTimeout(() => {
				this.setState({sessionSemesterIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({
			sessionSemesterLoading: true, success: false, error: false
		});
		
		const sessionSemesterProps = {
			sessionId: this.state.sessionId,
			semesterId: this.state.semesterId,
			userId: user.userId,
			sortOrder:0
		};
		
		Endpoint.setSessionSemester(sessionSemesterProps)
			.then((res) => {
				if(res.status === 200) {
					this.setState({error: false, success: true, sessionSemesterLoading: false, sessionId: '', semesterId: '', sessionSemesterConfirm:false});
					
					this.sessionSemesterSuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} else {
					this.setState({error: true, errorMessage: "Something went wrong, try again later", success: false, sessionSemesterLoading: false});
					
					setTimeout(() => {
						this.setState({error: false});
					}, 3000);
				}
			})
			.catch((error) => {
			handleFormSubmissionError(error, this);
			this.setState({sessionSemesterLoading: false, })
		});
		
	};
	
	loadDataFromServer = () => {
		this.setState({pageLoading: true});
		
		Endpoint.getAllSessions()
			.then((res) => {
				this.setState({allSessions: res.data, pageLoading: false});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		Endpoint.getAllSemesters()
			.then((res) => {
				this.setState({allSemesters: res.data, pageLoading: false});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
		
		Endpoint.getActiveSessionSemester()
			.then((res) => {
				this.setState({currentSession: res.data});
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
						<h1 className="mb-3 mr-2 text-primary my-auto">
							<Unicons.UilClockTen size="26" className="mr-2"/>
							Session & Semester
						</h1>
						
						<span className="badge badge-primary badge-lg my-auto">
							<h5 className="text-primary my-auto">Current: &nbsp;
								{this.state.currentSession.sessionName ? this.state.currentSession.sessionName : "UNSET"}; &nbsp;
								{this.state.currentSession.semesterName ? this.state.currentSession.semesterName : "UNSET"}</h5>
						</span>
					</div>
					
					<hr className="my-2"/>
					
					<div className="row justify-content-center mt-4">
						<div className="col-lg-9">
							<div className="card">
								<div className="card-body">
									<form onSubmit={(e) => {this.setSessionSemester(e)}}>
										<div className="row justify-content-between">
											<div className="col-md-6 border-right">
												<div className="form-group">
													<div className="d-flex flex-wrap mb-sm-3 mb-md-2">
														<label className="mt-2 mr-auto text-left font-weight-600">
															Select Session:
														</label>
													
														<button type="button" onClick={this.openNewSession} className="btn btn-outline-primary btn-sm btn-round my-auto">
															<Unicons.UilPlus size="20" className="mr-1"/>
															Add Session
														</button>
													</div>
													
													<select className="form-control" required
														onChange={(e) => this.setState({sessionId: e.target.value})} >
														<option>Select Current Session</option>
														{
															this.state.allSessions && this.state.allSessions.map((session, index) => {
																return (
																	<option className="form-control" value={session.id} key={session.id}
																			id="sessionInput">
																		{session.name}
																	</option>
																);
														})}
													</select>
												</div>
												
												{this.state.error ?
													<div className="bg-danger border-rad-full text-center p-2 mb-3">
														<p className="small text-white mb-0">
															<Unicons.UilBell size="20"/> {this.state.errorMessage}
														</p>
													</div>
													: null
												}
												
												{
													this.state.sessionSemesterIncomplete ?
														<>
															<div className="bg-danger border-rad-full text-center p-2 mb-3">
																<p className="small text-white mb-0">
																	<Unicons.UilBell size="20"/> Please Select a session and semester.
																</p>
															</div>
														</>
														:
														null
												}
											</div>
											
											<div className="col-md-6">
												<div className="form-group">
													<div className="d-flex flex-wrap  mb-sm-3 mb-md-2">
														<label className="mt-2 mr-auto text-left font-weight-600">
															Select Semester:
														</label>
													
														<button type="button" onClick={this.openNewSemester} className="btn btn-outline-primary btn-sm btn-round my-auto">
															<Unicons.UilPlus size="20" className="mr-1"/>
															Add Semester
														</button>
													</div>
													
													<select className="form-control" required
														onChange={(e) => this.setState({semesterId: e.target.value})} >
														<option>Select Current Semester</option>
														{this.state.allSemesters &&
														this.state.allSemesters.map((semester, index) => {
															return (
																<option className="form-control" value={semester.id} key={semester.id}
																		id="sessionInput">
																	{semester.name}
																</option>
															);
														})}
													</select>
												</div>
											</div>
										</div>
										
										<div className="text-left mt-2">
											<button type="button" className="btn btn-primary" onClick={this.confirmSessionSemester}>
												Set Session & Semester
												{
													this.state.sessionSemesterLoading ?
														<span className="ml-2">
															<ClipLoader size={20} color={"#fff"}
																		Loading={this.state.sessionSemesterLoading}/>
														</span>
														:
														null
												}
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<Modal isOpen={this.state.newSession} toggle={this.toggleNewSession} className="mt-5 md">
					<form onSubmit={(e) => this.createSession(e)}>
						<ModalHeader toggle={this.toggleNewSession}>
							<span className="h2">Add New Session</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group">
								<label className="mt-2 mr-2 ">
									<b>Session Name:</b>
								</label>
								
								<div className="custom-form-alert">
									{this.state.newSessionFormIncomplete ?
										<div className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
											<p className="small text-white mb-0">
												<Unicons.UilExclamationCircle size="20"/> Please enter a session name.
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
										   value={this.state.newSessionName}
										   onChange={(e) => this.setState({
											   newSessionName: e.target.value,
										   }) }
									/>
								</div>
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Add Session
								{
									this.state.newSessionLoading ?
										<span className="ml-2">
											<ClipLoader size={20} color={"#fff"}
														Loading={this.state.newSessionLoading}/>
										</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewSession}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
				
				<Modal isOpen={this.state.newSemester} toggle={this.toggleNewSemester} className="mt-5 md">
					<form onSubmit={(e) => this.createSemester(e)}>
						<ModalHeader toggle={this.toggleNewSemester}>
							<span className="h2">Add New Semester</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group">
								<label className="mt-2 mr-2 ">
									<b>Semester Name:</b>
								</label>
								
								<div className="custom-form-alert">
									{this.state.newSemesterFormIncomplete ?
										<div className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
											<p className="small text-white mb-0">
												<Unicons.UilExclamationCircle size="20"/> Please enter a semester name.
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
										   value={this.state.newSemesterName}
										   onChange={(e) => this.setState({
											   newSemesterName: e.target.value,
										   }) }
									/>
								</div>
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Add Semester
								{
									this.state.newSemesterLoading ?
										<span className="ml-2">
											<ClipLoader size={20} color={"#fff"}
														Loading={this.state.newSemesterLoading}/>
										</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewSemester}>Close</button>
						</ModalFooter>
					</form>
				</Modal>






				<Modal isOpen={this.state.sessionSemesterConfirm} toggle={this.confirmSessionSemester} className="mt-5 md">
					<form onSubmit={(e) => this.setSessionSemester(e)}>
						<ModalHeader toggle={this.confirmSessionSemester}>
							<span className="h2">Confirm Session Semester</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group">
								<label className="mt-2 mr-2 ">
									<b>Are you sure?</b>
								</label>
								
								
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary" 
							// onClick={this.setSessionSemester}
							>
								Set
								{
									this.state.newSessionLoading ?
										<span className="ml-2">
											<ClipLoader size={20} color={"#fff"}
														Loading={this.state.newSessionLoading}/>
										</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.confirmSessionSemester}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
			</>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SchoolAdminSession);
