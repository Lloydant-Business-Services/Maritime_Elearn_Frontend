import axios from "axios";
import { notify, objectToHTTPQuery } from "./helpers";
import { getUserToken, logOutUser, rememberRoute } from "./auth";

let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    token: localStorage.getItem("token"),
};

let fileHeaders = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    token: localStorage.getItem("token"),
};

export const baseContentURL = "https://backendmaritimeelearning.lloydant.com/api";

const Endpoint = {
    init: () => {
        // accountId = process.env.REACT_APPg5b657_ACCOUNT_ID;
        let token = getUserToken();
        if(token) axios.defaults.headers.common["Authorization"] = token
        axios.defaults.baseURL = "https://backendmaritimeelearning.lloydant.com/api";
        //axios.defaults.baseURL = "http://10.211.55.3/ELearnNG/api";
        // Intercept 401 HTTP Error code in API
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (!error.response) {
                    //No response
                    // notify("Seems like you're offline, check internet connection")
                } 
                else if (
                    error.response &&
                    error.response.status === 401 &&
                    error.response.config.url !== "/login"
                ) {
                    rememberRoute();
                    logOutUser();
                }
                return Promise.reject(error.response);
            }
        );
    },
    // ---Auth--- //
    login: (data) => {
        return axios.post(`/User/Authenticate`, data, headers);
    },

    // ---Institution Details--- //
    getInstitutionDetails: () => {
        return axios.get(`/SchoolAdmin/InstitutionDetailCount`, headers);
    },

    // ---Faculty & Department--- //
    createFaculty: (data) => {
        return axios.post(`/FacultySchool/AddFacultySchool`, data, headers);
    },

    getAllFaculties: (isAdmin) => {
        return axios.get(`/FacultySchool/GetFaculties?isAdmin=${isAdmin}`, headers);
    },

    editFaculty: (data) => {
        return axios.put(`/FacultySchool`, data, headers);
    },

    deleteFaculty: (id) => {
        console.log(id, 'data=====')
        return axios.post(`/FacultySchool/DeleteFacultySchool?id=${id}`, headers);
    },

    createDepartment: (data) => {
        return axios.post(`/Department/AddDepartment`, data, headers);
    },

    editDepartment: (data) => {
        return axios.put(`/Department`, data, headers);
    },

    getAllDepartments: () => {
        return axios.get(`/Department/GetDepartments`, headers);
    },

    deleteDepartment: (data) => {
        return axios.post(`/Department/DeleteDepartment?id=${data.id}`, headers);
    },
    deleteInstructor: (data) => {
        return axios.post(`/InstructorHod/RemoveInstructor?userId=${data}`, headers);
    },
    deleteHod: (data) => {
        return axios.post(`/InstructorHod/RemoveHod?DepartmentId=${data}`, headers);
    },

    getDepartmentsByFaculty: (data, isAdmin) => {
        return axios.get(
            `/Department/GetDepartmentsByFacultyId?facultyId=${data}&isAdmin=${isAdmin}`,
            headers
        );
    },

    // ---Session & Semester--- //
    createSession: (data) => {
        return axios.post(`/Session`, data, headers);
    },
    

    createSemester: (data) => {
        return axios.post(`/Semster/AddSemester`, data, headers);
    },

    getAllSessions: () => {
        return axios.get(`/Session`, headers);
    },

    getAllSemesters: () => {
        return axios.get(`/Semster/GetAllSemester`, headers);
    },

    setSessionSemester: (data) => {
        return axios.post(
            `/SessionSemester/SetSessionSemester?sessionId=${data.sessionId}&semesterId=${data.semesterId}&userId=${data.userId}`,
            data,
            headers
        );
    },

    getActiveSessionSemester: () => {
        return axios.get(`/SessionSemester/GetActiveSessionSemester`, headers);
    },
    getAllSessionSemester: () => {
        return axios.get(`/SessionSemester/GetALLSessionSemester`, headers);
    },
    getAudits: () => {
        return axios.get(`/SchoolAdmin/GetAudits`, headers);
    },
    // ---Roles--- //
    getAllRoles: () => {
        return axios.get(`/Role/GetRoles`, headers);
    },

    // User
    getUserProfile: (data) => {
        return axios.get(`/User/UserProfile?userId=${data}`, headers);
    },

    updateUserProfile: (data) => {
        return axios.post(`/User/ProfileUpdate`, data, headers);
    },

    changePassword: (data) => {
        return axios.post(`/User/ChangePassword`, data, headers);
    },

    // ---Students--- //
    createStudents: (data, id) => {
        return axios.post(
            `/SchoolAdmin/StudentExcelUpload?departmentId=${id}`,
            data,
            fileHeaders
        );
    },

    getAllStudents: () => {
        return axios.get(`/SchoolAdmin/GetAllStudents`, headers);
    },

    getStudentStats: (data) => {
        return axios.get(
            `/Assignment/StudentPersonStats?PersonId=${data}`,
            headers
        );
    },

    getStudentsByDepartmentId: (data) => {
        return axios.get(
            `SchoolAdmin/GetStudentsDepartmentId?DepartmentId=${data}`,
            headers
        );
    },

    // Courses
    createCourse: (data) => {
        return axios.post(`/Course/AddCourses`, data, headers);
    },

    getAllCourses: () => {
        return axios.get(`/Course/GetAllCourses`, headers);
    },

    // getCoursesByDepart: () => {
    //     return axios.get(`/Course/GetAllCourses`, headers);
    // },
    getAllocatedCourses: () => {
        return axios.get(`/Course/GetAllocatedCourses`, headers);
    },

    allocateCourse: (data) => {
        return axios.post(`/CourseAllocation/AllocateCourse`, data, headers);
    },

    getCoursesByDepartment: (data) => {
        return axios.get(
            `/Course/GetDepartmentalCourses?departmentId=${data}`,
            headers
        );
    },

    createInstructorandHod: (data) => {
        return axios.post(
            `/InstructorHod/AddCourseInstructorAndHod`,
            data,
            headers
        );
    },

    registerCourse: (data) => {
        return axios.post(
            `/CourseRegistration/RegisterCourseSingle`,
            data,
            headers
        );
    },
    modifyCourseTopic: (topicId, data) => {
        return axios.post(
            `CourseMaterial/EditCourseTopic?TopicId=${topicId}`,data, headers
        );
    },
    
    getRegisteredCourses: (data) => {
        return axios.get(
            `/CourseRegistration/GetRegisteredCourses?personId=${data.personId}&sessionSemesterId=${data.sessionSemesterId}`,
            headers
        );
    },

    createCourseTopic: (data) => {
        return axios.post(`/CourseMaterial/CreateCourseTopic`, data, headers);
    },

    getCourseTopics: (data) => {
        console.log(data, 'data===')
        return axios.get(
            `/CourseMaterial/GetCourseTopicByCourseAllocaionId?CourseAllocationId=${data}`,
            headers
        );
    },

    getTopicContent: (data) => {
        return axios.get(
            `/CourseMaterial/GetContentByTopic?TopicId=${data}`,
            headers
        );
    },

    createTopicContent: (data) => {
        return axios.post(`/CourseMaterial/CreateCourseContent`, data, fileHeaders);
    },

    deleteTopic: (data) => {
        return axios.post(`/CourseMaterial/DeleteCourseTopic?TopicId=${data}`, fileHeaders);
    },

    getCourseMaterialsByDepartment: (data) => {
        return axios.get(
            `/CourseMaterial/GetCourseMaterialByDepartmentId?DepartmentId=${data}`,
            headers
        );
    },

    registerCoursesInBulk: (data) => {
        return axios.post(`/CourseRegistration/RegisterCoursesBulk`, data, headers);
    },
