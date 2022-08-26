import React, { Component } from "react";
import { connect } from "react-redux";
import {
  mapDispatchToProps,
  mapStateToProps,
  stateKeys,
} from "../../redux/actions";
import * as Unicons from "@iconscout/react-unicons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Endpoint from "../../utils/endpoint";
import { handleFormSubmissionError } from "../../utils/helpers";
import toast, { Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { Accordion } from "../../components/Accordion/Accordion";
import Folder from "../../assets/images/empty2.png";
import Spinner from "../Front/Spinner";

class SchoolAdminDepartmentStudents extends Component {
  state = {
    pageLoading: false,

    allStudents: [],
    newStudents: false,
    studentFile: null,
    newStudentFormIncomplete: false,
    thisDepartment: [],
    deleteStudents: false,
    deptStudents: [],
    // newStudent:true
  };

  toggleNewStudents = () => {
    this.setState({ newStudents: !this.state.newStudents });
  };
  openNewStudents = () => {
    this.setState({ newStudents: true });
  };
  closeNewStudents = () => {
    this.setState({ newStudents: false });
  };

  openDeleteStudents = (data) => {
    this.setState({ 
      studentName: data.deleteStudents,
      deleteStudents: !this.state.deleteStudents,
      studentPersonId: data.studentPersonId
     })
  }

  newStudentsSuccess = () =>
    toast.success("Students uploaded successfully", {
      style: {
        border: "1px solid #56b39d",
        padding: "16px",
        background: "#56b39d",
        color: "#fff",
        borderRadius: "2rem",
      },
      iconTheme: {
        primary: "#FFFAEE",
        secondary: "#56b39d",
      },
    });

    deletedSuccess = () =>
    toast.success("Deleted", {
      style: {
        border: "1px solid #56b39d",
        padding: "16px",
        background: "#56b39d",
        color: "#fff",
        borderRadius: "2rem",
      },
      iconTheme: {
        primary: "#FFFAEE",
        secondary: "#56b39d",
      },
    });

  loadDataError = (error) =>
    toast.error("Something went wrong, pls check your connection.", {
      style: {
        border: "1px solid #DC2626",
        padding: "16px",
        background: "#DC2626",
        color: "#fff",
        borderRadius: "3rem",
      },
      iconTheme: {
        primary: "#FFFAEE",
        secondary: "#DC2626",
      },
    });

  studentFileSelect(e) {
    this.setState({ studentFile: e.target.files[0] });
  }

  createStudents = (e) => {
    e.preventDefault();

    if (!this.state.studentFile) {
      this.setState({ newStudentFormIncomplete: true });

      setTimeout(() => {
        this.setState({ newStudentFormIncomplete: false });
      }, 3000);

      return;
    }

    this.setState({ newStudentsLoading: true, success: false, error: false });

    const studentProps = new FormData();
    studentProps.append("file", this.state.studentFile);

    const id = this.state.thisDepartment.id;

    Endpoint.createStudents(studentProps, id).then((res) => {
      console.log(res.data);
      if (res.status === 200) {
        this.setState({
          error: false,
          success: true,
          newStudents: false,
          newStudentsLoading: false,
          studentFile: null,
        });

        this.newStudentsSuccess();

        setTimeout(() => {
          this.loadDataFromServer();
        }, 2000);
      }
    });
  };

  deleteStudentMethod = (e) => {
    e.preventDefault();


    this.setState({
      deleteDepartmentLoading: true, success: false, error: false
    });


    Endpoint.deactivateStudent(this.state.studentPersonId)
      .then((res) => {
        this.setState({ error: false, deleteStudents:false, success: true, deleteDepartmentLoading: false, deleteDepartment: false, deletingDepartmentName: '' });

        this.deletedSuccess();

        setTimeout(() => {
          this.loadDataFromServer()
        }, 2000);
      })
  };

  loadDataFromServer = () => {
    this.setState({ pageLoading: true });
    let department = this.props.location.state?.data;
    this.setState({ thisDepartment: department });
    console.log(this.props.location.state?.data);

    Endpoint.getStudentsByDepartmentId(this.props.location.state?.data?.id)
      .then((res) => {
        console.log(res.data);
        this.setState({ deptStudents: res.data, pageLoading: false });
      })
      .catch((error) => {
        this.loadDataError(error, this);
        this.setState({ pageLoading: false });
      });
  };
  newInstructorSuccess = () => toast.success("added successfully", {
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
	createStudent = (e) => {
		e.preventDefault();
		
		if (!this.state.newFirstName || !this.state.newLastName || !this.state.newOtherName || !this.state.newEmail || !this.state.regNumber) {
			this.setState({newInstructorFormIncomplete: true});
			
			setTimeout(() => {
				this.setState({newInstructorFormIncomplete: false});
			}, 3000);
			
			return;
		}
		
		this.setState({newInstructorLoading: true, success: false, error: false});
		
		const studentProps = {
			firstname: this.state.newFirstName,
			surname: this.state.newLastName,
			othername: this.state.newOtherName,
			email: this.state.newEmail,
      matricNumber: this.state.regNumber
		};

		
		Endpoint.addSingleStudent(this.state.thisDepartment.id, studentProps)
			.then((res) => {
					console.log(res, "status")

				if(res.data === true) {
					this.setState({
						error: false,
						success: true,
						newInstructorLoading: false,
						newInstructor: false,
						newFirstName: '',
						newLastName: '',
						newOtherName: '',
						newEmail: '',
            newStudent:false
					});
					this.newInstructorSuccess();
					
					setTimeout(() => {
						this.loadDataFromServer()
					}, 2000);
				} 
				else{
					this.setState({error: true, errorMessage: "Email entered already belong to another user", success: false, newInstructorLoading: false});
				}
				
			})
			.catch((error) => {
				this.loadDataError(error);
				this.setState({newInstructorLoading: false, })
			});
	};

  toggleNewStudent = () => {
    this.setState({
      newStudent:!this.state.newStudent
    })
  }
  componentDidMount() {
    this.loadDataFromServer();
  }

  render() {
    return (
      <>
      	<Modal isOpen={this.state.newStudent} toggle={this.toggleNewStudent} className="mt-5 md" size="lg">
					<form onSubmit={(e) => this.createStudent(e)}>
						<ModalHeader toggle={this.toggleNewStudent}>
							<span className="h2">Add New Student</span>
						</ModalHeader>
						
						<ModalBody>
							<div className="form-group row">
              <div className="col-sm-12 mt-3">
                {this.state.newInstructorFormIncomplete ?
										<div className="bg-danger border-rad-full text-center p-2 my-3">
											<p className="small text-white mb-0">
												<Unicons.UilExclamationCircle size="20"/> Please fill in all fields.
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
								<div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>First Name:</b>
									</label>
									
									<input id="fName" type="text" className="form-control"
										   value={this.state.newFirstName}
										   onChange={(e) => this.setState({
											   newFirstName: e.target.value,
										   }) }
									/>
								</div>
								
								<div className="col-md-6">
									<label className="mt-2 mr-2 ">
										<b>Last Name:</b>
									</label>
									
									<input id="lName" type="text" className="form-control"
										   value={this.state.newLastName}
										   onChange={(e) => this.setState({
											   newLastName: e.target.value,
										   }) }
									/>
								</div>
								
								<div className="col-md-6 mt-3">
									<label className="mt-2 mr-2 ">
										<b>Other Name:</b>
									</label>
									
									<input id="oName" type="text" className="form-control"
										   value={this.state.newOtherName}
										   onChange={(e) => this.setState({
											   newOtherName: e.target.value,
										   }) }
									/>
								</div>
							
								<div className="col-md-6 mt-3">
									<label className="mt-2 mr-2 ">
										<b>Email:</b>
									</label>
									
									<input id="email" type="email" className="form-control"
										   value={this.state.newEmail}
										   onChange={(e) => this.setState({
											   newEmail: e.target.value,
										   }) }
									/>
									
								
								</div>
                <div className="col-md-6 mt-3">
									<label className="mt-2 mr-2 ">
										<b>Matric/Registration Number:</b>
									</label>
									
									<input id="regNumber" type="text" className="form-control"
										   value={this.state.regNumber}
										   onChange={(e) => this.setState({
											   regNumber: e.target.value,
										   }) }
									/>
								</div>

               
							</div>
						</ModalBody>
						
						<ModalFooter>
							<button className="btn btn-primary">
								Add Student
								{
									this.state.newInstructorLoading ?
										<span className="ml-2">
										<ClipLoader size={20} color={"#fff"}
													Loading={this.state.newInstructorLoading}/>
									</span>
										:
										null
								}
							</button>
							
							<button type="button" className="btn btn-danger" onClick={this.toggleNewStudent}>Close</button>
						</ModalFooter>
					</form>
				</Modal>
        {this.state.pageLoading ? (
          <Spinner message={'Just a moment'} />
        ) : null}

        <Toaster position="top-center" reverseOrder={false} />

        <div className="container-fluid py-5">
          <div className="d-flex flex-wrap justify-content-between">
            <h1 className="mb-3 mr-2 text-primary my-auto">
              <Unicons.UilUserCircle size="26" className="mr-2" />
              <span className="capital">
                {this.state.thisDepartment.name}
              </span>{" "}
              Students
            </h1>
            <div>
              <button className="btn btn-primary" onClick={this.toggleNewStudent}>
                <Unicons.UilPlus size="20" /> Add Student (Single)
              </button>

              <button className="btn btn-primary" onClick={this.openNewStudents}>
                <Unicons.UilPlus size="20" /> Add Students (Bulk Upload)
              </button>
            </div>
          </div>
          <div className="table-responsive mt-4">
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>S/No</th>
                  <th>Name</th>
                  <th>Matric No.</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>

              <tbody>
                {this.state.deptStudents.length ? (
                  this.state.deptStudents.map((student, index) => {
                    return (
                      <tr key={student.personId}>
                        <td>{index + 1}</td>
                        <td>{student.fullName}</td>
                        <td>{student.matricNumber}</td>
                        <td>
                          {/* <button className="btn btn-sm btn-outline-primary">
                        		<Unicons.UilEditAlt size="19"/> Edit
                        	</button> */}

                          <button onClick={() => this.openDeleteStudents(student)} className="btn btn-sm btn-outline-danger">
                        		<Unicons.UilTrashAlt size="19"/> Delete
                        	</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <h4>No students added yet.</h4>

                      <img
                        src={Folder}
                        alt="empty folder"
                        className="mt-3"
                        height="100px"
                      />

                      <p
                        className="text-primary mt-3"
                        onClick={this.openNewStudents}
                      >
                        <Unicons.UilPlus size="20" /> Upload Students
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          isOpen={this.state.newStudents}
          toggle={this.toggleNewStudents}
          className="mt-5 md"
        >
          <form onSubmit={(e) => this.createStudents(e)}>
            <ModalHeader toggle={this.toggleNewStudents}>
              <span className="h2">Upload New Students</span>
            </ModalHeader>

            <ModalBody>
              <div className="form-group row">
                <div className="col-md-12">
                  <label className="mt-2 mr-2 ">
                    <b>Student Excel File:</b>
                  </label>

                  <input
                    id="students"
                    type="file"
                    className="form-control"
                    accept=".xlsx"
                    ref={(fileInput) => (this.fileInput = fileInput)}
                    onChange={(e) => {
                      this.studentFileSelect(e);
                    }}
                  />
                </div>
                <div>
                  <p className="small ml-3 mt-2">Excel File format: (S/N, Matric No., Surname, Firstname, Othername, Email)</p>
                </div>

                <div className="col-md-12">
                  {this.state.newStudentFormIncomplete ? (
                    <div className="bg-danger border-rad-full text-center p-2 my-3">
                      <p className="small text-white mb-0">
                        <Unicons.UilExclamationCircle size="20" /> Please select
                        an excel file to upload.
                      </p>
                    </div>
                  ) : null}

                  {this.state.error ? (
                    <div className="bg-danger border-rad-full text-center p-2 my-3">
                      <p className="small text-white mb-0">
                        <Unicons.UilBell size="20" /> {this.state.errorMessage}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <button className="btn btn-primary">
                Upload Students
                {this.state.newStudentsLoading ? (
                  <span className="ml-2">
                    <ClipLoader
                      size={20}
                      color={"#fff"}
                      Loading={this.state.newStudentsLoading}
                    />
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={this.toggleNewStudents}
              >
                Close
              </button>
            </ModalFooter>
          </form>
        </Modal>

        <Modal isOpen={this.state.deleteStudents} toggle={this.openDeleteStudents} className="mt-5 md" size="sm">
          <form onSubmit={(e) => this.deleteStudentMethod(e)}>
            <ModalHeader toggle={this.openDeleteStudents}>
              <span className="h2">Delete {this.state.studentName}?</span>
            </ModalHeader>

            <ModalBody>
              <div className="text-center">
                <h4>Are you sure?</h4>
                <p>This action cannot be undone.</p>

             

              </div>

            </ModalBody>

            <ModalFooter>
              <button className="btn btn-primary">
                Delete Student
                {
                  this.state.deleteDepartmentLoading ?
                    <span className="ml-2">
                      <ClipLoader size={20} color={"#fff"}
                        Loading={this.state.deleteDepartmentLoading} />
                    </span>
                    :
                    null
                }
              </button>

              <button type="button" className="btn btn-danger" onClick={() => this.openDeleteStudents(false)}>Close
              </button>
            </ModalFooter>
          </form>
        </Modal>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchoolAdminDepartmentStudents);
