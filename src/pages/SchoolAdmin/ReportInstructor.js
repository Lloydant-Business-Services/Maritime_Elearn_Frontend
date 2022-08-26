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
import InstructorReport from '../../components/DataTables/InstructorReportTable';


class ReportInstructor extends Component {
	state = {
		allInstructors: [],
		sessionSemesterId: 0,
		allDepartments: [],
		allDepartmentNames: [],
		currentDepartment: [],
		pageLoading: false,
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
		if (e) {
			this.setState({reportDeptId: e.value});
		}
	};
	
	loadReport = (e) => {
		e.preventDefault();
		
		if (this.state.sessionSemesterId === 0 || !this.state.reportDeptId) {
			this.setState({error: true, errorMessage: "Please select a department"});
			
			setTimeout(() => {
				this.setState({error: false, errorMessage: ""})
			}, 3000);
			
			return;
		}
		this.setState({loadReportLoading: true});
		
		let reportProps = {
			departmentId: this.state.reportDeptId,
			sessionSemesterId: this.state.sessionSemesterId
		};
		
		Endpoint.getDeptInstructorsReport(reportProps)
			.then((res) => {
				console.log(res.data);
				this.setState({
					loadReportLoading: false,
					currentReport: res.data,
				});
				
				
				let mappedData = res.data.map((instructor, i) => {
					return{
						sNo: i + 1,
						name: instructor.fullName,
						email: instructor.email,
						department: instructor.department.name,
					}
				});
				
				let tableData = {
					columns: [
						{
							label: 'S/No',
							field: 'sNo',
						},
						{
							label: 'Name',
							field: 'name',
						},
						{
							label: 'Email',
							field: 'email',
						},
						{
							label: 'Department',
							field: 'department',
						},
					],
					rows: mappedData,
				};
				console.log(mappedData);
				
				this.setState({loadedInstructors: tableData, mappedInstructors: mappedData});
				
			})
	};
	
	loadDataFromServer = () => {
		this.setState({pageLoading: true});
		
		Endpoint.getActiveSessionSemester()
			.then((res) => {
				console.log(res.data);
				this.setState({sessionSemesterId: res.data.id, pageLoading: false});
			})
			.catch((error) => {
			this.loadDataError(error, this);
			this.setState({pageLoading: false});
		});
		
		Endpoint.getAllDepartments()
			.then((res) => {
				console.log(res.data);
				let newDeptObj = [];
				for (let i=0; i<res.data.length; i++) {
					let entry = {value: res.data[i].id, label: res.data[i].name };
					newDeptObj.push(entry);
				}
				this.setState({allDepartments: res.data, allDepartmentNames: newDeptObj, pageLoading: false});
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
						<div>
							<div className="d-flex">
								<h1 className="mb-0 mr-2 text-primary">
									<Unicons.UilBookAlt size="26" className="mr-2"/>
									Instructor Report
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
										placeholder="Select Department"
										className="basic-single"
										classNamePrefix="select"
										defaultValue={0}
										isDisabled={false}
										isLoading={false}
										isClearable={true}
										isRtl={false}
										isSearchable={true}
										name="Department"
										options={this.state.allDepartmentNames}
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
									{
										this.state.loadReportLoading ?
											<span className="ml-2">
											<ClipLoader size={20} color={"#fff"}
														Loading={this.state.loadReportLoading}/>
										</span>
											:
											null
									}
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
					{/*					data={this.state.loadedInstructors}*/}
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
							<InstructorReport instructorList = {this.state.mappedInstructors}/>
							:
							null
					}
					
				</div>
			</>
		
		)
	}
	
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportInstructor);