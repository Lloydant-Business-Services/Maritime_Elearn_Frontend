import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";

class Direction extends Component {
    componentDidMount() {
        this.props.setState('directions', stateKeys.PAGE_CLASS);
    }

    render() {
        return (
            <iframe
                title='Direction to Vian Hub Salon'
                className="map-section"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.8455134899236!2d7.477315214934956!3d9.077834990721353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0af85a59832d%3A0x7871a9d7c6b1b373!2s134%20Adetokunbo%20Ademola%20Cres%2C%20Wuse%2C%20Abuja!5e0!3m2!1sen!2sng!4v1607504806266!5m2!1sen!2sng"
                width="600"
                height="450"
                frameBorder="0"
                style={{'border': '0'}}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"/>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Direction);