//Quiz

createQuiz: (data) => {
    return axios.post(`/Quiz/CreateQuiz`, data, fileHeaders);
},
getCourseQuiz: (data) => {
    console.log(data, 'data===')
    return axios.get(
        `/Quiz/ListQuizByCourseId?courseId=${data}`,
        headers
    );
},

getQuiz: (data) => {
    return axios.get(
        `/Quiz/GetQuizByQuizId?QuizId=${data}`,
        headers
    );
},

getQuizSubmissions: (data) => {
    return axios.get(
        `/Quiz/GetAllQuizSubmissionByAssignemntId?QuizId=${data}`,
        headers
    );
},
getCourseQuiz: (data) => {
    console.log(data, 'data===')
    return axios.get(
        `/Quiz/ListQuizByCourseId?courseId=${data}`,
        headers
    );
},
getStudentQuizSubmission: (data) => {
    return axios.get(
        `/Quiz/GetQuizSubmissionBy?QuizId=${data.assignmentId}&StudentUserId=${data.studentId}`,
        headers
    );
},
submitStudentQuiz: (data) => {
    return axios.post(`/Quiz/SubmitStudentQuiz`, data, fileHeaders);
},
getQuizSubmissionById: (data) => {
    return axios.get(
        `/Quiz/GetQuizSubmissionById?QuizSubmissionId=${data}`
    );
},
gradeQuizSubmission: (data) => {
    return axios.post(`/Quiz/GradeQuiz`, data, headers);
},

