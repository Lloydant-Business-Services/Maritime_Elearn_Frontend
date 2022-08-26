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


class StudentCourseTopic extends Component {
	state = {
		pageLoading: false,
		thisTopic: [],
		topicContent: [],
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
		this.setState({pageLoading: true, user: user, thisTopic: this.props.location.state.data});
		
		Endpoint.getTopicContent(this.props.location.state.data.topicId)
			.then((res) => {
				console.log(res.data);
				this.setState({pageLoading: false, topicContent: res.data})
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
					<div className="">
						<h1 className="mb-3 text-primary">
							{this.state.thisTopic.topicName} | <span className="h2">Topic Content</span>
						</h1>
					</div>
					
					<hr className="my-3"/>
					
					<div className="row">
						{
							this.state.topicContent && this.state.topicContent.length > 0 ?
								this.state.topicContent.map((content, index) => {
									return (
										<div className="col-xl-3 col-lg-4 col-md-6 my-3" key={index}>
											<div className="card bg-custom-light">
												<div className="card-body">
													<h3>{content.contentTitle}</h3>
													
													{
														content.videoLink ?
															<h5>
																<a href={content.videoLink} target="_blank">
																	Video Link <Unicons.UilExternalLinkAlt size="20"/>
																</a>
															</h5>
															: null
													}
													
													{
														content.liveStreamLink ?
															<h5>
																<a href={content.liveStreamLink} target="_blank">
																	Live Stream <Unicons.UilExternalLinkAlt size="20"/>
																</a>
															</h5>
															: null
													}
													
													{
														content.noteLink ?
															<h5>
																<a href={'http://192.169.155.119/elearnv2/' + content.noteLink} target="_blank">
																	Content File <Unicons.UilExternalLinkAlt size="20"/>
																</a>
															</h5>
															: null
													}
												
												</div>
											</div>
										</div>
									)
								})
								:
								<div className="col-12">
									<p className="text-center mt-4">No content available for this topic yet</p>
								</div>
						}
					</div>
				</div>
			</>
		)
		
	}
	
}

export default StudentCourseTopic