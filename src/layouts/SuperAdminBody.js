import React, {Suspense} from 'react';
import Header from "./SuperAdminHeader";
import {Route, Switch} from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../redux/actions";

import SuperAdminDashboard from "../pages/SuperAdmin/Dashboard";

const SuperAdminBody = (props) => {
	return (
		<>
			<div className={props[stateKeys.PAGE_CLASS] + ' container-fluid'}>
				<section className="sidenav-enabled row pb-3 pb-md-4">
					<div className="col-xl-12">
						<Header/>
						<ErrorBoundary>
							<Suspense fallback={<p>Loading...</p>}>
								<Switch>
									<Route path={'/admin/dashboard'} component={SuperAdminDashboard} exact={true}/>
								</Switch>
							</Suspense>
						</ErrorBoundary>
					</div>
				</section>
			</div>
		</>
	)
};

export default connect(mapStateToProps, mapDispatchToProps)(SuperAdminBody);