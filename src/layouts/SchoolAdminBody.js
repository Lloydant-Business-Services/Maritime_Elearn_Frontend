import React, { Suspense } from "react";
import Header from "./SchoolAdminHeader";
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import { connect } from "react-redux";
import {
  mapDispatchToProps,
  mapStateToProps,
  stateKeys,
} from "../redux/actions";

import SchoolAdminDashboard from "../pages/SchoolAdmin/Dashboard";
import SchoolAdminFaculties from "../pages/SchoolAdmin/Faculties";
import SchoolAdminSession from "../pages/SchoolAdmin/SessionSemester";
import SchoolAdminHods from "../pages/SchoolAdmin/Hods";
import SchoolAdminStudents from "../pages/SchoolAdmin/Students";
import SchoolAdminInstructors from "../pages/SchoolAdmin/Instructors";
import SchoolAdminDepartments from "../pages/SchoolAdmin/Departments";
import SchoolAdminDepartmentInstructors from "../pages/SchoolAdmin/DepartmentInstructors";
import SchoolAdminDepartmentHods from "../pages/SchoolAdmin/DepartmentHods";
import SchoolAdminDepartmentStudents from "../pages/SchoolAdmin/DepartmentStudents";
import SchoolAdminProfile from "../pages/SchoolAdmin/Profile";
import SchoolAdminReportInstructor from "../pages/SchoolAdmin/ReportInstructor";
import SchoolAdminReportStudent from "../pages/SchoolAdmin/ReportStudent";
import SchoolAdminAssignmentReport from "../pages/SchoolAdmin/ReportAssignmentCummulativeScore";
import SchoolAdminAllAssignment from "../pages/SchoolAdmin/ReportAllAssignment";
import Audits from "../pages/SchoolAdmin/Audits";

const SuperAdminBody = (props) => {
  return (
    <>
      <div className={props[stateKeys.PAGE_CLASS]}>
        <section className="sidenav-enabled pb-3 pb-md-4">
          <Header />
          <ErrorBoundary>
            <Suspense fallback={<p>Loading...</p>}>
              <div className="main-content pt-md-5">
                <Switch>
                  <Route
                    path={"/schooladmin/dashboard"}
                    component={SchoolAdminDashboard}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/faculties"}
                    component={SchoolAdminFaculties}
                    exact={true}
                  />
                   <Route
                    path={"/schooladmin/audits"}
                    component={Audits}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/sessionsemester"}
                    component={SchoolAdminSession}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/hods"}
                    component={SchoolAdminHods}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/students"}
                    component={SchoolAdminStudents}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/instructors"}
                    component={SchoolAdminInstructors}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/departments"}
                    component={SchoolAdminDepartments}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/departmentinstructors"}
                    component={SchoolAdminDepartmentInstructors}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/departmenthods"}
                    component={SchoolAdminDepartmentHods}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/profile"}
                    component={SchoolAdminProfile}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/departmentstudents"}
                    component={SchoolAdminDepartmentStudents}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/instructorreport"}
                    component={SchoolAdminReportInstructor}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/studentreport"}
                    component={SchoolAdminReportStudent}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/allassignment"}
                    component={SchoolAdminAssignmentReport}
                    exact={true}
                  />
                  <Route
                    path={"/schooladmin/assignmentreport"}
                    component={SchoolAdminAllAssignment}
                    exact={true}
                  />
                </Switch>
              </div>
            </Suspense>
          </ErrorBoundary>
        </section>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SuperAdminBody);
