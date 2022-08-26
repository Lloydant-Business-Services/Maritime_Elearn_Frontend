import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import ContactUs from "../../components/Cards/ContactUsForm";
import ContactCards from "../../components/Cards/ContactCards";

class Contact extends Component {

    componentDidMount() {
        this.props.setState('about', stateKeys.PAGE_CLASS);
    }

    render() {
        return (
            <>
                <section>
                    <ContactUs/>
                    <hr/>
                    <ContactCards/>
                </section>
            </>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Contact);
