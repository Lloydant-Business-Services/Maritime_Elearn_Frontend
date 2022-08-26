import React, { Component } from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps, stateKeys } from "../../redux/actions";
import illustration from "../../assets/images/illus.png";
import * as Unicons from "@iconscout/react-unicons";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import Endpoint from "../../utils/endpoint";
import toast, { Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";
import Dash from "../../assets/images/80356-online-learning.gif";
import zoomIcon from "../../assets/images/zooma1.png";
import googleIcon from "../../assets/images/google1.png";
import TeamsIcon from "../../assets/images/mt-big.png";

import Spinner from "../Front/Spinner";

class InstructorLiveLectures extends Component {
    state = {
        pageLoading: false,

        myLectures: [],
        user: JSON.parse(localStorage.getItem("user")),

        newLecture: false,
        newLectureLoading: false,
        newLectureFormIncomplete: false,
        myCourses: [],
        newLectureCourse: "",
        newLectureCourseAllocation: "",
        lectureDate: "",
        lectureTime: "",
        lectureDuration: "",
        lectureTopic: "",
        lectureAgenda: "",
        deleteLiveLecture: false,
        liveLectureId: 0,
        // newZoom: true,
    };

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

    toggleNewLecture = () => {
        this.setState({ newLecture: !this.state.newLecture });
    };

    openNewLecture = () => {
        this.setState({ newLecture: true });
    };
    PreRecordLectureToggle = () => {
        this.setState({ newPrerecord: !this.state.newPrerecord });
    };
    closeNewLecture = () => {
        this.setState({ newLecture: false });
    };

    handleNewLectureCourse = (event) => {
        const value = event.target.value;
        this.setState({ newLectureCourse: value });
    };

    changeText = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(value)
        this.setState({ [name]: value });
    };

    newLectureSuccess = () =>
        toast.success("Lecture created successfully", {
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

    liveLectureDeleteSuccess = () =>
        toast.success("Lecture deleted successfully", {
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

    createNewLecture = (e) => {
        e.preventDefault();
		if(!this.state.meetingLink){
			this.setState({ newLectureFormIncomplete: true });
			return;
		}
        if (!this.state.newLectureCourse || !this.state.lectureDate  || !this.state.lectureTopic || !this.state.lectureAgenda || !this.state.lectureDuration) {
            this.setState({ newLectureFormIncomplete: true });

            setTimeout(() => {
                this.setState({ newLectureFormIncomplete: false });
            }, 3000);
            return;
        }

        const newLectureProps = {
            topic: this.state.lectureTopic,
            agenda: this.state.lectureAgenda,
            date: this.state.lectureDate,
            time: 1,
            duration: parseInt(this.state.lectureDuration),
            courseAllocationId: parseInt(this.state.newLectureCourse),
            userId: this.state.user.userId,
			join_Meeting_Url: this.state.meetingLink,
			start_Meeting_Url: this.state.meetingLink,
            startTime: this.state.startTime
        };
        this.setState({ newLectureLoading: true });

        console.log(newLectureProps);

        Endpoint.createLecture(newLectureProps)
            .then((res) => {
                console.log(res.data);

                this.setState({
                    error: false,
                    success: true,
                    newLectureLoading: false,
                    newLecture: false,
                });

                this.newLectureSuccess();

                setTimeout(() => {
                    this.loadDataFromServer();
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false, newLectureLoading: false });
            });
    };
    createPrerecordedLecture = (e) => {
        e.preventDefault();
		if(!this.state.meetingLink){
			this.setState({ newLectureFormIncomplete: true });
			return;
		}
        if (!this.state.newLectureCourse || !this.state.lectureDate  || !this.state.lectureTopic || !this.state.lectureAgenda) {
            this.setState({ newLectureFormIncomplete: true });

            setTimeout(() => {
                this.setState({ newLectureFormIncomplete: false });
            }, 3000);
            return;
        }

        const newLectureProps = {
            topic: this.state.lectureTopic,
            agenda: this.state.lectureAgenda,
            date: this.state.lectureDate,
            time: 777,
            duration: 0,
            courseAllocationId: parseInt(this.state.newLectureCourse),
            userId: this.state.user.userId,
			join_Meeting_Url: this.state.meetingLink,
			start_Meeting_Url: "PRE_RECORDED",
            startTime: this.state.startTime
        };

        this.setState({ newLectureLoading: true });

        console.log(newLectureProps);

        Endpoint.createLecture(newLectureProps)
            .then((res) => {
                console.log(res.data);

                this.setState({
                    error: false,
                    success: true,
                    newLectureLoading: false,
                    newLecture: false,
                });

                this.newLectureSuccess();

                setTimeout(() => {
                    this.loadDataFromServer();
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false, newLectureLoading: false });
            });
    };
    deleteLiveLecture = (e) => {
        e.preventDefault();
        // const deleteAssignmentProps = {
        // 	"recordId": e,
        // }
        console.log(this.state.liveLectureId, "deleteiddd===");
        this.setState({ newAssignmentLoading: true, success: false, error: false });

        Endpoint.deleteLiveLecture(this.state.liveLectureId)
            .then((res) => {
                this.setState({ newAssignmentLoading: false, newAssignment: false, deleteLiveLecture: false });
                this.liveLectureDeleteSuccess();

                setTimeout(() => {
                    this.loadDataFromServer();
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ newAssignmentLoading: false });
            });
    };

    loadDataFromServer = () => {
        let user = JSON.parse(localStorage.getItem("user"));
        this.setState({ pageLoading: true, user: user });

        Endpoint.getInstructorCourses(user.userId)
            .then((res) => {
                console.log(res.data);
                this.setState({ pageLoading: false, myCourses: res.data });
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });

        Endpoint.getInstructorLiveLectures(user.userId)
            .then((res) => {
                console.log(res.data);
                this.setState({ myLectures: res.data });
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });
    };

    componentDidMount() {
        this.loadDataFromServer();
    }

    toggleDeleteLiveLecture = (id) => {
        this.setState({ deleteLiveLecture: !this.state.deleteLiveLecture, liveLectureId: id });
    };

    newLiveLecture = (id) => {
        this.setState({ newZoom: !this.state.newZoom });
    };

    render() {
        return (
            <>
                {this.state.pageLoading ? (
                   <Spinner/>
                ) : null}

                <Toaster position="top-center" reverseOrder={false} />

                <div className="container-fluid py-5">
                    <div className="main-content">
                        <div className="header pb-1">
                            <div className="">
                                <div className="header-body">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center pt-4">
                                        <div>
                                            <h1 className="h1 text-primary d-inline-block mb-0">
                                                <Unicons.UilMeetingBoard /> Live Lectures
                                            </h1>
                                        </div>

                                        <div>
                                            <button className="btn btn-round btn-primary" onClick={() => this.openNewLecture()}>
                                                <Unicons.UilPlus size="20" /> Schedule New Lecture
                                            </button>

                                            <a className="btn btn-round btn-primary" 
                                            // href="https://editor.flixier.com/projects/create?name=Elearn&width=1920&height=1080" target={"_blank"}
                                            onClick={() => this.PreRecordLectureToggle()}
                                            style={{color:"#fff"}}
                                            >
                                                <Unicons.UilPlus size="20" /> Pre-record Lecture
                                            </a>
                                        </div>
                                        {/* <div>
                                            <a className="btn btn-round btn-primary" href="https://editor.flixier.com/projects/create?name=Elearn&width=1920&height=1080" target={"_blank"}>
                                                <Unicons.UilPlus size="20" /> Pre-record Lecture
                                            </a>
                                        </div> */}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-4" />

                        <div className="row justify-content-center">
                            <div className="col-xl-12">
                                <div>
                                    <div>
                                        {this.state.newLectureSuccess ? (
                                            <div className="alert alert-default alert-dismissible fade show my-5" role="alert">
                                                <span className="alert-inner--icon">
                                                    <i className="ni ni-like-2"></i>
                                                </span>
                                                <span className="alert-inner--text">
                                                    {" "}
                                                    <strong>Success!</strong> New Live Lecture added!
                                                </span>
                                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                        ) : null}

                                        <div className="table-responsive">
                                            <table className="table table-hover table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>S/No</th>
                                                        <th>Course Title</th>
                                                        <th>Start Time</th>
                                                        <th>Lecture Topic</th>
                                                        {/* <th>Lecture Duration</th> */}
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {this.state.myLectures && this.state.myLectures.length ? (
                                                        this.state.myLectures.map((lecture, index) => {
                                                            let getHour;
                                                            let hourOfDay;
                                                            var splitTime = lecture.startTime != null ? lecture.startTime.split[":"] : "-";
                                                            console.log(splitTime, "ss")
                                                            if(splitTime != null){
                                                                getHour = splitTime[0];
                                                                if(getHour > 12 ? hourOfDay = "PM" : "AM");
                                                            }
                                                            console.log(lecture, "hjklgsfgdhjkh======");
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <span className="font-weight-bold">{lecture.courseName}</span>
                                                                    </td>
                                                                    <td>{moment(lecture.date).format("ll")} 
                                                                    &nbsp;
                                                                    &nbsp;
                                                                    {lecture.startTime != null ? lecture.startTime : lecture.startTime}</td>
                                                                    <td>{lecture.topic} {hourOfDay != null ? hourOfDay : ""}</td>
                                                                    {/* <td>{lecture.duration} mins</td> */}
                                                                    <td>
                                                                        <a href={lecture.start_Meeting_Url} target="_blank" className="btn btn-sm btn-outline-primary">
                                                                            Start Lecture
                                                                        </a>
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            onClick={() => {
                                                                                this.toggleDeleteLiveLecture(lecture?.liveLectureId);
                                                                            }}
                                                                            className="btn btn-sm btn-outline-danger"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6">
                                                                <p className="text-center mb-0 font-weight-600">No lectures yet</p>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.newLecture ? (
                    <Modal size="lg" isOpen={this.state.newLecture} toggle={this.toggleNewLecture} className="mt-5 md">
                        <form onSubmit={(e) => this.createNewLecture(e)}>
                            <ModalHeader className="border-bottom">
                                <span className="h2">New Live Lecture</span>
                            </ModalHeader>

                            <ModalBody>
                                {this.state.incompleteNewLecture ? (
                                    <div className="alert alert-danger alert-dismissible fade show my-2" role="alert">
                                        <span className="alert-inner--icon">&times;</span>
                                        <span className="alert-inner--text">
                                            {" "}
                                            <strong>Incomplete form!</strong> Please fill all fields!
                                        </span>
                                    </div>
                                ) : null}
                              
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label className="text-sm">Select Course</label>
                                        <select className="form-control" onChange={this.handleNewLectureCourse}>
                                            <option value="">Select Course</option>
                                            {this.state.myCourses
                                                ? this.state.myCourses.map((course, index) => {
                                                      return (
                                                          <option key={course.courseId} value={course.courseAllocationId}>
                                                              {course.courseTitle}
                                                          </option>
                                                      );
                                                  })
                                                : null}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="text-sm">Start date</label>
                                        <input type="date" className="form-control" name="lectureDate" onChange={this.changeText} />
                                    </div>

                                    {/* <div className="col-md-6 mb-4">
                                        <label className="text-sm">Start time</label>
                                        <select className="form-control" name="lectureTime" onChange={this.changeText}>
                                            <option value="0">00:00</option>
                                            <option value="1">01:00</option>
                                            <option value="2">02:00</option>
                                            <option value="3">03:00</option>
                                            <option value="4">04:00</option>
                                            <option value="5">05:00</option>
                                            <option value="6">06:00</option>
                                            <option value="7">07:00</option>
                                            <option value="8">08:00</option>
                                            <option value="9">09:00</option>
                                            <option value="10">10:00</option>
                                            <option value="11">11:00</option>
                                            <option value="12">12:00</option>
                                            <option value="13">13:00</option>
                                            <option value="14">14:00</option>
                                            <option value="15">15:00</option>
                                            <option value="16">16:00</option>
                                            <option value="17">17:00</option>
                                            <option value="18">18:00</option>
                                            <option value="19">19:00</option>
                                            <option value="20">20:00</option>
                                            <option value="21">21:00</option>
                                            <option value="22">22:00</option>
                                            <option value="23">23:00</option>
                                        </select>
                                    </div> */}
                                    <div className="col-md-6 mb-4">
                                        <label className="text-sm">Start Time</label>
                                        <input type="time" className="form-control" name="startTime" onChange={this.changeText} />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label className="text-sm">Duration(minutes)</label>
                                        <input type="number" className="form-control" name="lectureDuration" onChange={this.changeText} />
                                    </div>

                                    <div className="col-md-6 mb-1">
                                        <label className="text-sm">Lecture Topic</label>
                                        <input type="text" className="form-control" name="lectureTopic" onChange={this.changeText} />
                                    </div>

                                    <div className="col-md-6 mb-1">
                                        <label className="text-sm">Lecture Agenda</label>
                                        <input type="text" className="form-control" name="lectureAgenda" onChange={this.changeText} />
                                    </div>

									<div className="col-md-12 mb-1">
									<hr/>
									<small style={{fontStyle:'italic'}}>Click on either platform to get meeting link. Paste meeting link on the input field provided below</small>
									<br/>
                                        {/* <label className="text-sm">Meeting Link</label> &nbsp; */}
										<a href="https://us04web.zoom.us/meeting/schedule" target="_blank"><span><img width={'10%'} style={{cursor:'pointer'}} src={zoomIcon}/></span></a> &nbsp; &nbsp; &nbsp;
										<a href="https://meet.google.com" target="_blank"><span><img width={'20%'} style={{cursor:'pointer'}} src={googleIcon}/></span></a>
                                       
										<a href="https://www.microsoft.com/en-us/microsoft-teams/group-chat-software" target="_blank"><span><img width={'15%'} style={{cursor:'pointer'}} src={TeamsIcon}/></span></a>

                                        
                                        <input type="text" className="form-control" placeholder="Paste meeting link here" name="meetingLink" onChange={this.changeText} />
                                    </div>
                                </div>

                                <div className="col-md-6 mt-2">
                                    {this.state.newLectureFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-1 custom-form-alert">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all fields.
                                            </p>
                                        </div>
                                    ) : null}

                                    {this.state.error ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-1">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilBell size="20" /> {this.state.errorMessage}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <button type="submit" className="btn btn-primary">
                                    Create Lecture
                                    {this.state.newLectureLoading ? (
                                        <span className="ml-2">
                                            <ClipLoader size={20} color={"#fff"} Loading={this.state.newLectureLoading} />
                                        </span>
                                    ) : null}
                                </button>

                                <button type="button" className="btn btn-danger" onClick={this.toggleNewLecture}>
                                    Close
                                </button>
                            </ModalFooter>
                        </form>
                    </Modal>
                ) : null}
 {this.state.newPrerecord ? (
                    <Modal size="lg" isOpen={this.state.newPrerecord} toggle={this.PreRecordLectureToggle} className="mt-5 md">
                        <form onSubmit={(e) => this.createPrerecordedLecture(e)}>
                            <ModalHeader className="border-bottom">
                                <span className="h2">Pre-record Live Lecture Setup</span>
                            </ModalHeader>

                            <ModalBody>
                                {this.state.incompleteNewLecture ? (
                                    <div className="alert alert-danger alert-dismissible fade show my-2" role="alert">
                                        <span className="alert-inner--icon">&times;</span>
                                        <span className="alert-inner--text">
                                            {" "}
                                            <strong>Incomplete form!</strong> Please fill all fields
                                        </span>
                                    </div>
                                ) : null}
                              
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label className="text-sm">Select Course</label>
                                        <select className="form-control" onChange={this.handleNewLectureCourse}>
                                            <option value="">Select Course</option>
                                            {this.state.myCourses
                                                ? this.state.myCourses.map((course, index) => {
                                                      return (
                                                          <option key={course.courseId} value={course.courseAllocationId}>
                                                              {course.courseTitle}
                                                          </option>
                                                      );
                                                  })
                                                : null}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="text-sm">Start date</label>
                                        <input type="date" className="form-control" name="lectureDate" onChange={this.changeText} />
                                    </div>

{/*                                    
                                    <div className="col-md-6 mb-4">
                                        <label className="text-sm">Start Time</label>
                                        <input type="time" className="form-control" name="startTime" onChange={this.changeText} />
                                    </div> */}
                                    {/* <div className="col-md-6 mb-4">
                                        <label className="text-sm">Duration(minutes)</label>
                                        <input type="number" className="form-control" name="lectureDuration" onChange={this.changeText} />
                                    </div> */}

                                    <div className="col-md-6 mb-1">
                                        <label className="text-sm">Lecture Topic</label>
                                        <input type="text" className="form-control" name="lectureTopic" onChange={this.changeText} />
                                    </div>

                                    <div className="col-md-6 mb-1">
                                        <label className="text-sm">Lecture Agenda</label>
                                        <input type="text" className="form-control" name="lectureAgenda" onChange={this.changeText} />
                                    </div>

									<div className="col-md-12 mb-1">
									<hr/>
									<small style={{fontStyle:'italic'}}>
                                        We recommend using Flixxier as your default streaming tool. (using any other tool is still an option.)

                                        {/* Note: Whilst You are allowed to use. Paste meeting link on the input field provided below */}
                                        </small>
                                    {/* <p><img src={""} alt="FLixir"/></p> */}
									{/* <br/> */}
										<a href="https://editor.flixier.com/projects/create" target="_blank">
                                            &nbsp;
                                            &nbsp;
                                            <span><img width={'58px'} style={{cursor:'pointer'}} src={"https://df02ig60gv6ag.cloudfront.net/landing/img/logo-inverse.5b3e12f.svg"}/></span></a>

                                        
                                        <input type="text" className="form-control" placeholder="Paste video link here" name="meetingLink" onChange={this.changeText} />
                                        <br/>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-2">
                                    {this.state.newLectureFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-1 custom-form-alert">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all fields.
                                            </p>
                                        </div>
                                    ) : null}

                                    {this.state.error ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-1">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilBell size="20" /> {this.state.errorMessage}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <button type="submit" className="btn btn-primary">
                                    Create Lecture
                                    {this.state.newLectureLoading ? (
                                        <span className="ml-2">
                                            <ClipLoader size={20} color={"#fff"} Loading={this.state.newLectureLoading} />
                                        </span>
                                    ) : null}
                                </button>

                                <button type="button" className="btn btn-danger" onClick={this.PreRecordLectureToggle}>
                                    Close
                                </button>
                            </ModalFooter>
                        </form>
                    </Modal>
                ) : null}
                <Modal isOpen={this.state.deleteLiveLecture} toggle={this.toggleDeleteLiveLecture} className="mt-5 md" size="sm">
                    <form onSubmit={(e) => this.deleteLiveLecture(e)}>
                        <ModalHeader toggle={this.toggleDeleteLiveLecture}>
                            <span className="h2">Delete {this.state.deletingDepartmentName}?</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="text-center">
                                <h4>Are you sure?</h4>
                                <p>This action cannot be undone.</p>

                                {this.state.deleteDepartmentFormIncomplete ? (
                                    <div className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
                                        <p className="small text-white mb-0">
                                            <Unicons.UilExclamationCircle size="20" /> Please select a faculty to delete...
                                        </p>
                                    </div>
                                ) : null}

                                {this.state.error ? (
                                    <div className="bg-danger border-rad-full text-center p-2 mb-3">
                                        <p className="small text-white mb-0">
                                            <Unicons.UilExclamationCircle size="20" /> {this.state.errorMessage}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <button className="btn btn-primary">
                                Delete Live Lecture
                                {this.state.deleteDepartmentLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.deleteDepartmentLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleDeleteLiveLecture}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                {this.state.newZoom ? (
                    <Modal size="lg" isOpen={this.state.newZoom} toggle={this.newLiveLecture} className="mt-5 md">
                        <form onSubmit={(e) => this.createNewLecture(e)}>
                            <ModalHeader className="border-bottom">
                                <span className="h2">Live Lecture Guide</span>
                            </ModalHeader>

                            <ModalBody>
                                <div className="text-center">
                                    <img width="30%" src={Dash} />
                                </div>
                                <div className="row">
                                    <div className="col-md-12 mb-4" >
										<p style={{fontSize:'13px'}}>The Live Lecture Feature allows for online classes to be scheduled</p>
										<p style={{fontSize:'13px'}}>Onclick of the Proceed button below, you will be presented with a form requring you to key in details and schedule the online live lecture.
										<br/>
										<br/>
										You will be expected to create the live lecture using either of:
                                        <br/>
                                        <span><img width={'20%'} src={TeamsIcon}/></span>
                                        <span><img width={'10%'} src={zoomIcon}/></span> &nbsp; &nbsp; &nbsp;&nbsp; <span><img width={'20%'} src={googleIcon}/></span> Platform so choose accordingly.
										 </p>
                                    </div>
									<div className="col-md-12 mb-4" >
										<hr/>
										<p style={{fontSize:'13px', fontWeight:'700'}}>I understand. Do not show this again <span><input type="checkbox"/></span></p>
										
                                    </div>
                                    {/* <div className="col-md-6 mb-4">
                                        <label className="text-sm">Start date</label>
                                        <input type="date" className="form-control" name="lectureDate" onChange={this.changeText} />
                                    </div> */}

                                </div>

                                <div className="col-md-6 mt-2">
                                    {this.state.newLectureFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-1 custom-form-alert">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all fields.
                                            </p>
                                        </div>
                                    ) : null}

                                    {this.state.error ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-1">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilBell size="20" /> {this.state.errorMessage}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </ModalBody>

                            <ModalFooter>
						
                                <button type="submit" className="btn btn-outline-primary" onClick={() => this.setState({newLecture:true, newZoom:false})}>
                                    Proceed &nbsp;<i className="fa fa-arrow-right"/>
                                   
                                </button>

                                {/* <button type="button" className="btn btn-danger" onClick={this.newLiveLecture}>
                                    Close
                                </button> */}
                            </ModalFooter>
                        </form>
                    </Modal>
                ) : null}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstructorLiveLectures);
