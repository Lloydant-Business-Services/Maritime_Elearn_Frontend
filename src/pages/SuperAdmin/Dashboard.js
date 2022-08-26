import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import axios from "axios";
import {Link} from "react-router-dom"


class SuperAdminDashboard extends Component {
	state = {};

	render() {
		return (
			<>
				Super Admin Dash
			</>
			
		)
	}

}

export default connect(mapStateToProps, mapDispatchToProps)(SuperAdminDashboard);