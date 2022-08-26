import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import * as Unicons from '@iconscout/react-unicons';
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Link} from "react-router-dom";
import moment from "moment";
import Spinner from "../Front/Spinner"


class InstructorAssignmentSubmission extends Component {
	state = {
		pageLoading: false,
		thisSubmission: [],
		
		gradeModal: false,
		score: null,
		remark: '',
		submitGradeFormIncomplete: false,
		submissionLoading: false,
	};
	
	openGradeModal = () => {
		this.setState({gradeModal: true})
	};
	
	toggleGradeModal = () => {
		this.setState({gradeModal: !this.state.gradeModal});
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
	
	gradeSuccess = () => toast.success("Assignment graded successfully", {
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
	
	gradeSubmission = (e) => {
		e.preventDefault();
		if (!this.state.score) {
			this.setState({submitGradeFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({submitGradeFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({submissionLoading: true, success: false, error: false});
		
		let gradeProps = {
			assignmentSubmissionId: this.state.thisSubmission.assignmentSubmissionId,
			score: parseInt(this.state.score),
			remark: this.state.remark !== '' ? this.state.remark : null
		};
		console.log( gradeProps);
		
		Endpoint.gradeAssignmentSubmission(gradeProps)
			.then((res) => {
				console.log(res.data);
				this.setState({submissionLoading: false, success: true, error: false, gradeModal: false});
				
				this.gradeSuccess();
				
				setTimeout(() => {
					this.loadDataFromServer()
				}, 2000);
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({newTopicLoading: false, })
			});
	};
	
	loadDataFromServer = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({pageLoading: true, user: user});
		
			console.log(this.props.location.state.data);
			
		Endpoint.getAssignmentSubmissionById(this.props.location.state.data.assignmentSubmissionId)
			.then((res) => {
				console.log(res.data);
				this.setState({thisSubmission: res.data, pageLoading: false});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({newTopicLoading: false, })
			});
		
		// if (!this.props.location.state || !this.props.location.state.data) {
		// 	window.location = '/instructor/dashboard';
		// } else {
		// 	console.log(this.props.location.state.data);
		// 	this.setState({thisSubmission: this.props.location.state.data})
		// }
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
							{
								this.state.thisSubmission && this.state.thisSubmission.studentName ?
									this.state.thisSubmission.studentName
									: null
							} | <span className="h2"> Student submission</span>
						</h1>
						
						<p className="mt-3 mt-md-auto mb-0">Submitted on:
							<span className="font-weight-600">
								{
									this.state.thisSubmission && this.state.thisSubmission.dateSubmitted ?
										moment(this.state.thisSubmission.dateSubmitted).format('lll')
										: "---"
								}
								&nbsp;  {this.props.location.state.data?.lateSubmission ? <>&nbsp; <span className='badge badge-danger'>Late submission</span></> : null}
							</span>
						</p>
					</div>
					
					<hr className="my-3"/>
					
					<div className="row">
						
						<div className="col-md-12 col-lg-8 col-xl-6 mt-4 mt-lg-0">
							
							<div className="row">
								<div className="col-md-12 my-3">
									<label className="small font-weight-600">Answer in Text</label>
									<textarea cols="30" rows="3" className="form-control"
											  placeholder="Answer in text"
											  value={this.state.thisSubmission.assignmentInTextSubmission} readOnly>
									</textarea>
								</div>
								
								{
									this.state.thisSubmission && this.state.thisSubmission.assignmentSubmissionHostedLink ?
										<div className="col-12 mb-2">
											<a href={this.state.thisSubmission.assignmentSubmissionHostedLink} target="_blank" className="mt-2 text-normal">
												<p className="font-weight-600 mb-0">Assignment Submission Link <Unicons.UilExternalLinkAlt size="16"/></p>
											</a>
										</div>
										: null
								}
								
								{
									this.state.thisSubmission && this.state.thisSubmission.assignmentSubmissionUploadLink ?
										<div className="col-12 mb-1">
											<a href={this.state.thisSubmission.assignmentSubmissionUploadLink} target="_blank" className="mt-2 text-normal">
												<p className="font-weight-600 mb-0">Content Link <Unicons.UilExternalLinkAlt size="16"/></p>
											</a>
										</div>
										: null
								}
								
							</div>
							
							{
								this.state.thisSubmission && this.state.thisSubmission.score !== 0 ?
									<div>
										<hr className="my-2"/>
										<h2>
											Score: <span className="text-dark font-weight-700">{this.state.thisSubmission.score}</span>
										</h2>
									</div>
									:
									<button className="btn btn-primary btn-round" onClick={this.openGradeModal}>Grade Submission</button>
							}
							
						</div>
					</div>
				</div>
				
				<Modal isOpen={this.state.gradeModal} toggle={this.toggleGradeModal} className="mt-5 md">
					<form onSubmit={(e) => this.gradeSubmission(e)}>
						<ModalHeader toggle={this.toggleGradeModal}>
							<span className="h2">Submit Answer</span>
						</ModalHeader>
						
						<ModalBody>
							<p className="text-center text-danger small">Ensure the score is correct, it cannot be changed after submission.</p>
							
							<div className="mb-3">
								<label className="font-weight-600">Score: </label>
								<input type="number" max={30} className="form-control" placeholder="Type score here [Max: 30]"
									   value={this.state.score} onChange={(e) => this.setState({ score: e.target.value }) }/>
							</div>
							
							<div>
								<label className="font-weight-600">Remarks <span className="small">(optional)</span>: </label>
								<input type="text" className="form-control" value={this.state.remark}
									   onChange={(e) => this.setState({ remark: e.target.value }) }/>
							</div>
							
							<div className=" mt-3">
								{this.state.submitGradeFormIncomplete ?
									<div className="bg-danger border-rad-full text-center p-2 my-3">
										<p className="small text-white mb-0">
											<Unicons.UilExclamationCircle size="20"/> Please provide a score.
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
							
							<button type="button" className="btn btn-danger" onClick={this.toggleGradeModal}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
			</>
		)
	}
}
export default InstructorAssignmentSubmission
