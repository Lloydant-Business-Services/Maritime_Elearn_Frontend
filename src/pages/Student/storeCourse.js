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
import Spinner from '../Front/Spinner';
import quizGif from "../../assets/images/quizz.gif";
import assignmentsGif from "../../assets/images/assi.gif";
import corsoGif from "../../assets/images/books.gif";


import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import $ from "jquery"
import Typography from "@mui/material/Typography";


class StudentCourse extends Component {
	state = {
		pageLoading: false,
		thisCourse: [],
		courseTopics: [],
		allAssignments: [],
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
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({pageLoading: true, user: user, thisCourse: this.props.location.state.data});

		console.log(this.props.location.state, "Propsss")
		
		Endpoint.getCourseTopics(this.props.location.state.data.courseAllocationId)
			.then((res) => {
				console.log(res.data);
				this.setState({pageLoading: false, courseTopics: res.data})
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false, })
			});
		
		Endpoint.getCourseAssignments(this.props.location.state.data.courseId)
			.then((res) => {
				console.log(res.data);
				this.setState({pageLoading: false, allAssignments: res.data})
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
					<h1 className="mb-3 text-primary">
						<Unicons.UilBookAlt size="24" className="mr-2"/>
						{this.state.thisCourse?.courseCode + " - " + this.state.thisCourse?.courseTitle}
					</h1>
					
					<hr className="my-3"/>
					
					<div className="row">
						<div className="col-lg-6">
							<div className="card bg-custom-light">
								<div className="card-body">
									<h2>Course Topics</h2>
									<hr className="my-2"/>
									
									{
										this.state.courseTopics && this.state.courseTopics.length ?
											this.state.courseTopics.map((topic, index) => {
												return (
													<div className="card bg-white my-2" key={index}>
														<div className="card-body">
															<div className="d-flex flex-wrap justify-content-between mb-2">
																<Link to={{pathname:"/student/coursetopic", state:{data:topic}}}>
																	<h3 className="mr-2 text-primary">{topic.topicName}</h3>
																</Link>
															</div>
															
															<p className="mb-3 small">
																<span className="font-weight-600">Description: </span>
																{topic.topicDescription}
															</p>
															
															<p className="my-1 text-success small">
																<span className="font-weight-bold text-success">Starts: </span> <span className="text-dark">{moment(topic.startDate).format('lll')}</span>
															</p>
															
														</div>
													</div>
												)
											})
											:
											<p className="text-center">No topics available yet.</p>
									}
								
								</div>
							</div>
						</div>
						
						<div className="col-xl-5 col-lg-6 offset-xl-1 mt-4 mt-lg-0">
							<h2>Assignments</h2>
							<hr className="my-2"/>
							
							{
								this.state.allAssignments && this.state.allAssignments.length > 0 ?
									this.state.allAssignments.map((assignment, index) => {
										return (
											<div className="card bg-white border border-primary shadow-none my-3" key={index}>
												<div className="card-body">
													<div className="d-flex flex-wrap justify-content-between mb-2">
														<Link to={{pathname:"/student/assignment", state:{data:assignment}}}>
															<h3 className="mr-2 text-primary">{assignment.assignmentName}</h3>
														</Link>
													</div>
													
													<p className="my-1 small mb-2 text-success">
														<Unicons.UilCheckCircle size="18"/>
														<span className="font-weight-bold">Max Score: </span>
														<span className="text-dark">{assignment.maxScore}</span>
													</p>
													<p className="mt-1 small mb-0 text-danger">
														<Unicons.UilCalendarAlt size="18"/>
														<span className="font-weight-bold text-danger">Due On: </span>
														<span className="text-dark">{moment(assignment.dueDate).format('lll')}</span>
													</p>
												</div>
											</div>
										)
									})
									:
									<p className="text-center">No assignments available yet.</p>
							}
						</div>
					</div>
				</div>
			</>
		)
	}
}

export default StudentCourse