publishQuizScores: (data) => {
    return axios.post(`/Quiz/PublishResultQuiz`, data, headers);
},
    // Assignments
    createAssignment: (data) => {
        return axios.post(`/Assignment/CreateAssignment`, data, fileHeaders);
    },


    editAssignment: (data) => {
        return axios.post(`/Assignment/EditAssignment`, data, fileHeaders);
    },

    deleteAssignment: (data) => {
        return axios.post(`/Assignment/DeleteAssignment`, data, fileHeaders);
    },
    deleteQuiz: (data) => {
        return axios.post(`/Quiz/DeleteQuiz`, data, fileHeaders);
    },
    getCourseAssignments: (data) => {
        console.log(data, 'data===')
        return axios.get(
            `/Assignment/ListAssignmentByCourseId?courseId=${data}`,
            headers
        );
    },

    submitStudentAssignment: (data) => {
        return axios.post(`/Assignment/SubmitStudentAssignment`, data, fileHeaders);
    },

    getAssignment: (data) => {
        return axios.get(
            `/Assignment/GetAssignmentByAssignmentId?AssignmentId=${data}`,
            headers
        );
    },

    getAssignmentSubmissions: (data) => {
        return axios.get(
            `/Assignment/GetAllAssignmentSubmissionByAssignemntId?AssignmentId=${data}`,
            headers
        );
    },

    getStudentAssignments: (data) => {
        return axios.get(
            `/Assignment/ListAssignmentByStudentId?StudentUserId=${data}`,
            headers
        );
    },

    getStudentAssignmentSubmission: (data) => {
        return axios.get(
            `/Assignment/GetAssignmentSubmissionBy?AssignmentId=${data.assignmentId}&StudentUserId=${data.studentId}`,
            headers
        );
    },

    getAssignmentSubmissionById: (data) => {
        return axios.get(
            `/Assignment/GetAssignmentSubmissionById?AssignmentSubmissionId=${data}`
        );
    },

    publishAssignmentScores: (data) => {
        return axios.post(`/Assignment/PublishResultAssignment`, data, headers);
    },

    gradeAssignmentSubmission: (data) => {
        return axios.post(`/Assignment/GradeAssignment`, data, headers);
    },

    extendAssignmentDueDate: (data) => {
        return axios.post(`/Assignment/ExtendAssignmentDueDate`, data, headers);
    },

    // HODs
    getDepartmentDetails: (data) => {
        return axios.get(
            `/InstructorHod/HODDashboardSummary?DepartmentId=${data}`,
            headers
        );
    },

    createHod: (data) => {
        return axios.post(
            `/InstructorHod/AddCourseInstructorAndHod`,
            data,
            headers
        );
    },

    getHodsByFaculty: (data) => {
        return axios.get(
            `/Department/GetDepartmentHeadsByFacultyId?facultyId=${data}`,
            headers
        );
    },

    assignHod: (data) => {
        return axios.post(`/Department/AssignDepartmentHead`, data, headers);
    },

    // Instructors
    getInstructorsByDepartment: (data) => {
        return axios.get(
            `/InstructorHod/GetInstructorsByDepartmentId?departmentId=${data}`,
            headers
        );
    },

    getAllocatedCoursesByDepartment: (data) => {
        return axios.get(
            `/Course/GetAllocatedCoursesByDepartment?departmentId=${data}`,
            headers
        );
    },

    

    createInstructor: (data) => {
        return axios.post(
            `/InstructorHod/AddCourseInstructorAndHod`,
            data,
            headers
        );
    },

    getAllInstructors: () => {
        return axios.get(`/InstructorHod/GetInstututionInstructors`, headers);
    },

    getAllInstitutionStaff: (data) => {
        return axios.get(`/InstructorHod/GetInstututionInstructorsAndHodPerson?searchInput=${data}`, headers);
    },

    getInstructorCourses: (data) => {
        return axios.get(
            `InstructorHod/GetInstructorCoursesByUserId?instructorUserId=${data}`,
            headers
        );
    },

    //SubInstructors
    getCourseSubInstructors: (data) => {
        return axios.get(
            `SubInstructor/GetCourseSubIntructors?courseId=${data}`,
            headers
        );
    },

    getSubInstructorCourses: (data) => {
        return axios.get(
            `SubInstructor/GetSubInstructorCourses?SubInstructorId=${data}`,
            headers
        );
    },

    addSubInstructor: (data) => {
        return axios.post(`SubInstructor/AddSubInstructor`, data, headers);
    },

    removeSubInstructor: (data) => {
        return axios.post(`SubInstructor/DeleteSubInstructor?Id=${data}`, headers);
    },
