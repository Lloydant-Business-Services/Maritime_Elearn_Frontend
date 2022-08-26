import React, { Component } from "react";
import * as Unicons from "@iconscout/react-unicons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Endpoint from "../../utils/endpoint";
import { handleFormSubmissionError } from "../../utils/helpers";
import { logOutUser } from "../../utils/auth";
import toast, { Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import Spinner from "../Front/Spinner";
import $ from "jquery";

class StudentProfile extends Component {
    state = {
        pageLoading: false,
        currentMenu: "bio",
        promptMessage: this.props.location?.state?.promptProps,
        editProfile: false,
        newProfileLName: "",
        newProfileFName: "",
        newProfileEmail: "",
        newProfilePhone: "",
        EditProfileFormIncomplete: false,
        editProfileLoading: false,

        profile: [],

        editPassword: false,
        oldPassword: "",
        newPassword: "",
        editPasswordLoading: false,
        EditPasswordFormIncomplete: false,
        EditPasswordFormEqual: false,
    };

    setBioMenu = () => {
        this.setState({ currentMenu: "bio" });
    };
    setAcadMenu = () => {
        this.setState({ currentMenu: "acad" });
    };
    setAuthMenu = () => {
        this.setState({ currentMenu: "auth" });
    };

    toggleEditProfile = () => {
        this.setState({ editProfile: !this.state.editProfile });
    };

    toggleEditPassword = () => {
        this.setState({ editPassword: !this.state.editPassword });
    };

    editProfileSuccess = () =>
        toast.success("Profile edited successfully", {
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

    editPasswordSuccess = () =>
        toast.success("Password changed successfully. You will be logged out now. Kindly relogin with updated password", {
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

    editProfile = (e) => {
        e.preventDefault();

        if (!this.state.newProfileLName || !this.state.newProfileFName || !this.state.newProfileEmail || !this.state.newProfilePhone) {
            this.setState({ EditProfileFormIncomplete: true });

            setTimeout(() => {
                this.setState({ EditProfileFormIncomplete: false });
            }, 3000);

            return;
        }

        this.setState({
            editProfileLoading: true,
            success: false,
            error: false,
        });

        const profileProps = {
            firstname: this.state.newProfileFName,
            surname: this.state.newProfileLName,
            email: this.state.newProfileEmail,
            phoneNumber: this.state.newProfilePhone,
            userId: this.state.user.userId,
        };
        console.log(profileProps);

        Endpoint.updateUserProfile(profileProps)
            .then((res) => {
                this.setState({
                    error: false,
                    success: true,
                    editProfileLoading: false,
                    editProfile: false,
                    newProfileLName: "",
                    newProfileFName: "",
                    newProfileEmail: "",
                    newProfilePhone: "",
                });

                this.editProfileSuccess();
                this.updateLocalStorage(false, profileProps);
                setTimeout(() => {
                    this.loadDataFromServer();
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ editProfileLoading: false });
            });
    };

    updateLocalStorage = (isPassword, data) => {
        if (isPassword) {
            let storageLocal = localStorage.getItem("user");
            let parsedStorage = JSON.parse(storageLocal);
            parsedStorage.isPasswordUpdated = true;
            localStorage.removeItem("user");
            setTimeout(() => {
                localStorage.setItem("user", JSON.stringify(parsedStorage));
                console.log(parsedStorage, "parsed");
            }, 2000);
        } else {
            let storageLocal = localStorage.getItem("user");
            let parsedStorage = JSON.parse(storageLocal);
            parsedStorage.email = data.email;
            localStorage.removeItem("user");
            setTimeout(() => {
                localStorage.setItem("user", JSON.stringify(parsedStorage));
                console.log(parsedStorage, "parsed");
            }, 2000);
        }
    };
    editPassword = (e) => {
        e.preventDefault();

        if (!this.state.oldPassword || !this.state.newPassword) {
            this.setState({ EditPasswordFormIncomplete: true });

            setTimeout(() => {
                this.setState({ EditPasswordFormIncomplete: false });
            }, 3000);

            return;
        }

        if (this.state.oldPassword === this.state.newPassword) {
            this.setState({ error: true, errorMessage: "New Password cannot be the same as old Password!" });

            setTimeout(() => {
                this.setState({ error: false, errorMessage: "" });
            }, 3000);

            return;
        }

        this.setState({
            editPasswordLoading: true,
            success: false,
            error: false,
        });

        const passwordProps = {
            userId: this.state.user.userId,
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
        };
        console.log(passwordProps);

        Endpoint.changePassword(passwordProps)
            .then((res) => {
                console.log(res.data);
                if (res.data === false) {
                    this.setState({ error: true, errorMessage: "Old Password is wrong!", editPasswordLoading: false });

                    setTimeout(() => {
                        this.setState({ error: false, errorMessage: "" });
                    }, 3000);

                    return;
                }
                this.setState({ editPasswordLoading: false });
                this.updateLocalStorage(true, "");
                this.editPasswordSuccess();

                setTimeout(() => {
                    this.loadDataFromServer();
                }, 2000);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ editPasswordLoading: false });
            });
    };

    loadDataFromServer = () => {
        this.setState({ pageLoading: true });

        let user = JSON.parse(localStorage.getItem("user"));
        this.setState({ user: user });

        Endpoint.getUserProfile(user.userId)
            .then((res) => {
                this.setState({
                    profile: res.data,
                    newProfileLName: res.data.person.surname,
                    newProfileFName: res.data.person.firstname,
                    newProfileEmail: res.data.person.email,
                    newProfilePhone: res.data.person.phoneNo === null ? "" : res.data.person.phoneNo,
                });
                this.setState({ pageLoading: false });
                console.log(res.data);
            })
            .catch((error) => {
                this.loadDataError(error, this);
                this.setState({ pageLoading: false });
            });
    };

    checkpw = (e) => {
        let passwordInput = e.target.value;
        this.setState({ newPassword: passwordInput, color: "red" });
        //var password = document.getElementById("password").value;
        // var password2 = document.getElementById("password2").value;
        //var errorMessage = document.getElementById("error");
        var errorDetail = "";
        if (passwordInput.length < 6) {
            this.setState({ errMessage: "Password too short." });
            // errorDetail += "<br /> Password too short.";
        } else if (/[A-Z]/g.test(passwordInput) == false) {
            this.setState({ errMessage: "Password should include at least one capital letter." });
            $("#changeBtn").attr("disabled", true);

            // errorDetail +=
            //   "<br /> Password should include at least one capital letter.";
        } else if (/\d/g.test(passwordInput) == false) {
            this.setState({ errMessage: "Password should include at least one number." });
            $("#changeBtn").attr("disabled", true);
            // errorDetail += "<br /> Password should include at least one digit.";
        } else {
            this.setState({ errMessage: "Great work! your password looks good.", color: "green" });
            $("#changeBtn").attr("disabled", false);
        }
        //   if (password != password2) {
        // 	errorDetail += "<br /> Passwords should match.";
        //   }
    };

    componentDidMount() {
        this.loadDataFromServer();
    }

    render() {
        return (
            <>
                {this.state.pageLoading ? <Spinner message={"Just a moment"} /> : null}

                <Toaster position="top-center" reverseOrder={false} />

                <div className="container-fluid py-5">
                    <div className="d-flex flex-wrap justify-content-between">
                        <div>
                            <h1 className="mb-1 mr-2 text-primary my-auto">
                                <Unicons.UilUserCheck size="30" className="mr-2" />
                                My Profile
                                {this.state.promptMessage ? (
                                    <>
                                        {" "}
                                        &nbsp; &nbsp;
                                        <span className="alert alert-primary" style={{ fontSize: "12px" }}>
                                            {this.state.promptMessage}
                                            {/* Kindly update your email address and change password to continue */}
                                        </span>
                                    </>
                                ) : null}
                            </h1>
                        </div>
                    </div>

                    <hr className="my-3" />

                    <div className="row">
                        <div className="col-lg-4 col-xl-3">
                            <div className="card">
                                <div className="profile-list">
                                    <div className={this.state.currentMenu === "bio" ? "profile-list-item active" : "profile-list-item"} onClick={() => this.setBioMenu()}>
                                        <h3 className="profile-icon">
                                            <Unicons.UilUserCircle size="30" className="mr-1" />
                                        </h3>
                                        <p className="font-weight-bold d-inline-block mb-0 small">Bio-Data</p>
                                    </div>

                                    <div className={this.state.currentMenu === "acad" ? "profile-list-item active" : "profile-list-item"} onClick={() => this.setAcadMenu()}>
                                        <h3 className="profile-icon">
                                            <Unicons.UilGraduationCap size="30" className="mr-1" />
                                        </h3>
                                        <p className="font-weight-bold d-inline-block mb-0 small">Academic Details</p>
                                    </div>

                                    <div className={this.state.currentMenu === "auth" ? "profile-list-item active" : "profile-list-item"} onClick={() => this.setAuthMenu()}>
                                        <h3 className="profile-icon">
                                            <Unicons.UilPadlock size="30" className="mr-1" />
                                        </h3>
                                        <p className="font-weight-bold d-inline-block mb-0 small">Authentication</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8 col-xl-7 mt-4 mt-lg-0">
                            {this.state.currentMenu === "bio" ? (
                                <div className="card bg-white">
                                    <div className="card-body">
                                        <div className="d-flex flex-wrap align-items-center">
                                            <div className="profile-icon-lg">
                                                <Unicons.UilLockAccess size="60" className="" />
                                            </div>

                                            <div>
                                                <h2 className="mb-0">
                                                    {this.state.newProfileLName} {this.state.newProfileFName}
                                                    <span className="d-inline-block text-right ml-3" onClick={() => this.setState({ editProfile: true })}>
                                                        <Unicons.UilEditAlt size="25" className="mr-1" />
                                                    </span>
                                                </h2>

                                                <h5 className="text-muted d-inline-block">Student</h5>
                                            </div>
                                        </div>

                                        <hr className="my-3" />

                                        <div>
                                            <div className="row">
                                                <div className="col-md-4 mb-3">
                                                    <p className="small mb-1 font-weight-500 text-muted">Last Name</p>
                                                    <h3>{this.state.profile.person ? this.state.profile.person.surname : "---"}</h3>
                                                </div>

                                                <div className="col-md-4 mb-3">
                                                    <p className="small mb-1 font-weight-500 text-muted">First Name</p>
                                                    <h3>{this.state.profile.person ? this.state.profile.person.firstname : "---"}</h3>
                                                </div>

                                                <div className="col-md-4 mb-3">
                                                    <p className="small mb-1 font-weight-500 text-muted">Other Name</p>
                                                    <h3>{this.state.profile.person ? this.state.profile.person.othername : "---"}</h3>
                                                </div>

                                                <div className="col-md-8 mb-3">
                                                    <p className="small mb-1 font-weight-500 text-muted">Email Address</p>
                                                    <h3>{this.state.profile.person ? this.state.profile.person.email : "---"}</h3>
                                                </div>

                                                <div className="col-md-4 mb-3">
                                                    <p className="small mb-1 font-weight-500 text-muted">Phone Number</p>
                                                    <h3>{this.state.profile.person ? this.state.profile.person.phoneNo : "---"}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {this.state.currentMenu === "acad" ? (
                                <div className="card bg-white">
                                    <div className="card-body">
                                        <div className="d-flex flex-wrap align-items-center">
                                            <div className="profile-icon-lg">
                                                <Unicons.UilGraduationCap size="60" className="" />
                                            </div>

                                            <div>
                                                <h2 className="mb-0">
                                                    {this.state.newProfileLName} {this.state.newProfileFName}
                                                </h2>

                                                <h5 className="text-muted d-inline-block">{this.state.profile.person ? this.state.profile.matricNumber : "---"}</h5>
                                            </div>
                                        </div>

                                        <hr className="my-3" />

                                        <div>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <p className="small mb-1 font-weight-500 text-muted">Matric Number</p>
                                                    <h3>{this.state.profile.person ? this.state.profile.matricNumber : "---"}</h3>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <p className="small mb-1 font-weight-500 text-muted">School</p>
                                                    <h3>{this.state.profile.department ? this.state.profile.department.facultySchool.name : "---"}</h3>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <p className="small mb-1 font-weight-500 text-muted">Department</p>
                                                    <h3>
                                                        <span className="capital">{this.state.profile.department ? this.state.profile.department.name : "---"}</span>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {this.state.currentMenu === "auth" ? (
                                <div className="card bg-white">
                                    <div className="card-body">
                                        <div className="d-flex flex-wrap align-items-center">
                                            <div className="profile-icon-lg">
                                                <Unicons.UilPadlock size="60" className="" />
                                            </div>

                                            <div>
                                                <h2 className="mb-0">
                                                    {this.state.newProfileLName} {this.state.newProfileFName}
                                                </h2>

                                                <button className="btn btn-sm btn-outline-primary mt-2" onClick={() => this.setState({ editPassword: true })}>
                                                    Change Password
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                <Modal isOpen={this.state.editProfile} toggle={this.toggleEditProfile} className="mt-5 md" size="lg">
                    <form onSubmit={(e) => this.editProfile(e)}>
                        <ModalHeader toggle={this.toggleEditProfile}>
                            <span className="h2">Edit Profile</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="form-group row">
                                <div className="col-md-6 ">
                                    <label className="mt-3 mr-2 ">
                                        <b>First Name:</b>
                                    </label>

                                    <div className="">
                                        <input
                                            id="clearName"
                                            type="text"
                                            className="form-control"
                                            value={this.state.newProfileFName}
                                            onChange={(e) =>
                                                this.setState({
                                                    newProfileFName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-3 mr-2 ">
                                        <b>Last Name:</b>
                                    </label>

                                    <div className="">
                                        <input
                                            id="clearName"
                                            type="text"
                                            className="form-control"
                                            value={this.state.newProfileLName}
                                            onChange={(e) =>
                                                this.setState({
                                                    newProfileLName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-3 mr-2 ">
                                        <b>Email Address:</b>
                                    </label>

                                    <div className="">
                                        <input
                                            id="clearName"
                                            type="email"
                                            className="form-control"
                                            value={this.state.newProfileEmail}
                                            onChange={(e) =>
                                                this.setState({
                                                    newProfileEmail: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="mt-3 mr-2 ">
                                        <b>Phone Number:</b>
                                    </label>

                                    <div className="">
                                        <input
                                            id="clearName"
                                            type="text"
                                            className="form-control"
                                            value={this.state.newProfilePhone}
                                            onChange={(e) =>
                                                this.setState({
                                                    newProfilePhone: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6 mt-3">
                                    {this.state.EditProfileFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all fields.
                                            </p>
                                        </div>
                                    ) : null}

                                    {this.state.error ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-3">
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
                                Edit Profile
                                {this.state.editProfileLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.editProfileLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={() => this.setState({ editProfile: false })}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.editPassword} toggle={this.toggleEditPassword} className="mt-5 md">
                    <form onSubmit={(e) => this.editPassword(e)}>
                        <ModalHeader toggle={this.toggleEditPassword}>
                            <span className="h2">Change Password</span>
                        </ModalHeader>

                        <ModalBody>
                            <div className="form-group row">
                                <div className="col-md-12 ">
                                    <label className="mt-3 mr-2 ">
                                        <b>Old Password:</b>
                                    </label>

                                    <div className="">
                                        <input
                                            id="clearName"
                                            type="password"
                                            className="form-control"
                                            value={this.state.oldPassword}
                                            onChange={(e) =>
                                                this.setState({
                                                    oldPassword: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-12 ">
                                    <label className="mt-3 mr-2 ">
                                        <b>New Password:</b> &nbsp; &nbsp;{" "}
                                        <small id="error" style={{ color: `${this.state.color}`, fontSize: "12px" }}>
                                            {this.state.errMessage}
                                        </small>
                                    </label>

                                    <div className="">
                                        <input
                                            id="clearName"
                                            type="password"
                                            className="form-control"
                                            //    value={this.state.newPassword}
                                            onChange={(e) => this.checkpw(e)}
                                            //    onChange={(e) => this.setState({
                                            // 	   newPassword: e.target.value,
                                            //    })}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-12 mt-3">
                                    {this.state.EditPasswordFormIncomplete ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-3 custom-form-alert">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilExclamationCircle size="20" /> Please fill in all fields.
                                            </p>
                                        </div>
                                    ) : null}

                                    {this.state.error ? (
                                        <div className="bg-danger border-rad-full text-center p-2 mb-3">
                                            <p className="small text-white mb-0">
                                                <Unicons.UilBell size="20" /> {this.state.errorMessage}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <button
                                className="btn btn-primary"
                                id="changeBtn"
                                // style={{}}
                            >
                                Change Password
                                {this.state.editPasswordLoading ? (
                                    <span className="ml-2">
                                        <ClipLoader size={20} color={"#fff"} Loading={this.state.editPasswordLoading} />
                                    </span>
                                ) : null}
                            </button>

                            <button type="button" className="btn btn-danger" onClick={() => this.setState({ editPassword: false })}>
                                Close
                            </button>
                        </ModalFooter>
                    </form>
                </Modal>
            </>
        );
    }
}

export default StudentProfile;
