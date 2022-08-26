import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import * as Unicons from '@iconscout/react-unicons';
import Endpoint, {baseContentURL} from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Link} from "react-router-dom";
import moment from "moment";
import Spinner from "../Front/Spinner"


class StudentQuiz extends Component {
	state = {
		pageLoading: false,
		thisAssignment: [],
		
		submissionFormIncomplete: false,
		submissionLoading: false,
		
		submissionText: '',
		submissionLink: '',
		submissionFile: null,
		
		promptSubmit: false,
		
		submitted: false,
		submission: [],
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
	
	submissionSuccess = () => toast.success("Answer submitted successfully", {
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
	
	assignmentPublished = () => toast.success("This assignment has already been published", {
		style: {
			border: '1px solid #56b39d',
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
	
	submissionFileSelect = (e) => {
		this.setState({submissionFile: e.target.files[0]});
		console.log(e.target.files[0])
	};
	
	promptSubmit = (e) => {
		e.preventDefault();
		
		if (!this.state.submissionText && !this.state.submissionFile && !this.state.submissionLink) {
			this.setState({submissionFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({submissionFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		if (this.state.submissionFile && this.state.submissionFile.size > 1024000) {
			this.setState({error: true, errorMessage: "File size cannot exceed 1MB"});
			
			setTimeout(() => {
				this.setState({error: false, errorMessage: ""});
			}, 3000);
			return;
		}
		
		
		this.setState({promptSubmit: true})
	};
	
	togglePromptSubmit = () => {
		this.setState({promptSubmit: !this.state.promptSubmit})
	};
	
	submitAssignment = (e) => {
		e.preventDefault();
		this.setState({submissionLoading: true});
		
		let SubmissionProps = new FormData;
		SubmissionProps.append("StudentUserId", this.state.user.userId);
		SubmissionProps.append("QuizId", this.state.thisAssignment.quizId);
		
		if (this.state.submissionText) {
			SubmissionProps.append("QuizInText", this.state.submissionText);
		}
		
		if (this.state.submissionLink) {
			SubmissionProps.append("QuizHostedLink", this.state.submissionLink);
		}
		
		if (this.state.submissionFile) {
			SubmissionProps.append("QuizUpload", this.state.submissionFile);
		}
		
		Endpoint.submitStudentQuiz(SubmissionProps)
			.then((res) => {
				console.log(res.data);
				console.log(SubmissionProps);
				if (res.data.statusCode === 208) {
					this.assignmentPublished();
				} else {
					this.setState({submissionLoading: false, promptSubmit: false});
					this.submissionSuccess();
					
					setTimeout(() => {
						this.reloadDataFromServer()
					}, 2000);
				}
				
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({submissionLoading: false, })
			});
	};
	
	reloadDataFromServer = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({pageLoading: true, user: user, thisAssignment: this.props.location.state.data});
		
		let queryProps = {
			assignmentId: this.state.thisAssignment.quizId,
			studentId: user.userId
		};
		
		Endpoint.getStudentAssignmentSubmission(queryProps)
			.then((res) => {
				console.log(res.data);
				this.setState({pageLoading: false});
				if (res.data.dateSubmitted) {
					this.setState({submitted: true, submission: res.data})
				}
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, })
			});
	};
	
	loadDataFromServer = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({pageLoading: true, user: user, thisAssignment: this.props.location.state.data});
		
		console.log(this.props.location.state.data);
		let queryProps = {
			assignmentId: this.props.location.state.data.quizId,
			studentId: user.userId
		};
		
		Endpoint.getStudentQuizSubmission(queryProps)
			.then((res) => {
				console.log(res.data, "Date submitted");
				this.setState({pageLoading: false});
				if (res.data.dateSubmitted) {
					this.setState({submitted: true, submission: res.data});
				}
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
								 {this.state.pageLoading ? <Spinner message={"Just a moment"} /> : null}

				
				<Toaster
					position="top-center"
					reverseOrder={false}
				/>
				
				<div className="container-fluid py-5">
					<div className="">
						<h1 className="mb-3 text-primary">
							<Unicons.UilPen size="24" className="mr-1"/>
							{this.state.thisAssignment.quizName} | <span className="h2">{this.state.thisAssignment.courseTitle}</span>
						</h1>
					</div>
					
					<hr className="my-3"/>
					
					<div className="row">
						<div className="col-md-12 col-lg-4">
							<div className="card bg-custom-light">
								<div className="card-body">
									<p className="mb-3">
										<span className="font-weight-600">Instructions: </span>
										<span className="small">
											Answer All
										</span>
									</p>
									
									<p className="my-1 small mb-2 text-success">
										<Unicons.UilCheckCircle size="18"/>
										<span className="font-weight-bold">Max Score: </span>
										<span className="text-dark">{this.state.thisAssignment.maxScore}</span>
									</p>
									
									<p className="mt-1 small mb-0 text-danger">
										<Unicons.UilCalendarAlt size="18"/>
										<span className="font-weight-bold text-danger">Due On: </span>
										<span className="text-dark">{moment(this.state.thisAssignment.dueDate).format('lll')}</span>
									</p>
								</div>
							</div>
						</div>
						
						<div className="col-md-12 col-lg-8 col-xl-6 mt-4 mt-lg-0">
							
							{
								this.state.submitted ?
									<div>
										<h4 className="font-weight-700">Scores: &nbsp;
											<span className="font-weight-500">
												{
													this.state.submission && this.state.submission.isPublished ?
														this.state.submission.score
														:
														<span className="badge badge-primary badge-dark">
															Unpublished
														</span>
												}
											</span>
										</h4>
										
										<div className="row">
											{
												this.state.submission && this.state.submission.quizInTextSubmission ?
													<div className="col-md-12 my-3">
														<label className="small font-weight-600">Answer in Text</label>
														<textarea cols="30" rows="3" className="form-control"
																  placeholder="Answer in text"
																  value={this.state.submission.quizInTextSubmission}
																  readOnly>
														</textarea>
													</div>
													:
													null
											}
											
											{/* {
												this.state.submission && this.state.submission.assignmentSubmissionHostedLink ?
													<div className="col-md-12 mb-3">
														<a href={this.state.submission.assignmentSubmissionHostedLink} target="_blank">
															<p className="font-weight-600 mb-0 small">
															Assignment Submission Link <Unicons.UilExternalLinkAlt size="20"/>
															</p>
														</a>
													</div>
													:
													null
											} */}
											
											{/* {
												this.state.submission && this.state.submission.assignmentSubmissionUploadLink ?
													<div className="col-md-12 mb-3">
														<a href={this.state.submission.assignmentSubmissionUploadLink} target="_blank">
															<p className="font-weight-600 mb-0 small">
																File Submission Link <Unicons.UilExternalLinkAlt size="20"/>
															</p>
														</a>
													</div>
													:
													null
											} */}
											
										</div>
									</div>
									:
									<div>
										<h3>My Submission</h3>
										
										<form onSubmit={(e) => this.promptSubmit(e)}>
											<div className="row">
												<div className="col-md-12 mb-3">
										<textarea cols="30" rows="5" className="form-control" placeholder="Answer in text" value={this.state.submissionText}
												  onChange={(e) => this.setState({ submissionText: e.target.value }) }>
										</textarea>
												</div>
												
												{/* <div className="col-md-6 mb-3 mb-md-0">
													<label className="mt-2 mr-2 ">
														<b>Submission Link: </b>
													</label>
													
													<input type="text" className="form-control" placeholder="Hosted Link" value={this.state.submissionLink}
														   onChange={(e) => this.setState({ submissionLink: e.target.value }) }/>
												</div> */}
												
												{/* <div className="col-md-6">
													<label className="mt-2 mr-2 ">
														<b>File Submission: <span className="text-danger small">PDF, docx, txt</span></b>
													</label>
													
													<input type="file" className="form-control" accept="application/pdf, application/docx, application/txt"
														   onChange={e => { this.submissionFileSelect(e) }}/>
												</div> */}
												
												{/* <div className="col-md-6 mt-3">
													{this.state.submissionFormIncomplete ?
														<div className="bg-danger border-rad-full text-center p-2 my-2">
															<p className="small text-white mb-0">
																<Unicons.UilExclamationCircle size="20"/> Please provide an answer format.
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
												</div> */}
											</div>
											
											<button className="btn btn-primary">
												Submit Answer
											</button>
										</form>
									</div>
							}
							
						</div>
					</div>
				</div>
				
				<Modal isOpen={this.state.promptSubmit} toggle={this.togglePromptSubmit} className="mt-5 md" size="sm">
					<form onSubmit={(e) => this.submitAssignment(e)}>
						<ModalHeader toggle={this.togglePromptSubmit}>
							<span className="h2">Submit Answer</span>
						</ModalHeader>
						
						<ModalBody>
							<h3 className="text-center">Are You Sure?</h3>
							<p className="text-center">You cannot change your submission afterwards.</p>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Submit
								{
									this.state.submissionLoading?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.submissionLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.togglePromptSubmit}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
			</>
		)
	}
}

export default StudentQuiz