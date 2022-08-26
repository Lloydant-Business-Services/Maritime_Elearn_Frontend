import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";

class Terms extends Component {

    componentDidMount() {
        this.props.setState('terms', stateKeys.PAGE_CLASS);
    }

    render() {
        return (
            <>
                <section className={'container py-4'}>
                    <h1>Terms and Conditions</h1>
                    <div>
                        <p>Terms and condition under review, check back later</p>
                    </div>
                </section>
            </>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Terms);