//Email Notifications
    getEmailNotifications: (data) => {
        return axios.get(
            `User/GetNotificationTrackersByUserId?userId=${data}`,
            headers
        );
    },
    // Announcements
    createAnnouncement: (data) => {
        return axios.post(`/Announcement/AddAnnouncement`, data, headers);
    },

    getAnnouncements: (data) => {
        return axios.get(
            `/Announcement/GetAnnouncement?departmentId=${data}`,
            headers
        );
    },
    
    // Live Lectures
    createLecture: (data) => {
        return axios.post(`/LiveLecture/CreateMeeting`, data, headers);
    },

    deleteLiveLecture: (data) => {
        console.log(data,  "dataaa=====")
        return axios.post(`/LiveLecture/DeleteLiveLecture?LiveLectureId=${data}`, headers);
    },

    getInstructorLiveLectures: (data) => {
        return axios.get(
            `/LiveLecture/GetLiveLecturesByInstructor?InstructorId=${data}`,
            headers
        );
    },

    getCourseMeetings: (data) => {
        return axios.get(
            `/LiveLecture/GetMeetingByCourseId?courseId=${data}`,
            headers
        );
    },

    // Levels
    getAllLevels: () => {
        return axios.get(`/Level/GetLevels`, headers);
    },

    // Reports
    getDeptInstructorsReport: (data) => {
        return axios.get(
            `/Reporting/GetInstructors?departmentId=${data.departmentId}&sessionSemesterId=${data.sessionSemesterId}`,
            headers
        );
    },

    getDeptStudentsReport: (data) => {
        return axios.get(
            `/Reporting/GetStudentsBy?DepartmentId=${data.departmentId}&SessionSemesterId=${data.sessionSemesterId}`,
            headers
        );
    },

    getAssignmentCummulativeScoreReport: (data) => {
        return axios.get(
            `/Reporting/AssignmentCumulativeScore?courseId=${data.courseId}&SessionSemesterId=${data.sessionSemesterId}&departmentId=${data.departmentId}`,
            headers
        );
    },
    getStudentAssignmentSessionSemesterReport: (personId, sessionsemesterId) => {
        return axios.get(
            `/Reporting/CumulativeComprehensiveAssignmentReportByStudent?personId=${personId}&sessionSemesterId=${sessionsemesterId}`,
            headers
        );
    },
    
    getAllAssignments: (data) => {
        return axios.get(
            `/Reporting/ComprehensiveAssignmentReport?courseId=${data.courseId}&SessionSemesterId=${data.sessionSemesterId}&departmentId=${data.departmentId}`,
            headers
        );
    },
    // ---Password Reset--- //
    resetPassword: (data) => {
        return axios.post(`/User/ResetPassword?Username=${data}`, headers);
    },

    validatePasswordOTP: (email, otp) => {
        return axios.post(`/User/ValidateOTP?email=${email}&otp=${otp}`, headers);
    },

    //Payments
    getDefaultPayment: () => {
        return axios.get(
            `/Payment/DefaultPaymentSetup`,
            headers
        );
    },
    initializeTransaction: (userId, setupId) => {
        return axios.post(`/Payment/InitializeTransaction?userId=${userId}&setupId=${setupId}`, headers);
    },
    updateTransaction: (data) => {
        return axios.post(`/Payment/UpdatePayment?reference=${data}`, headers);
    },
   
    addSingleStudent: (departmentId, data) => {
        return axios.post(`/SchoolAdmin/AddSingleStudent?departmentId=${departmentId}`,data, headers);
    },
    deactivateStudent: (data) => {
        return axios.post(`/SchoolAdmin/DeleteStudent?studentPersonId=${data}`, headers);
    },
    
};

export default Endpoint;