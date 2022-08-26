import React, {Component, createContext} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import moment from "../pages/Student/LiveLectures";
import Endpoint from "../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import * as Unicons from "@iconscout/react-unicons/index";

export const CompleteProfileContext = createContext();

class CompleteProfileContextProvider extends Component{
	state = {
		user: [],
		profileIncomplete: false,
		
		email: '',
		phone: '',
		password: '',
		confirm_password: '',
		completeProfileLoading: false,
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
	
	generalError = (error) => toast.error(error, {
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
	
	
	completeProfile = (e) => {
		e.preventDefault();
		
		if (!this.state.email || !this.state.phone || !this.state.password || !this.state.confirm_password) {
			this.setState({error: true, errorMessage: "Please fill in all fields"});
			
			setTimeout(() => {
				this.setState({error: false, errorMessage: ''})
			}, 3000);
			
			return
		}
		
		this.setState({completeProfileLoading: true});
		
		let profileProps = {
			email: this.state.email,
			phoneNumber: this.state.phone,
			userId: this.state.user.userId
		};
		
		console.log(profileProps);
		
		Endpoint.updateUserProfile(profileProps)
			.then((res) => {
				console.log(res.data);
				this.setState({completeProfileLoading: false});
				this.generalSuccess("Successfuly updated profile", this)
			})
			.catch((error) => {
				this.generalError("Something went wrong, pls try again: " + error.statusText, this);
				this.setState({editProfileLoading: false, completeProfileLoading: false})
			});
	};
	
	loadDataFromServer = () => {
		if (localStorage.getItem('user')) {
			let user = JSON.parse(localStorage.getItem('user'));
			console.log(user);
			
			Endpoint.getUserProfile(user.userId)
				.then((res) => {
					// console.log(res.data);
					if (res.data.isUpdatedProfile) {
						this.setState({
							profileIncomplete: false,
							user: res.data,
							email: res.data.person.email,
							phone: parseInt(res.data.person.phoneNo),
						})
					} else {
						this.setState({profileIncomplete: true})
					}
				})
				.catch((error) => {
					this.loadDataError(error, this);
					this.setState({pageLoading: false});
				});
		}
		
	};
	
	componentDidMount() {
		this.loadDataFromServer()
	}
	
	render () {
		return (
			<CompleteProfileContext.Provider value={{...this.state}}>
				<Toaster
					position="top-center"
					reverseOrder={false}
				/>
				
				{
					this.state.profileIncomplete ?
						<Modal size="lg" isOpen="true" className="mdal" backdrop="false">
							<form onSubmit={(e) => this.completeProfile(e)}>
								<ModalHeader className="border-bottom">
									<h3 className="mb-0"> Complete Your Profile</h3>
								</ModalHeader>
								
								<ModalBody>
									<div className="row">
										<div className="col-md-6 mb-1">
											<label className="text-sm">Email Address</label>
											<input type="email" className="form-control" name="email" value={this.state.email}
												   onChange={(e) => this.setState({
													   email: e.target.value,
												   })}
											/>
										</div>
										
										<div className="col-md-6 mb-1">
											<label className="text-sm">Phone Number</label>
											<input type="number" className="form-control" name="phone" value={this.state.phone}
												   onChange={(e) => this.setState({
													   phone: e.target.value,
												   })}
											/>
										</div>
										
										<div className="col-md-6 mb-1">
											<label className="text-sm">Password</label>
											<input type="password" className="form-control" name="password" value={this.state.password}
												   onChange={(e) => this.setState({
													   password: e.target.value,
												   })}
											/>
										</div>
										
										<div className="col-md-6 mb-1">
											<label className="text-sm">Confirm Password</label>
											<input type="password" className="form-control" name="confirm_password" value={this.state.confirm_password}
												   onChange={(e) => this.setState({
													   confirm_password: e.target.value,
												   })}
											/>
										</div>
									</div>
									
									<div className="col-md-12 mt-3">
										
										{this.state.error ?
											<div className="bg-danger border-rad-full text-center p-2 mb-3">
												<p className="small text-white mb-0">
													<Unicons.UilBell size="20"/> {this.state.errorMessage}
												</p>
											</div>
											: null
										}
									</div>
								</ModalBody>
								<ModalFooter className="border-top">
									<button className="btn btn-primary">
										Submit
										{
											this.state.completeProfileLoading ?
												<span className="ml-2">
													<ClipLoader size={20} color={"#fff"} Loading={this.state.completeProfileLoading}/>
												</span>
												:
												null
										}
									</button>
								</ModalFooter>
							</form>
						</Modal>
						:
						null
				}
				
			</CompleteProfileContext.Provider>
		)
	}
}

export default CompleteProfileContextProvider