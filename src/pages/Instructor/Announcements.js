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
import Spinner from "../Front/Spinner"


class InstructorAnnouncements extends Component {
	state = {
		pageLoading: false,
		allAnnouncements: [],
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
		this.setState({pageLoading: true, user: user,});
		
		Endpoint.getUserProfile(user.userId)
			.then((res) => {
				this.setState({profile: res.data});
				
				Endpoint.getAnnouncements(res.data.department.id)
					.then((res2) => {
						console.log(res2.data);
						this.setState({allAnnouncements: res2.data, pageLoading: false,});
					})
					.catch((error) => {
						this.loadDataError(error, this);
						this.setState({pageLoading: false, })
					});
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
						<h1 className="mb-3 text-primary "> Departmental Announcements </h1>
						
					</div>
					
					<hr className="my-3"/>
					
					<div className="row mt-5">
						<div className="col-lg-9">
							{
								this.state.allAnnouncements && this.state.allAnnouncements.length ?
									this.state.allAnnouncements.map((announcement, index) => {
										return (
											<div>
												<div className="d-flex">
													<div className="flex-shrink-0">
														<div className="px-3 py-1 bg-custom-light2 br-5rem">
															<h4 className="text-custom mb-1"><Unicons.UilEnvelopes size="25"/></h4>
														</div>
													</div>
													
													<div className="flex-grow-1 ml-3">
														<h3 className="fw-500 text-custom fw-bold">{announcement.title}</h3>
														<p className="mb-2">
															{announcement.message}
														</p>
														{/*<small className="fw-600">Read more...</small>*/}
													</div>
												</div>
												
												<hr className="my-3"/>
											
											</div>
										)
									})
									:
									<p className="font-weight-bold text-center">No announcements available yet.</p>
							}
						</div>
					</div>
				</div>
				
			</>
		)
	}
}

export default InstructorAnnouncements