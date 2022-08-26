import React, { Component } from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps, stateKeys } from "../../redux/actions";
import illustration from "../../assets/images/illus.png";
import * as Unicons from "@iconscout/react-unicons";
import Endpoint from "../../utils/endpoint";
import toast, { Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import Spinner from "../Front/Spinner";
import quizGif from "../../assets/images/quizz.gif";
import assignmentsGif from "../../assets/images/assan.gif";
import corsoGif from "../../assets/images/books.gif";

import { Button, Radio } from "antd";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import $ from "jquery";
import Typography from "@mui/material/Typography";

class StudentCourse extends Component {
    state = {
        pageLoading: false,
        thisCourse: [],
        courseTopics: [],
        allAssignments: [],
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

    loadDataFromServer = () => {
        let user = JSON.parse(localStorage.getItem("user"));
        this.setState({ pageLoading: true, user: user, thisCourse: this.props.location.state.data });

        console.log(this.props.location.state, "Propsss");

        Endpoint.getCourseTopics(this.props.location.state.data.courseAllocationId)
            .then((res) => {
                console.log(res.data);
                this.setState({ pageLoading: false, courseTopics: res.data });
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });

        Endpoint.getCourseQuiz(this.props.location.state.data.courseId)
            .then((res) => {
                console.log(res.data);
                this.setState({ pageLoading: false, allQuiz: res.data });
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });




			Endpoint.getCourseAssignments(this.props.location.state.data.courseId)
            .then((res) => {
                console.log(res.data);
                this.setState({ pageLoading: false, allAssignments: res.data });
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });
    };
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
    componentDidMount() {
        this.loadDataFromServer();
    }

    render() {
        require("antd/dist/antd.css");

        return (
            <>
                {this.state.pageLoading ? <Spinner message={"Just a moment"} /> : null}

                <Toaster position="top-center" reverseOrder={false} />

                <div className="container-fluid py-5">
                    <h1 className="mb-3 text-primary">
                        <Unicons.UilBookAlt size="24" className="mr-2" />
                        {this.state.thisCourse?.courseCode + " - " + this.state.thisCourse?.courseTitle}
                    </h1>

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
                        <div className="col-sm-12">
                            <h2>Course Topics</h2>
                            <hr className="my-2" />
                        </div>

                        {this.state.courseTopics && this.state.courseTopics.length ? (
                            this.state.courseTopics.map((topic, index) => {
                                return (
                                    <>
                                        <div className="col-lg-3">
                                            <Card sx={{ maxWidth: 345 }}>
                                                <CardMedia component="img" alt="green iguana" height="180" image={corsoGif} />

                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: "20px" }}>
                                                        {topic.topicName}
                                                    </Typography>
                                                    <p className="my-1 small mb-2 text-success">
                                                        {/* <Unicons.UilCheckCircle size="18" />  */}
                                                        <span className="font-weight-bold"></span>
                                                        <span className="text-dark">{topic.topicDescription}</span>
                                                        <br />
                                                        <span className="text-dark">{topic.courseCode}</span>
                                                    </p>
                                                </CardContent>
                                                <CardActions>
                                                    <Link to={{ pathname: "/student/coursetopic", state: { data: topic } }}>
                                                        <button className="btn btn-primary btn-sm">
                                                            View &nbsp; <i className="fa fa-arrow-right" />
                                                        </button>
                                                    </Link>
                                                    {/* <Button size="small">Learn More</Button> */}
                                                    <div style={{ float: "right" }}>
                                                        {/* <button onClick={() => this.deleteTopic(topic.courseId)} className="btn btn-sm btn-danger my-auto">
                                                    <Unicons.UilTrash size="18" />
                                                </button> */}
                                                    </div>
                                                </CardActions>
                                            </Card>
                                        </div>
                                    </>
                                );
                            })
                        ) : (
                            <p className="text-center">No topics available yet.</p>
                        )}
                    </div>

                    <div className="row" id="assignments" style={{ display: "none" }}>
                        <div className="col-sm-12">
                            <h2>Assignments</h2>
                            <hr className="my-2" />
                        </div>

                        {this.state.allAssignments && this.state.allAssignments.length > 0 ? (
                            this.state.allAssignments.map((assignment, index) => {
                                return (
                                    <>
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
                                                    <Link to={{ pathname: "/student/assignment", state: { data: assignment } }}>
                                                        <button className="btn btn-primary btn-sm">
                                                            View &nbsp; <i className="fa fa-arrow-right" />
                                                        </button>
                                                    </Link>
                                                    {/* <Button size="small">Learn More</Button> */}
                                                    <div style={{ float: "right" }}>
                                                        {/* <button onClick={() => this.deleteAssignment(assignment?.assignmentId)} className="btn btn-sm btn-danger my-auto">
										<Unicons.UilTrash size="18" />
									</button> */}
                                                    </div>
                                                </CardActions>
                                            </Card>
                                        </div>

                                      
                                    </>
                                );
                            })
                        ) : (
                            <p className="text-center">No assignments available yet.</p>
                        )}
                    </div>


					<div className="row" id="quizes" style={{ display: "none" }}>
                        <div className="col-sm-12">
                            <h2>Quizes</h2>
                            <hr className="my-2" />
                        </div>

                        {this.state.allQuiz && this.state.allQuiz.length > 0 ? (
                            this.state.allQuiz.map((assignment, index) => {
                                return (
                                    <>
                                        <div className="col-lg-3">
                                            <Card sx={{ maxWidth: 345 }}>
                                                <CardMedia component="img" alt="green iguana" height="190" image={quizGif} />

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
                                                    <Link to={{ pathname: "/student/quiz", state: { data: assignment } }}>
                                                        <button className="btn btn-primary btn-sm">
                                                            View &nbsp; <i className="fa fa-arrow-right" />
                                                        </button>
                                                    </Link>
                                                    {/* <Button size="small">Learn More</Button> */}
                                                    <div style={{ float: "right" }}>
                                                        {/* <button onClick={() => this.deleteAssignment(assignment?.assignmentId)} className="btn btn-sm btn-danger my-auto">
										<Unicons.UilTrash size="18" />
									</button> */}
                                                    </div>
                                                </CardActions>
                                            </Card>
                                        </div>

                                      
                                    </>
                                );
                            })
                        ) : (
                            <p className="text-center">No assignments available yet.</p>
                        )}
                    </div>
                </div>
            </>
        );
    }
}

export default StudentCourse;
