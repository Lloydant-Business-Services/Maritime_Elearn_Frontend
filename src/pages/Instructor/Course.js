import React, { Component } from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps, stateKeys } from "../../redux/actions";
import illustration from "../../assets/images/illus.png";
import quizGif from "../../assets/images/quizz.gif";
import assignmentsGif from "../../assets/images/assan.gif";
import corsoGif from "../../assets/images/books.gif";

import * as Unicons from "@iconscout/react-unicons";
import Endpoint from "../../utils/endpoint";
import toast, { Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { MDBDataTableV5 } from "mdbreact";
import Spinner from "../Front/Spinner";
import { Button, Radio } from "antd";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import $ from "jquery";
import Typography from "@mui/material/Typography";

class InstructorCourse extends Component {
    state = {
        pageLoading: false,
        valueChange: "topics",
        courseTopics: [],

        thisCourse: [],
        newTopic: false,
        newTopicFormIncomplete: false,
        newTopicLoading: false,

        newTopicName: "",
        newTopicDesc: "",
        newTopicSDate: "",
        newTopicEDate: "",

        editTopicName: "",
        editTopicDesc: "",
        editTopicSDate: "",
        editTopicEDate: "",

        newAssignment: false,
        newAssignmentFormIncomplete: false,
        newAssignmentLoading: false,

        newAssignmentName: "",
        newAssignmentInstruction: "",
        newAssignmentInText: "",
        newAssignmentVidLink: "",
        newAssignmentDDate: "",
        newAssignmentMaxScore: "",

        editAssignmentName: "",
        editAssignmentInstruction: "",
        editAssignmentInText: "",
        editAssignmentVidLink: "",
        editAssignmentDDate: "",
        editAssignmentMaxScore: "",

        newAssignmentFile: null,
        editAssignment: false,
        deletesssignment: false,
        deletetopic: false,
        edittopic: false,
        topicId: 0,
        assignmentId: 0,
    };

    newTopicSuccess = () =>
        toast.success("Topic added successfully", {
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
    editSuccess = () =>
        toast.success("modified successfully", {
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
    newAssignmentSuccess = () =>
        toast.success("added successfully", {
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

    AssignmentDeleteSuccess = () =>
        toast.success("deleted successfully", {
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

    TopicDeleteSuccess = () =>
        toast.success("Topic deleted successfully", {
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

    openNewTopic = () => {
        this.setState({ newTopic: true });
    };

    toggleNewTopic = () => {
        this.setState({ newTopic: !this.state.newTopic });
    };

    openNewAssignment = () => {
        this.setState({ newAssignment: true });
    };

    toggleNewAssignment = () => {
        this.setState({ newAssignment: !this.state.newAssignment });
    };

    editTopic = (e) => {
        e.preventDefault()
        this.setState({ newTopicLoading: true })
        let editTopicPayload = {
            "topicName": this.state.editTopicName,
            "topicDescription": this.state.editTopicDesc,
            "startDate": this.state.editTopicSDate,
            "endDate": this.state.editTopicEDate
        }
        Endpoint.modifyCourseTopic(this.state.editTopicId, editTopicPayload)
            .then((res) => {
                this.setState({ edittopic: false, newTopicLoading: false })
                this.editSuccess();
                this.loadDataFromServer()
            })
            .catch((err) => {
                this.loadDataError()
            })
    }

    toggleEditAssignment = (a, e) => {
        this.setState({
            editAssignment: !this.state.editAssignment,
            editAssignmentName: a.assignmentName,
            //  editAssignmentInText: a
        });
        console.log(a, "aaaaa=======");
    };

    toggleDeleteAssignment = (a, e) => {
        this.setState({ deleteassignment: !this.state.deleteassignment, assignmentId: e });
    };

    toggleDeleteTopic = (e) => {
        this.setState({ deletetopic: !this.state.deletetopic, topicId: e });
    };

    toggleEditTopic = (a, e) => {
        this.setState({
            edittopic: !this.state.edittopic,
            editTopicName: a.topicName,
            editTopicDesc: a.topicDescription,
            editTopicSDate: a.setDate,
            editTopicEDate: a.startDate,
            editTopicId: a.topicId
        });
        console.log(a, "aaaaa======");
    };

    assignmentFileSelect = (e) => {
        this.setState({ newAssignmentFile: e.target.files[0] });
        console.log(e.target.files[0]);
    };

    createTopic = (e) => {
        e.preventDefault();

        if (!this.state.newTopicName || !this.state.newTopicDesc || !this.state.newTopicSDate || !this.state.newTopicEDate) {
            this.setState({ newTopicFormIncomplete: true });

            setTimeout(() => {
                this.setState({ newTopicFormIncomplete: false });
            }, 3000);

            return;
        }

        if (moment(this.state.newTopicEDate).isBefore()) {
            console.log("past time");
            this.setState({ error: true, errorMessage: "End date cannot be in the past" });

            setTimeout(() => {
                this.setState({ error: false, errorMessage: "" });
            }, 3000);
            return;
        }

        if (moment(this.state.newTopicEDate).isBefore(moment(this.state.newTopicSDate))) {
            console.log("unordered time");
            this.setState({ error: true, errorMessage: "End date cannot be before start date" });

            setTimeout(() => {
                this.setState({ error: false, errorMessage: "" });
            }, 3000);
            return;
        }

        this.setState({ newTopicLoading: true, success: false, error: false });

        let TopicProps = {
            courseAllocationId: this.state.thisCourse.courseAllocationId,
            topicName: this.state.newTopicName,
            topicDescription: this.state.newTopicDesc,
            startDate: this.state.newTopicSDate,
            endDate: this.state.newTopicEDate,
        };

        Endpoint.createCourseTopic(TopicProps)
            .then((res) => {
                console.log(res);
                this.setState({ newTopicLoading: false, newTopic: false });

                this.newTopicSuccess();

                setTimeout(() => {
                    this.loadDataFromServer();
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ newTopicLoading: false });
            });
    };

    createAssignment = (e) => {
        e.preventDefault();

    

        if (this.state.newAssignmentFile && this.state.newAssignmentFile.size > 1024000) {
            this.setState({ error: true, errorMessage: "File size cannot exceed 1MB" });

            setTimeout(() => {
                this.setState({ error: false, errorMessage: "" });
            }, 3000);
            return;
        }

        // if (moment(this.state.newAssignmentDDate).isBefore()) {
        //     console.log("past time");
        //     this.setState({ error: true, errorMessage: "Due date cannot be in the past" });

        //     setTimeout(() => {
        //         this.setState({ error: false, errorMessage: "" });
        //     }, 3000);
        //     return;
        // }

        this.setState({ newAssignmentLoading: true, success: false, error: false });

        let AssignmentProps = new FormData();
        AssignmentProps.append("courseAllocationId", this.state.thisCourse.courseAllocationId);
        AssignmentProps.append("Name", this.state.newAssignmentName);
        AssignmentProps.append("AssignmentInstruction", this.state.newAssignmentInstruction);
        AssignmentProps.append("DueDate", this.state.newAssignmentDDate);
        AssignmentProps.append("MaxScore", this.state.newAssignmentMaxScore);

        if (this.state.newAssignmentInText) {
            AssignmentProps.append("AssignmentInText", this.state.newAssignmentInText);
        }
        if (this.state.maxCharacters != null && this.state.maxCharacters > 0) {
            AssignmentProps.append("MaxCharacters", this.state.maxCharacters);


        }
        if (this.state.newAssignmentVidLink) {
            AssignmentProps.append("AssignmentVideoLink", this.state.newAssignmentVidLink);
        }

        if (this.state.newAssignmentFile) {
            AssignmentProps.append("AssignmentUpload", this.state.newAssignmentFile);
        }

        Endpoint.createAssignment(AssignmentProps)
            .then((res) => {
                this.setState({ newAssignmentLoading: false, newAssignment: false });
                this.newAssignmentSuccess();

                setTimeout(() => {
                    this.loadDataFromServer();
                    window.location.reload(true);
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ newAssignmentLoading: false });
            });
    };

    editAssignment = (e) => {
        e.preventDefault();

        if (!this.state.newAssignmentName || !this.state.newAssignmentInstruction || !this.state.newAssignmentMaxScore || !this.state.newAssignmentDDate) {
            this.setState({ newAssignmentFormIncomplete: true });

            setTimeout(() => {
                this.setState({ newAssignmentFormIncomplete: false });
            }, 3000);

            return;
        } else if (!this.state.newAssignmentInText && !this.state.newAssignmentVidLink && !this.state.newAssignmentFile) {
            this.setState({ newAssignmentFormIncomplete: true });

            setTimeout(() => {
                this.setState({ newAssignmentFormIncomplete: false });
            }, 3000);

            return;
        }

        if (this.state.newAssignmentFile && this.state.newAssignmentFile.size > 1024000) {
            this.setState({ error: true, errorMessage: "File size cannot exceed 1MB" });

            setTimeout(() => {
                this.setState({ error: false, errorMessage: "" });
            }, 3000);
            return;
        }

        // if (moment(this.state.newAssignmentDDate).isBefore()) {
        //     console.log("past time");
        //     this.setState({ error: true, errorMessage: "Due date cannot be in the past" });

        //     setTimeout(() => {
        //         this.setState({ error: false, errorMessage: "" });
        //     }, 3000);
        //     return;
        // }

        this.setState({ newAssignmentLoading: true, success: false, error: false });

        let AssignmentProps = new FormData();
        AssignmentProps.append("assignmentId", this.state.thisCourse.courseAllocationId);
        AssignmentProps.append("assignmentName", this.state.editAssignmentName);
        AssignmentProps.append("assignmentInstruction", this.state.editAssignmentInstruction);
        AssignmentProps.append("dueDate", this.state.editAssignmentDDate);
        AssignmentProps.append("maxScore", this.state.editAssignmentMaxScore);

        if (this.state.newAssignmentInText) {
            AssignmentProps.append("assignmentInText", this.state.newAssignmentInText);
        }

        if (this.state.newAssignmentVidLink) {
            AssignmentProps.append("AssignmentVideoLink", this.state.newAssignmentVidLink);
        }

        if (this.state.newAssignmentFile) {
            AssignmentProps.append("AssignmentUpload", this.state.newAssignmentFile);
        }

        Endpoint.editAssignment(AssignmentProps)
            .then((res) => {
                this.setState({ newAssignmentLoading: false, newAssignment: false });
                this.newAssignmentSuccess();

                setTimeout(() => {
                    this.loadDataFromServer();
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ newAssignmentLoading: false });
            });
    };

    deleteAssignment = (e) => {
        // e.preventDefault();
        const deleteAssignmentProps = {
            recordId: e,
            delete: true,
        };
        this.setState({ newAssignmentLoading: true, success: false, error: false });

        Endpoint.deleteAssignment(deleteAssignmentProps)
            .then((res) => {
                this.setState({ newAssignmentLoading: false, newAssignment: false });
                this.AssignmentDeleteSuccess();

                setTimeout(() => {
                    this.loadDataFromServer();
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ newAssignmentLoading: false });
            });
    };
    deleteQuiz = (e) => {
        const deleteAssignmentProps = {
            recordId: e,
            delete: true,
        };
        this.setState({ newAssignmentLoading: true, success: false, error: false });

        Endpoint.deleteQuiz(deleteAssignmentProps)
            .then((res) => {
                this.setState({ newAssignmentLoading: false, newAssignment: false });
                this.AssignmentDeleteSuccess();

                setTimeout(() => {
                    this.loadDataFromServer();
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ newAssignmentLoading: false });
            });
    }
    deleteTopic = (e) => {
        // e.preventDefault();
        // const deleteAssignmentProps = {
        // 	"recordId": e,
        //   }
        this.setState({ newAssignmentLoading: true, success: false, error: false });

        Endpoint.deleteTopic(e)
            .then((res) => {
                this.setState({ newAssignmentLoading: false, newAssignment: false });
                this.TopicDeleteSuccess();

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
        let fromStorageAllocId = localStorage.getItem("courseAllocationId");
        let fromStorageCourseId = localStorage.getItem("courseId");
        let user = JSON.parse(localStorage.getItem("user"));
        this.setState({ pageLoading: true, user: user, thisCourse: this.props?.location?.state?.data });

        Endpoint.getCourseTopics(fromStorageAllocId)
            .then((res) => {
                console.log(res.data);
                this.setState({ topicList: res.data });
                let mappedData = res.data.map((x, i) => {
                    return {
                        sNo: i + 1,
                        // name: <span searchvalue={x.topicName} className="capital">{x.topicName}</span>,
                        name: (
                            <Link to={{ pathname: "/instructor/coursetopic", state: { data: x } }}>
                                <h5 className="mr-2 text-primary">{x.topicName}</h5>
                            </Link>
                        ),

                        email: x.email,
                        actions: (
                            <div>
                                <button onClick={() => this.deleteTopic(x.topicId)} className="btn btn-sm btn-outline-danger">
                                    <Unicons.UilTrashAlt size="19" />
                                </button>
                            </div>
                        ),
                    };
                });
                let tableData = {
                    columns: [
                        {
                            label: "S/No",
                            field: "sNo",
                        },
                        {
                            label: "Name",
                            field: "name",
                        },
                        // {
                        // 	label: 'Email',
                        // 	field: 'email',
                        // },
                        {
                            label: "Actions",
                            field: "actions",
                        },
                    ],
                    rows: mappedData,
                };
                this.setState({ pageLoading: false, courseTopics: tableData });
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });

        Endpoint.getCourseAssignments(fromStorageCourseId)
            .then((res) => {
                console.log(res.data);
                this.setState({ pageLoading: false, allAssignments: res.data });
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });

        //Quiz
        Endpoint.getCourseQuiz(fromStorageCourseId)
            .then((res) => {
                console.log(res.data);
                this.setState({ pageLoading: false, allQuiz: res.data });
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });
    };

    componentDidMount() {
        localStorage.setItem("courseAllocationId", this.props?.location?.state?.data?.courseAllocationId);
        localStorage.setItem("courseId", this.props?.location?.state?.data?.courseId);
        let fromStorageAllocId = localStorage.getItem("courseAllocationId");
        let fromStorageCourseId = localStorage.getItem("courseId");
        console.log(fromStorageCourseId, fromStorageAllocId, "undefined======");
        this.loadDataFromServer();
    }
    triggerChange = (data) => {
        if (data == "topics") {
            $("#assignments").hide();
            $("#quizes").hide();
            $("#topics").fadeIn();
            this.setState({ valueChange: data });
        } else if (data == "assignments") {
            $("#quizes").hide();
            $("#topics").hide();
            $("#assignments").fadeIn();
            this.setState({ valueChange: data });
        } else if (data == "quizes") {
            $("#assignments").hide();
            $("#topics").hide();
            $("#quizes").fadeIn();
            this.setState({ valueChange: data });
        }
    };

    toggleNewQuiz = () => {
        this.setState({ newQuiz: !this.state.newQuiz });
    }
    createQuiz = (e) => {
        e.preventDefault();

        if (!this.state.newAssignmentName || !this.state.newAssignmentInstruction || !this.state.newAssignmentMaxScore || !this.state.newAssignmentDDate) {
            this.setState({ newAssignmentFormIncomplete: true });

            setTimeout(() => {
                this.setState({ newAssignmentFormIncomplete: false });
            }, 3000);

            return;
        } else if (!this.state.newAssignmentInText && !this.state.newAssignmentVidLink && !this.state.newAssignmentFile) {
            this.setState({ newAssignmentFormIncomplete: true });

            setTimeout(() => {
                this.setState({ newAssignmentFormIncomplete: false });
            }, 3000);

            return;
        }

        if (this.state.newAssignmentFile && this.state.newAssignmentFile.size > 1024000) {
            this.setState({ error: true, errorMessage: "File size cannot exceed 1MB" });

            setTimeout(() => {
                this.setState({ error: false, errorMessage: "" });
            }, 3000);
            return;
        }

        // if (moment(this.state.newAssignmentDDate).isBefore()) {
        //     console.log("past time");
        //     this.setState({ error: true, errorMessage: "Due date cannot be in the past" });

        //     setTimeout(() => {
        //         this.setState({ error: false, errorMessage: "" });
        //     }, 3000);
        //     return;
        // }

        this.setState({ newAssignmentLoading: true, success: false, error: false });

        let AssignmentProps = new FormData();
        AssignmentProps.append("courseAllocationId", this.state.thisCourse.courseAllocationId);
        AssignmentProps.append("Name", this.state.newAssignmentName);
        AssignmentProps.append("QuizInstruction", this.state.newAssignmentInstruction);
        AssignmentProps.append("DueDate", this.state.newAssignmentDDate);
        AssignmentProps.append("MaxScore", this.state.newAssignmentMaxScore);

        if (this.state.newAssignmentInText) {
            AssignmentProps.append("QuizInText", this.state.newAssignmentInText);
        }

        if (this.state.newAssignmentVidLink) {
            AssignmentProps.append("QuizVideoLink", this.state.newAssignmentVidLink);
        }

        if (this.state.newAssignmentFile) {
            AssignmentProps.append("QuizUpload", this.state.newAssignmentFile);
        }

        Endpoint.createQuiz(AssignmentProps)
            .then((res) => {
                this.setState({ newAssignmentLoading: false, newAssignment: false });
                this.newAssignmentSuccess();

                setTimeout(() => {
                    this.loadDataFromServer();
                    window.location.reload(true);
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ newAssignmentLoading: false });
            });
    };
    render() {
        require("antd/dist/antd.css");
        return (
            <>
                {this.state.pageLoading ? <Spinner message={"Just a moment"} /> : null}

                <Toaster position="top-center" reverseOrder={false} />

                <div className="container-fluid py-5">
                    <div className="d-flex flex-wrap justify-content-between">
                        <h1 className="mb-3 text-primary" style={{ fontSize: "21px" }}>
                            <Unicons.UilBookAlt size="24" className="mr-2" />
                            {this.state?.thisCourse?.courseTitle}
                            &nbsp;
                            {/* <img src={assignmentsGif} style={{ width: "100px" }} /> */}
                        </h1>

                        <div>
                            <button className="btn btn-primary" onClick={this.openNewTopic}>
                                <Unicons.UilPlus size="20" /> New Topic
                            </button>

                            <button className="btn btn-primary" onClick={this.openNewAssignment}>
                                <Unicons.UilPlus size="20" /> New Assignment
                            </button>

                            <button className="btn btn-primary" onClick={this.toggleNewQuiz}>
                                <Unicons.UilPlus size="20" /> Set Quiz
                            </button>

                        </div>
                    </div>

                    <hr style={{ marginTop: "0rem" }} />
                    <div className="row">
                        <div className="col-lg-12">
                            <Radio.Group value={this.state.valueChange}>
                                <Radio.Button value="topics" onClick={(e) => this.triggerChange("topics")}>
                                    Course Topics
                                </Radio.Button>
                                <Radio.Button value="assignments" onClick={(e) => this.triggerChange("assignments")}>
                                    Assignments
                                </Radio.Button>
                                <Radio.Button value="quizes" onClick={(e) => this.triggerChange("quizes")}>
                                    Quizes
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                        <br />
                        <br />
                        <br />
                    </div>

                    <div className="row" id="topics">
                        <div className="col-lg-12">
                            <h3>Course Topics</h3>
                        </div>

                        {/* <div
                                className="overflow-scroll"
                                //  style={{maxHeight:'640px'}}
                            >
                                <MDBDataTableV5 hover striped entriesOptions={[7, 10, 20]} entries={7} pagesAmount={4} pagingTop searchTop searchBottom={false} data={this.state.courseTopics} sortRows={["name"]} />
                            </div> */}
                        {this.state.topicList && this.state.topicList.length > 0 ? (
                            this.state.topicList.map((topic, index) => {
                                // console.log(assignment, 'assignments=====')
                                return (
                                    <>
                                        <div className="col-lg-3">
                                            <Card sx={{ maxWidth: 345 }}>
                                                <CardMedia component="img" alt="green iguana" height="180" image={corsoGif} />

                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: "20px" }}>
                                                        {topic.topicName}
                                                    </Typography>
                                                    {/* <Typography variant="body2" color="text.secondary">
                                                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
                                                </Typography> */}
                                                    <p className="my-1 small mb-2 text-success">
                                                        {/* <Unicons.UilCheckCircle size="18" />  */}
                                                        <span className="font-weight-bold"></span>
                                                        <span className="text-dark">{topic.topicDescription}</span>
                                                        <br />
                                                        <span className="text-dark">{topic.courseCode}</span>
                                                    </p>
                                                    {/* <p className="mt-1 small mb-0 text-danger">
                                                    <Unicons.UilCalendarAlt size="18" />
                                                    <span className="font-weight-bold text-danger">Due On: </span>
                                                    <span className="text-dark">{moment(assignment.dueDate).format("lll")}</span>
                                                </p> */}
                                                </CardContent>
                                                <CardActions>
                                                    <Link to={{ pathname: "/instructor/coursetopic", state: { data: topic } }}>
                                                        <button className="btn btn-primary btn-sm">
                                                            View &nbsp; <i className="fa fa-arrow-right" />
                                                        </button>
                                                    </Link>
                                                    {/* <Button size="small">Learn More</Button> */}
                                                    <div style={{ float: "right" }}>
                                                        <button onClick={() => this.deleteTopic(topic.topicId)} className="btn btn-sm btn-danger my-auto">
                                                            <Unicons.UilTrash size="18" />
                                                        </button>
                                                    </div>
                                                    <div style={{ float: "right", marginRight: "17px" }}>
                                                        <button onClick={() => this.toggleEditTopic(topic)} className="btn btn-sm btn-primary my-auto">
                                                            <i className="fa fa-edit" style={{ fontSize: "15px" }} />
                                                        </button>
                                                    </div>


                                                </CardActions>
                                            </Card>
                                        </div>
                                    </>
                                );
                            })
                        ) : (
                            <p className="text-center">No assignments created yet.</p>
                        )}
                    </div>

                    <div className="row" id="assignments" style={{ display: "none" }}>
                        <div className="col-lg-12">
                            <h2>Assignments</h2>
                            <hr className="my-2" />
                        </div>

                        {this.state.allAssignments && this.state.allAssignments.length > 0 ? (
                            this.state.allAssignments.map((assignment, index) => {
                                // console.log(assignment, 'assignments=====')
                                return (
                                    <>
                                        {" "}
                                        <div className="col-lg-3">
                                            <Card sx={{ maxWidth: 345 }}>
                                                <CardMedia component="img" alt="green iguana" height="190" image={assignmentsGif} />

                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: "20px" }}>
                                                        {assignment.assignmentName}
                                                    </Typography>
                                                    {/* <Typography variant="body2" color="text.secondary">
                                                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
                                                </Typography> */}
                                                    <p className="my-1 small mb-2 text-success">
                                                        <Unicons.UilCheckCircle size="18" /> <span className="font-weight-bold">Max Score: </span> <span className="text-dark">{assignment.maxScore}</span>
                                                    </p>
                                                    <p className="mt-1 small mb-0 text-danger">
                                                        <Unicons.UilCalendarAlt size="18" />
                                                        <span className="font-weight-bold text-danger">Due On: </span>
                                                        <span className="text-dark">{moment(assignment.dueDate).format("lll")}</span>
                                                    </p>
                                                </CardContent>
                                                <CardActions>
                                                    <Link to={{ pathname: "/instructor/assignment", state: { data: assignment } }}>
                                                        <button className="btn btn-primary btn-sm">
                                                            View &nbsp; <i className="fa fa-arrow-right" />
                                                        </button>
                                                    </Link>
                                                    {/* <Button size="small">Learn More</Button> */}
                                                    <div style={{ float: "right" }}>
                                                        <button onClick={() => this.deleteAssignment(assignment?.assignmentId)} className="btn btn-sm btn-danger my-auto">
                                                            <Unicons.UilTrash size="18" />
                                                        </button>
                                                    </div>
                                                </CardActions>
                                            </Card>
                                        </div>
                                    </>
                                );
                            })
                        ) : (
                            <p className="text-center">No assignments created yet.</p>
                        )}
                    </div>

                    <div className="row" id="quizes" style={{ display: "none" }}>
                        <div className="col-sm-12"></div>
                        {this.state.allQuiz && this.state.allQuiz.length > 0 ? (
                            this.state.allQuiz.map((assignment, index) => {
                                // console.log(assignment, 'assignments=====')
                                return (
                                    <>
                                        <div className="col-lg-3">
                                            <Card sx={{ maxWidth: 345 }}>
                                                <CardMedia component="img" alt="green iguana" height="180" image={quizGif} />

                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: "20px" }}>
                                                        {assignment.quizName}
                                                    </Typography>
                                                    {/* <Typography variant="body2" color="text.secondary">
                                                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
                                                </Typography> */}
                                                    <p className="my-1 small mb-2 text-success">
                                                        <Unicons.UilCheckCircle size="18" /> <span className="font-weight-bold">Max Score: </span> <span className="text-dark">{assignment.maxScore}</span>
                                                    </p>
                                                    <p className="mt-1 small mb-0 text-danger">
                                                        <Unicons.UilCalendarAlt size="18" />
                                                        <span className="font-weight-bold text-danger">Due On: </span>
                                                        <span className="text-dark">{moment(assignment.dueDate).format("lll")}</span>
                                                    </p>
                                                </CardContent>
                                                <CardActions>
                                                    <Link to={{ pathname: "/instructor/quiz", state: { data: assignment } }}>
                                                        <button className="btn btn-primary btn-sm">
                                                            View &nbsp; <i className="fa fa-arrow-right" />
                                                        </button>
                                                    </Link>
                                                    {/* <Button size="small">Learn More</Button> */}
                                                    <div style={{ float: "right" }}>
                                                        <button onClick={() => this.deleteQuiz(assignment?.quizId)} className="btn btn-sm btn-danger my-auto">
                                                            <Unicons.UilTrash size="18" />
                                                        </button>
                                                    </div>
                                                </CardActions>
                                            </Card>
                                        </div>
                                    </>
                                );
                            })
                        ) : (
                            <p className="text-center">No quizes created yet.</p>
                        )}
                    </div>
                </div>

                <Modal isOpen={this.state.newTopic} toggle={this.toggleNewTopic} className="mt-5 md" size="lg">
                    <form onSubmit={(e) => this.createTopic(e)}>
                        <ModalHeader toggle={this.toggleNewTopic}>
                            <span className="h2">Add New Topic</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <label className="mt-2 mr-2 ">
                                        <b>Name of Topic:</b>
                                    </label>

                                    <input
                                        id="tName"
                                        type="text"
                                        className="form-control"
                                        value={this.state.newTopicName}
                                        onChange={(e) =>
                                            this.setState({
                                                newTopicName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-2 mr-2 ">
                                        <b>Description:</b>
                                    </label>

                                    <input
                                        id="tName"
                                        type="text"
                                        className="form-control"
                                        value={this.state.newTopicDesc}
                                        onChange={(e) =>
                                            this.setState({
                                                newTopicDesc: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Start Date:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="date"
                                        className="form-control"
                                        value={this.state.newTopicSDate}
                                        onChange={(e) =>
                                            this.setState({
                                                newTopicSDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>End Date:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="date"
                                        className="form-control"
                                        value={this.state.newTopicEDate}
                                        onChange={(e) =>
                                            this.setState({
                                                newTopicEDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    {this.state.newTopicFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 my-3">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all fields.
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
                                Add Topic
                                {this.state.newTopicLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.newTopicLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleNewTopic}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.edittopic} toggle={this.toggleEditTopic} className="mt-5 md" size="lg">
                    <form onSubmit={(e) => this.editTopic(e)}>
                        <ModalHeader toggle={this.toggleEditTopic}>
                            <span className="h2">Edit Topic</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <label className="mt-2 mr-2 ">
                                        <b>Name of Topic:</b>
                                    </label>

                                    <input
                                        id="tName"
                                        type="text"
                                        className="form-control"
                                        value={this.state.editTopicName}
                                        onChange={(e) =>
                                            this.setState({
                                                editTopicName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-2 mr-2 ">
                                        <b>Description:</b>
                                    </label>

                                    <input
                                        id="tName"
                                        type="text"
                                        className="form-control"
                                        value={this.state.editTopicDesc}
                                        onChange={(e) =>
                                            this.setState({
                                                editTopicDesc: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                {/* <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Start Date:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="date"
                                        className="form-control"
                                        value={this.state.editTopicSDate}
                                        onChange={(e) =>
                                            this.setState({
                                                editTopicSDate: e.target.value,
                                            })
                                        }
                                    />
                                </div> */}

                                {/* <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>End Date:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="date"
                                        className="form-control"
                                        value={this.state.editTopicEDate}
                                        onChange={(e) =>
                                            this.setState({
                                                editTopicEDate: e.target.value,
                                            })
                                        }
                                    />
                                </div> */}

                                <div className="col-md-6 mt-3">
                                    {this.state.newTopicFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 my-3">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all fields.
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
                                Edit Topic
                                {this.state.newTopicLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.newTopicLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleEditTopic}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.newAssignment} toggle={this.toggleNewAssignment} className="mt-5 md" size="lg">
                    <form onSubmit={(e) => this.createAssignment(e)}>
                        <ModalHeader toggle={this.toggleNewAssignment}>
                            <span className="h2">New Assignment</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <label className="mt-2 mr-2 ">
                                        <b>Assignment Title: </b> <span style={{ fontSize: "10px", color: "red" }}>maximum characters allowed(100)</span>
                                    </label>

                                    <input
                                        id="tName"
                                        type="text"
                                        maxLength={100}
                                        className="form-control"
                                        value={this.state.newAssignmentName}
                                        onChange={(e) =>
                                            this.setState({
                                                newAssignmentName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-2 mr-2 ">
                                        <b>Instruction:</b>  <span style={{ fontSize: "10px", color: "red" }}>maximum characters allowed(500)</span>
                                    </label>

                                    <input
                                        id="tName"
                                        type="text"
                                        maxLength={500}
                                        className="form-control"
                                        value={this.state.newAssignmentInstruction}
                                        onChange={(e) =>
                                            this.setState({
                                                newAssignmentInstruction: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-12 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Assignment Text:</b>
                                    </label>

                                    <textarea cols="30" rows="5" className="form-control" value={this.state.newAssignmentInText} onChange={(e) => this.setState({ newAssignmentInText: e.target.value })}></textarea>
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Video Link:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="text"
                                        className="form-control"
                                        value={this.state.newAssignmentVidLink}
                                        onChange={(e) =>
                                            this.setState({
                                                newAssignmentVidLink: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>
                                            Assignment File: <span className="text-danger small">Accept: PDF, docx, txt</span>
                                        </b>
                                    </label>

                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="application/pdf, application/docx, application/txt"
                                        onChange={(e) => {
                                            this.assignmentFileSelect(e);
                                        }}
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Due Date:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="date"
                                        className="form-control"
                                        value={this.state.newAssignmentDDate}
                                        onChange={(e) =>
                                            this.setState({
                                                newAssignmentDDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Maximum characters allowed:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="number"
                                        className="form-control"
                                        placeholder="Optional"
                                        value={this.state.maxCharacters}
                                        onChange={(e) =>
                                            this.setState({
                                                maxCharacters: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Max Score:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="number"
                                        className="form-control"
                                        value={this.state.newAssignmentMaxScore}
                                        onChange={(e) =>
                                            this.setState({
                                                newAssignmentMaxScore: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    {this.state.newAssignmentFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 my-3">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all necessary fields.
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
                                Create Assignment
                                {this.state.newAssignmentLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.newAssignmentLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleNewAssignment}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.editAssignment} toggle={this.toggleEditAssignment} className="mt-5 md" size="lg">
                    <form onSubmit={(e) => { }}>
                        <ModalHeader toggle={this.toggleEditAssignment}>
                            <span className="h2">Edit Assignment</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <label className="mt-2 mr-2 ">
                                        <b>Assignment Title: </b>
                                    </label>

                                    <input
                                        id="tName"
                                        type="text"
                                        className="form-control"
                                        value={this.state.editAssignmentName}
                                        onChange={(e) =>
                                            this.setState({
                                                editAssignmentName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-2 mr-2 ">
                                        <b>Instruction:</b>
                                    </label>

                                    <input
                                        id="tName"
                                        type="text"
                                        className="form-control"
                                        value={this.state.editAssignmentInstruction}
                                        onChange={(e) =>
                                            this.setState({
                                                editAssignmentInstruction: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-12 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Assignment Text:</b>
                                    </label>

                                    <textarea cols="30" rows="5" className="form-control" value={this.state.editAssignmentInText} onChange={(e) => this.setState({ editAssignmentInText: e.target.value })}></textarea>
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Video Link:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="text"
                                        className="form-control"
                                        value={this.state.editAssignmentVidLink}
                                        onChange={(e) =>
                                            this.setState({
                                                editAssignmentVidLink: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>
                                            Assignment File: <span className="text-danger small">Accept: PDF, docx, txt</span>
                                        </b>
                                    </label>

                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="application/pdf, application/docx, application/txt"
                                        onChange={(e) => {
                                            this.assignmentFileSelect(e);
                                        }}
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Due Date:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="date"
                                        className="form-control"
                                        value={this.state.editAssignmentDDate}
                                        onChange={(e) =>
                                            this.setState({
                                                editAssignmentDDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Max Score:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="number"
                                        className="form-control"
                                        value={this.state.editAssignmentMaxScore}
                                        onChange={(e) =>
                                            this.setState({
                                                editAssignmentMaxScore: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    {this.state.newAssignmentFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 my-3">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all necessary fields.
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
                                Edit Assignment
                                {this.state.newAssignmentLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.newAssignmentLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleEditAssignment}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.deleteassignment} toggle={this.toggleDeleteAssignment} className="mt-5 md" size="sm">
                    <form onSubmit={(e) => this.deleteAssignment(e)}>
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
                                Delete Assignment
                                {this.state.deleteDepartmentLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.deleteDepartmentLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleDeleteAssignment}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.deletetopic} toggle={this.toggleDeleteTopic} className="mt-5 md" size="sm">
                    <form onSubmit={(e) => this.deleteTopic(e)}>
                        <ModalHeader toggle={this.toggleDeleteTopic}>
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
                                Delete Topic
                                {this.state.deleteDepartmentLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.deleteDepartmentLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleDeleteTopic}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>




                <Modal isOpen={this.state.newQuiz} toggle={this.toggleNewQuiz} className="mt-5 md" size="lg">
                    <form onSubmit={(e) => this.createQuiz(e)}>
                        <ModalHeader toggle={this.toggleNewQuiz}>
                            <span className="h2">New Quiz</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <label className="mt-2 mr-2 ">
                                        <b>Quiz Title: </b> <span style={{ fontSize: "10px", color: "red" }}>maximum characters allowed(100)</span>
                                    </label>

                                    <input
                                        id="tName"
                                        type="text"
                                        maxLength={100}
                                        className="form-control"
                                        value={this.state.newAssignmentName}
                                        onChange={(e) =>
                                            this.setState({
                                                newAssignmentName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-2 mr-2 ">
                                        <b>Instruction:</b>  <span style={{ fontSize: "10px", color: "red" }}>maximum characters allowed(500)</span>
                                    </label>

                                    <input
                                        id="tName"
                                        type="text"
                                        maxLength={500}
                                        className="form-control"
                                        value={this.state.newAssignmentInstruction}
                                        onChange={(e) =>
                                            this.setState({
                                                newAssignmentInstruction: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-12 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Quiz Text:</b>
                                    </label>

                                    <textarea cols="30" rows="5" className="form-control" value={this.state.newAssignmentInText} onChange={(e) => this.setState({ newAssignmentInText: e.target.value })}></textarea>
                                </div>

                                {/* <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Video Link:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="text"
                                        className="form-control"
                                        value={this.state.newAssignmentVidLink}
                                        onChange={(e) =>
                                            this.setState({
                                                newAssignmentVidLink: e.target.value,
                                            })
                                        }
                                    />
                                </div> */}

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>
                                            Quiz File: <span className="text-danger small">Accept: PDF, docx, txt</span>
                                        </b>
                                    </label>

                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="application/pdf, application/docx, application/txt"
                                        onChange={(e) => {
                                            this.assignmentFileSelect(e);
                                        }}
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Due Date:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="date"
                                        className="form-control"
                                        value={this.state.newAssignmentDDate}
                                        onChange={(e) =>
                                            this.setState({
                                                newAssignmentDDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="mt-2 mr-2 ">
                                        <b>Max Score:</b>
                                    </label>

                                    <input
                                        id="oName"
                                        type="number"
                                        className="form-control"
                                        value={this.state.newAssignmentMaxScore}
                                        onChange={(e) =>
                                            this.setState({
                                                newAssignmentMaxScore: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mt-3">
                                    {this.state.newAssignmentFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 my-3">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all necessary fields.
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
                                Create Quiz
                                {this.state.newAssignmentLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.newAssignmentLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={this.toggleNewQuiz}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>
            </>
        );
    }
}

export default InstructorCourse;
