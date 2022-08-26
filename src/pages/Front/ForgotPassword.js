import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";

class ForgotPassword extends Component {

    render() {
        return (
            <>
                <section className="page">

                </section>
            </>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);