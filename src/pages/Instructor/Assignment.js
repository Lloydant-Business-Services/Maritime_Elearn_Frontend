import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import published from "../../assets/images/download.png"
import pending from "../../assets/images/pendd.png"
import pending2 from "../../assets/images/pend2.jpeg"
import publishedIcon from "../../assets/images/publishedIcon.png"
import rrr from "../../assets/images/rrr.png"
import Spinner from "../Front/Spinner"



import * as Unicons from '@iconscout/react-unicons';
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Link} from "react-router-dom";
import {baseContentURL} from "../../utils/endpoint";
import moment from "moment";


class InstructorAssignment extends Component {
	state = {
		pageLoading: false,
		thisAssignment: [],
		submissions: [],
		
		publishLoading: false,
		promptPublish: false,
		extendDeadline: false,
		
		newDate: '',
	};
	
	togglePromptPublish = () => {
		this.setState({promptPublish: !this.state.promptPublish})
	};
	openPromptPublish = () => {
		this.setState({promptPublish: true})
	};
	
	openExtendDeadline = () => {
		this.setState({extendDeadline: true})
	};
	toggleExtendDeadline = () => {
		this.setState({extendDeadline: !this.state.extendDeadline})
	};
	
	extendDeadline = (e) => {
		e.preventDefault();
		
		if (!this.state.newDate) {
			this.setState({error: true, errorMessage: "Please select a date"});
			
			setTimeout(() => {
				this.setState({error: false, errorMessage: ""});
			}, 3000);
			
			return;
		}
		
		if (moment(this.state.newDate).isBefore()) {
			console.log('before');
			this.setState({error: true, errorMessage: "Due Date cannot be in the past"});
			
			setTimeout(() => {
				this.setState({error: false, errorMessage: ""});
			}, 3000);
			
			
			return;
		}
		
		let extendProps = {
			assignmentId: this.state.thisAssignment.assignmentId,
			dueDate: this.state.newDate
		};
		this.setState({extendLoading: true});
		
		Endpoint.extendAssignmentDueDate(extendProps)
			.then((res) => {
				console.log(res.data);
				
				this.generalSuccess("Successfully set a new Due Date");
				this.setState({newDate: '', extendLoading: false, extendDeadline: false});
				
				setTimeout(() => {
					this.loadDataFromServer()
				}, 2000);
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, extendLoading: false});
			})
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
	
	publishAssignmentSuccess = () => toast.success("Scores published successfully", {
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
	
	generalSuccess = (message) => toast.success(message, {
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
	
	publishAssignment = (e) => {
		e.preventDefault();
		
		this.setState({publishLoading: true});
		
		let publishProps = {
			assignmentId: this.state.thisAssignment.assignmentId,
			publish: true
		};
		console.log(publishProps);
		
		Endpoint.publishAssignmentScores(publishProps)
			.then((res) => {
				console.log(res.data);
				this.setState({publishLoading: false, promptPublish: false});
				this.publishAssignmentSuccess();
				
				this.loadDataFromServer()
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({newTopicLoading: false, })
			});
	};
	
	loadDataFromServer = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({pageLoading: true, user: user, thisAssignment: this.props.location.state.data});
		
		console.log(this.props.location.state.data);
		
		Endpoint.getAssignment(this.props.location.state.data.assignmentId)
			.then((res) => {
				console.log(res.data);
				this.setState({thisAssignment: res.data, pageLoading: false,});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, })
			});

		Endpoint.getAssignmentSubmissions(this.props.location.state.data.assignmentId)
			.then((res) => {
				console.log(res.data);
				this.setState({submissions: res.data, pageLoading: false,});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, })
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
							<Unicons.UilPen size="24" className="mr-1"/>
							{this.state.thisAssignment.assignmentName} <small style={{fontSize:"13px"}}>(Assignment)</small> | <span className="h2 mr-2">{this.state.thisAssignment.courseTitle}</span>
							{
								this.state.thisAssignment.isPublished ?
									
									<>
									&nbsp;&nbsp; |&nbsp; <span style={{fontSize:"14px"}}>Published</span><img src={rrr} style={{width:"50px"}}/> &nbsp;
									 </>
									:
									// <span className="badge badge-warning badge-pill text-sm">Pending</span>
									<>
										{/* &nbsp;&nbsp; |&nbsp; <span style={{fontSize:"14px"}}>Published</span><img src={rrr} style={{width:"50px"}}/> &nbsp; */}
										&nbsp;&nbsp; |&nbsp; <span style={{fontSize:"14px"}}>Publish Status:</span><img src={pending2} style={{width:"93px"}}/> &nbsp; 
										
									</>

							}
							
						</h1>
						
						<p className="mt-3 mt-md-auto mb-0">{this.state.submissions.length} Submission(s)</p>
					</div>
					
					<hr className="my-3"/>
					
					<div className="my-4">
						<div className="row">
							<div className="col-lg-5">
								<div className="card bg-custom-light">
									<div className="card-body">
										<div className="mb-4" style={{fontSize:"14px"}}>
											<span className="font-weight-600">Instructions: </span>
											{this.state.thisAssignment.assignmentInstruction}
										</div>
										
										<div className="mb-4" style={{fontSize:"14px"}}>
											<span className="font-weight-600 mt-4">Max Score: </span>
											{this.state.thisAssignment.maxScore}
										</div>
										
										<div className="mb-4" style={{fontSize:"14px"}}>
											<span className="font-weight-600">Set On: </span>
											{moment(this.state.thisAssignment.setDate).format("lll")}
										</div>
										
										<div className="mb-1" style={{fontSize:"14px"}}>
											<span className="font-weight-600" style={{color:"#b52828"}}>Due On: </span>
											<p style={{color:"#b52828"}} className="mr-3 d-inline">{moment(this.state.thisAssignment.dueDate).format("lll")}</p>
											
											<button className="btn btn-sm btn-outline-dark" onClick={this.openExtendDeadline}>Extend deadline</button>
										</div>
									
									</div>
								</div>
							</div>
							
							<div className="col-lg-7">
								<div className="card-body">
									<div className="mb-4">
										<span className="font-weight-600">Question Text: </span>
										{this.state.thisAssignment.assignmentInText}
									</div>
									
									{
										this.state.thisAssignment.assignmentUploadLink ?
											<div className="mb-4">
												<a href={this.state.thisAssignment.assignmentUploadLink}
												   target="_blank"  className="font-weight-600">
													Upload Link <Unicons.UilExternalLinkAlt size="15"/>
												</a>
											</div>
											: null
									}
									
									{
										this.state.thisAssignment.assignmentVideoLink ?
											<div className="mb-4">
												<a href={this.state.thisAssignment.assignmentVideoLink} target="_blank" className="font-weight-600">
													Video Link <Unicons.UilExternalLinkAlt size="15"/>
												</a>
											</div>
											: null
									}
									
									{
										!this.state.thisAssignment.isPublished ?
											<button className="btn btn-primary btn-round" style={{background:"#2a7163", border:"none"}}
													onClick={this.openPromptPublish}>Publish Scores</button>
											:
											null
									}
									
								</div>
							</div>
						</div>
					</div>
					
					<div className="table-responsive">
						<table className="table ">
							<thead>
							<tr>
								<th>S/No</th>
								<th>Student Name</th>
								<th>Matric Number</th>
								<th>Submitted On</th>
								<th>Actions</th>
							</tr>
							</thead>
							<tbody>
							{
								this.state.submissions && this.state.submissions.length > 0 ?
									this.state.submissions.map((submission, index) => {
										return (
											<tr key={index}>
												<td>{index+1}</td>
												<td>{submission.studentName}</td>
												<td>{submission.matricNumber}</td>
												<td>{moment(submission.dateSubmitted).format('lll')} {submission.lateSubmission ? <>&nbsp; <span className='badge badge-danger'>Late submission</span></> : null}</td>
												<td>
													<Link to={{pathname:"/instructor/assignmentsubmission", state:{data:submission}}}>
														<button className="btn btn-outline-primary btn-sm">Open Submission</button>
													</Link>
												</td>
											</tr>
										)
									})
									:
									<tr>
										<td colSpan="5"> <p className="text-center">No submissions yet.</p></td>
									</tr>
							}
							</tbody>
						</table>
					</div>
				</div>
				
				
				<Modal isOpen={this.state.extendDeadline} toggle={this.toggleExtendDeadline} className="mt-5 md" size="sm">
					<form onSubmit={(e) => this.extendDeadline(e)}>
						<ModalHeader toggle={this.toggleExtendDeadline}>
							<span className="h2">Change Deadline</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="row">
								<div className="col-md-12 mb-1">
									<label className="text-sm">New Date</label>
									<input type="date" className="form-control" name="email" value={this.state.newDate}
										   onChange={(e) => this.setState({
											   newDate: e.target.value,
										   })}
									/>
								</div>
								
								<div className="col-md-12 mt-2">
									{this.state.error ?
										<div className="bg-danger border-rad-full text-center p-2 mb-1">
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
								Submit
								{
									this.state.extendLoading?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.extendLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleExtendDeadline}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
				
				
				<Modal isOpen={this.state.promptPublish} toggle={this.togglePromptPublish} className="mt-5 md" size="sm">
					<form onSubmit={(e) => this.publishAssignment(e)}>
						<ModalHeader toggle={this.togglePromptPublish}>
							<span className="h2">Publish Scores</span>
						</ModalHeader>
						
						<ModalBody>
							<h3 className="text-center">Are You Sure?</h3>
							<p className="text-center">You cannot make changes after scores have been published.</p>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Publish
								{
									this.state.publishLoading?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.publishLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.togglePromptPublish}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
			</>
		)
	}
}

export default InstructorAssignment