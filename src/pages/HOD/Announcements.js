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


class HODAnnouncements extends Component {
	state = {
		pageLoading: false,
		
		newAnnouncement: false,
		newAnnouncementName: '',
		newAnnouncementText: '',
		newAnnouncementLoading: false,
	};
	
	toggleNewAnnouncement = () => {
		this.setState({newAnnouncement: !this.state.newAnnouncement})
	};
	
	openNewAnnouncement = () => {
		this.setState({newAnnouncement: true})
	};
	
	announcementSuccess = () => toast.success("Announcement created successfully", {
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
	
	createAnnouncement = (e) => {
		e.preventDefault();
		
		if (!this.state.newAnnouncementName || !this.state.newAnnouncementText ) {
			this.setState({newAnnouncementFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newAnnouncementFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({newAnnouncementLoading: true});
		
		const AnnouncementProps = {
			title: this.state.newAnnouncementName,
			message: this.state.newAnnouncementText,
			userId: this.state.user.userId,
			departmentId: this.state.profile.department.id,
			active: true,
		};
		
		Endpoint.createAnnouncement(AnnouncementProps)
			.then((res) => {
				console.log(res.data);
				this.setState({newAnnouncementLoading: false, newAnnouncement: false});
				this.setState({newAnnouncementName: '', newAnnouncementText: '', });
				
				this.announcementSuccess();
				
				setTimeout(() => {
					this.loadDataFromServer();
				}, 2000);
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({newAnnouncementLoading: false, })
			});
	};
	
	loadDataFromServer = () => {
		let user = JSON.parse(localStorage.getItem('user'));
		this.setState({pageLoading: true, user: user,});
		
		Endpoint.getUserProfile(user.userId)
			.then((res) => {
				this.setState({profile: res.data, pageLoading: false,});
				
				Endpoint.getAnnouncements(res.data.department.id)
					.then((res2) => {
						console.log(res2.data);
						this.setState({allAnnouncements: res2.data});
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
					<div className="d-flex flex-wrap justify-content-between">
						<h1 className="mb-3 text-primary "> Departmental Announcements </h1>
						
						<div>
							<button className="btn btn-primary" onClick={this.openNewAnnouncement}>
								<Unicons.UilPlus size="20"/> New Announcement
							</button>
						</div>
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
													<div className="px-3 py-1 bg-custom-light2 br-10">
														<h4 className="text-custom mb-1"><Unicons.UilEnvelopes size="25"/></h4>
													</div>
												</div>
												
												<div className="flex-grow-1 ml-3">
													<h3 className="fw-500 text-custom fw-bold">{announcement.title}</h3>
													<p className="mb-2">
														{announcement.message}
													</p>
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
				
				<Modal isOpen={this.state.newAnnouncement} toggle={this.toggleNewAnnouncement} className="mt-5 md" >
					<form onSubmit={(e) => this.createAnnouncement(e)}>
						<ModalHeader toggle={this.toggleNewAnnouncement}>
							<span className="h2">Add New Announcement</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group row">
								<div className="col-md-12">
									<label className="mt-2 mr-2 ">
										<b>Announcement Title:</b>
									</label>
									
									<input id="tName" type="text" className="form-control"
										   value={this.state.newAnnouncementName}
										   onChange={(e) => this.setState({
											   newAnnouncementName: e.target.value,
										   }) }
									/>
								</div>
								
								<div className="col-md-12">
									<label className="mt-3 mr-2 ">
										<b>Announcement Text:</b>
									</label>
									
									<textarea cols="30" rows="5" className="form-control"
											  value={this.state.newAnnouncementText}
											  onChange={(e) => this.setState({
												  newAnnouncementText: e.target.value,
											  }) }
										>
									</textarea>
								</div>
								
								<div className="col-12 mt-3">
									{this.state.newAnnouncementFormIncomplete ?
										<div className="bg-danger border-rad-full text-center p-2 mt-3 mb-0">
											<p className="small text-white mb-0">
												<Unicons.UilExclamationCircle size="20"/> Please provide an announcement title and content.
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
								Add Announcement
								{
									this.state.newAnnouncementLoading ?
										<span className="ml-2">
											<ClipLoader size={20} color={"#fff"} Loading={this.state.newAnnouncementLoading}/>
										</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewAnnouncement}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
			
			</>
		)
	}
}

export default HODAnnouncements