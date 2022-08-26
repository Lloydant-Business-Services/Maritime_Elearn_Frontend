import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import illustration from "../../assets/images/illus.png"
import ATMCARD from "../../assets/images/atmcard.gif"
import * as Unicons from '@iconscout/react-unicons';
import {Modal, ModalBody, ModalFooter, ModalHeader, Button} from "reactstrap";
import Endpoint from "../../utils/endpoint";
import toast, {Toaster} from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import {Link} from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import Spinner from "../Front/Spinner"
import {Result } from 'antd';
import {nairaFormat} from "../../utils/helpers"

let user = JSON.parse(localStorage.getItem('user'));

class Payment extends Component {
	state = {
		pageLoading: false,
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
	

	executePayment = () => {
		this.setState({pageLoading: true, user: user});
        Endpoint.initializeTransaction(user.userId, this.state.defaultPayment.id)
        .then((res) => {
            //this.setState({responseData: res.data?.data?.authorization_url});
            // console.open(res.data?.data?.authorization_url)
            window.open(res.data?.data?.authorization_url)
            
        })
        .catch((error) => {
            this.loadDataError(error, this);
            this.setState({pageLoading: false});
        });
        

    }
	loadDataFromServer = () => {
		this.setState({pageLoading: true, user: user});
		
		Endpoint.getDefaultPayment()
			.then((res) => {
				this.setState({defaultPayment: res.data, pageLoading:false});
				
			})
			.catch((error) => {
				this.loadDataError(error, this);
				this.setState({pageLoading: false});
			});
	};
	
	
	componentDidMount() {
		this.loadDataFromServer()
	}
	
	render() {
        require("antd/dist/antd.css");

		return (
			<>
				{this.state.pageLoading ?
					<Spinner
						// message={"J"}
					/>
					: null
				}
				
				
				<Toaster
					position="top-center"
					reverseOrder={false}
				/>
				
				<div className="container-fluid py-5">
                     <div className="d-flex flex-wrap justify-content-between">
						<h1 className="mb-0" style={{fontSize:"14px"}}>
							<Unicons.UilPresentationLinesAlt size="24" className="mr-1"/>
							Hi {user.fullName}, for full access to the online learning features, a fee of <span>{this.state.defaultPayment?.amount != null ? nairaFormat(this.state.defaultPayment?.amount) : null}</span> was set. Kindly make payment to continue.
						</h1>
						
					</div>
					
<center>
<img src={ATMCARD} style={{width:"45%"}}/>
</center>
<center>
                            <button onClick={this.executePayment} className='btn btn-primary'>Proceed to pay <span style={{fontWeight:"bold"}}>{this.state.defaultPayment?.amount != null ? nairaFormat(this.state.defaultPayment?.amount) : null}</span></button>

                            </center>
                {/* <Result
    title="Your operation has been executed"
    extra={
      <Button type="primary" key="console">
        Go Console
      </Button>
    }
  /> */}
                    {/* <div className="d-flex flex-wrap justify-content-between">
						<h1 className="mb-0 text-primary">
							<Unicons.UilPresentationLinesAlt size="24" className="mr-1"/>
							Payment
						</h1>
						
					</div> */}
					
					{/* <center style={{marginTop:"-70px"}}>
                        <div className='row'>
                            <div className='col-sm-12'>
                            <img src={ATMCARD} style={{width:"45%"}}/>
                       
                            </div>
                            <div className='col-sm-12' style={{marginTop:"-150px"}}>
                            <button  className='btn btn-primary'>Proceed to pay <span style={{fontWeight:"bold"}}>N4,500</span></button>

                            </div>
                            <div className='col-sm-12'>
                        <p style={{marginTop:"-30px", fontSize:"22px", color:"#100c39bd"}}>Hi {user.fullName}, a fee of <span>N4,500</span> was set for this resource. Kindly make payment to continue.</p>

                            </div>
                        </div>
                      

                    </center> */}
					
					
				
				</div>
				
			
			</>
		)
	}
	
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
