import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import ATMCARD from "../../assets/images/recc.gif"
import * as Unicons from '@iconscout/react-unicons';
import {Modal, ModalBody, ModalFooter, ModalHeader, Button} from "reactstrap";
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Link} from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import Spinner from "../Front/Spinner"
import { faClosedCaptioning } from '@fortawesome/free-solid-svg-icons';


let user = JSON.parse(localStorage.getItem('user'));

class PaymentSuccess extends Component {
	state = {
		pageLoading: true,
		myCourses: [],
		thisCourseLectures: [],
		
		courseLecturesModal: false,
		currentCourseLectures: [],
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
	
	// handleCourseLectures = (course) => {
	// 	this.setState({pageLoading: true, currentCourse: course, courseLecturesModal: true});
	// 	console.log(course);
		
	// 	Endpoint.getCourseMeetings(course.courseId)
	// 		.then((res) => {
	// 			console.log(res.data);
	// 			this.setState({thisCourseLectures: res.data, pageLoading: false})
	// 		})
	// 		.catch((error) => {
	// 			this.loadDataError(error, this);
	// 			this.setState({pageLoading: false});
	// 		});
		
	// };
    updateLocalStorage = () => {
     
            let storageLocal = localStorage.getItem("user");
            let parsedStorage = JSON.parse(storageLocal);
            parsedStorage.paymentCheck = 1;
            localStorage.removeItem("user");
            setTimeout(() => {
                localStorage.setItem("user", JSON.stringify(parsedStorage));
                console.log(parsedStorage, "parsed");
            }, 2000);
        
    };
	loadDataFromServer = () => {


        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const trfx = urlParams.get('reference')

		// this.setState({pageLoading: true, user: user});
		
		Endpoint.updateTransaction(trfx)
			.then((res) => {
                this.updateLocalStorage()
				this.setState({pageLoading: false});
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
	};
	
	
	componentDidMount() {
        setTimeout(() => {
		this.loadDataFromServer()
        }, 3000);
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
				
				
				
				
				<div className="container-fluid py-5">
					
					
					<center style={{marginTop:"-70px"}}>
                        <div className='row'>
                            <div className='col-sm-12'>
                            <img src={ATMCARD} style={{width:"35%"}}/>
                        {/* <p style={{marginTop:"-150px"}}>Hi {user.fullName}, </p> */}
                            </div>
                            <div className='col-sm-12' style={{marginTop:"-40px"}}>
                            <p style={{marginTop:"-10px", fontSize:"22px", color:"#100c39bd"}}>Your payment was processed successfully.</p>
                            <Link to={"/student/dashboard"}>
                            <button  className='btn btn-primary'>Continue to dashboard</button>
                            </Link>
                            </div>
                            
                        </div>
                      

                    </center>
					
					
				
				</div>
				
			
			</>
		)
	}
	
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess);
