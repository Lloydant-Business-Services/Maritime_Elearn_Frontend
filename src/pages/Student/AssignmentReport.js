import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import * as Unicons from '@iconscout/react-unicons';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Endpoint from "../../utils/endpoint";
import {handleFormSubmissionError} from "../../utils/helpers";
import toast, { Toaster } from 'react-hot-toast';
import ClipLoader from "react-spinners/ClipLoader";
import Folder from "../../assets/images/empty2.png";
import {Accordion} from "../../components/Accordion/Accordion";
import { MDBDataTableV5 } from 'mdbreact';
import {Link} from "react-router-dom";
import ReactTooltip from 'react-tooltip';
import Select from 'react-select';
import StudentAssignment from '../../components/DataTables/StudentAssignment';
import Spinner from "../Front/Spinner";
import PulseLoader from "react-spinners/PulseLoader";

let user = JSON.parse(localStorage.getItem('user'));
class StudentAssignmentReport extends Component {
	state = {
		allInstructors: [],
		sessionSemesterId: 0,
		allDepartments: [],
		allDepartmentNames: [],
		currentDepartment: [],
		// pageLoading: false,
		loadReportLoading: false,
		// currentReport: [],
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
	
	setReportDeptId = (e) => {
        console.log(e)
		if (e) {
			this.setState({seelectedSessionSemester: e.value, labelSelect:e.label});
		}

        setTimeout(() => {
            console.log(this.state.labelSelect)
        }, 2000);
	};
	
	loadReport = (e) => {
		e.preventDefault();
		
		if (this.state.seelectedSessionSemester == 0) {
			this.setState({error: true, errorMessage: "Please specify a session semester"});
			
			setTimeout(() => {
				this.setState({error: false, errorMessage: ""})
			}, 3000);
			
			return;
		}
		this.setState({pageLoading: true});
		
		// let reportProps = {
		// 	departmentId: this.state.reportDeptId,
		// 	sessionSemesterId: this.state.sessionSemesterId
		// };
		let _this = this;
		Endpoint.getStudentAssignmentSessionSemesterReport(user.personId, this.state.seelectedSessionSemester)
			.then((res) => {
				console.log(res.data);
				this.setState({
					loadReportLoading: false,
					currentReport: res.data,
				});
                if(res.data.studentAssignmentModel == null || res.data.studentAssignmentModel.length <= 0){
                    this.setState({pageLoading:false})
                    return;
                }
                else{
                    let mappedData = res.data.studentAssignmentModel.map((c, i) => {
                        return{
                            sNo: i + 1,
                            courseCode: c.courseCode,
                            courseTitle: c.courseTitle,
                            score: c.score,
                            studentName: c.studentName,
                            matricNumber: c.matricNumber,
                            studentAssignmentModel: c.studentAssignmentModel,
                        }
                    });
                    
                    let tableData = {
                        columns: [
                            {
                                label: 'S/No',
                                field: 'sNo',
                            },
                            {
                                label: 'Course Code',
                                field: 'courseCode',
                            },
                            {
                                label: 'Course Title',
                                field: 'courseTitle',
                            },
                            {
                                label: 'Score',
                                field: 'score',
                            },
                        ],
                        rows: mappedData,
                    };
                    // console.log(mappedData);
                    // let newData = mappedData && mappedData.length > 0?  mappedData[0] : null;
                    this.setState({loadedAssignments: tableData, mappedAssignments: res?.data?.studentAssignmentModel, loadedData:res.data, pageLoading:false});
                    setTimeout(() => {
                    console.log(this.state.mappedAssignments, "assignment props");
                    console.log(this.state.loadedData, "data props");
                        
                    }, 2000);
                }
				
				
			})

            return
	};
	
	loadDataFromServer = () => {
		this.setState({pageLoading: true});
		
		Endpoint.getAllSessionSemester()
			.then((res) => {
				console.log(res.data, "sessiosemester");
                let newDeptObj = [];
				for (let i=0; i<res.data.length; i++) {
					let entry = {
                        value: res.data[i].id, 
                        label: res.data[i].semesterName + " " + res.data[i].sessionName 
                    };
					newDeptObj.push(entry);
				}
				this.setState({allSessionSemester: res.data, allSessionSemesterNames: newDeptObj, pageLoading: false});
			})
			.catch((error) => {
			this.loadDataError(error, this);
			this.setState({pageLoading: false});
		});
		
		
	};
	
	componentDidMount() {
		this.loadDataFromServer();
	};
	
	render() {
		return (
			<>
				                {this.state.pageLoading ? <Spinner message={"Just a moment"} /> : null}

				
				<Toaster
					position="top-center"
					reverseOrder={false}
				/>
				
				<div className="container-fluid py-5">
					<div className="d-flex flex-wrap justify-content-between">
						<div>
							<div className="d-flex">
								<h1 className="mb-0 mr-2 text-primary" style={{fontSize:"17px"}}>
									<Unicons.UilBookAlt size="26" className="mr-2"/>
									My Assignment Reports
								</h1>
							</div>
						</div>
					</div>
					
					<hr className="my-2"/>
					
					<form onSubmit={(e) => this.loadReport(e)}>
						<div className="form-group row">
							<div className="col-md-6 col-lg-5 col-xl-4">
								<div className="">
									<Select
										placeholder="Select Session Semester"
										className="basic-single"
										classNamePrefix="select"
										defaultValue={0}
										isDisabled={false}
										isLoading={false}
										isClearable={true}
										isRtl={false}
										isSearchable={true}
										name="Department"
										options={this.state.allSessionSemesterNames}
										onChange={this.setReportDeptId }
									/>
								</div>
								
									<div className="">
										{this.state.error ?
											<div className="bg-danger border-rad-full text-center mt-3 p-2 mb-3">
												<p className="small text-white mb-0">
													<Unicons.UilBell size="20"/> {this.state.errorMessage}
												</p>
											</div>
											: null
										}
									</div>
							</div>
							
							<div className="col-md-12">
								<button className="btn btn-primary mt-3">
									Load Report
									{/* {
										this.state.loadReportLoading ?
											<span className="ml-2">
											<ClipLoader size={20} color={"#fff"}
														Loading={this.state.loadReportLoading}/>
										</span>
											:
											null
									} */}
								</button>
							</div>
						</div>
					</form>
					
					{/*{*/}
					{/*	this.state.currentReport ?*/}
					{/*		<div>*/}
					{/*			<hr className="my-2"/>*/}
					{/*			*/}
					{/*			<div className="overflow-scroll">*/}
					{/*				<MDBDataTableV5*/}
					{/*					hover*/}
					{/*					striped*/}
					{/*					entriesOptions={[10, 20, 25]}*/}
					{/*					entries={10}*/}
					{/*					pagesAmount={4}*/}
					{/*					pagingTop*/}
					{/*					searchTop*/}
					{/*					searchBottom={false}*/}
					{/*					data={this.state.loadedAssignments}*/}
					{/*					sortRows={['name']}*/}
					{/*				/>*/}
					{/*			</div>*/}
					{/*			*/}
					{/*			<div className="mt-3">*/}
					{/*				<button className="btn btn-sm btn-primary"><Unicons.UilFileExport/> Export Report PDF</button>*/}
					{/*			</div>*/}
					{/*		</div>*/}
					{/*		:*/}
					{/*		null*/}
					{/*}*/}
					
					{
						this.state.currentReport ?
							<StudentAssignment loadedLabel={this.state.labelSelect} assignmentList={this.state.mappedAssignments} loadedData={this.state.loadedData}/>
							:
							null
					}
					
				</div>
			</>
		
		)
	}
	
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentAssignmentReport);