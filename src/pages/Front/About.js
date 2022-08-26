import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import about1 from "../../assets/images/about/01.jpg";
import about6 from "../../assets/images/about/06.jpg";
import {Link} from "react-router-dom";
import ContactUs from "../../components/Cards/ContactUsForm";
import ContactCards from "../../components/Cards/ContactCards";

class About extends Component {

    componentDidMount() {
        this.props.setState('about', stateKeys.PAGE_CLASS);
    }

    render() {
        return (
            <>
                <section className="container-fluid px-0">

                    <section className="row no-gutters">
                        <div className="col-md-6 bg-position-center bg-size-cover bg-secondary"
                             style={{minHeight: '15rem', backgroundImage: `url(${about1})`,}}/>
                        <div className="col-md-6 px-3 px-md-5 py-5">
                            <div className="mx-auto py-lg-5" style={{maxWidth: '35rem'}}>
                                <h2 className="h3 pb-3">Search, Select, Book online</h2>
                                <p className="font-size-sm pb-3 text-muted">
                                    Vian Hub Salon is a true reflection of style and provides luxurious, celebrity
                                    treatment
                                    to all visitors – high-end beauty experience with a very comfortable approach. Our
                                    boundless commitment is underlined by our continued search for the very best
                                    stylists.
                                    <br/>
                                    Incorporating all the services offered that include hair styling, haircuts, manicure
                                    and nails, pedicure, facials, cleansing and more, the salon is led by respected
                                    beauty-world experts.
                                    <br/><br/>
                                    Services offered;<br/>
                                    Hair styling, Haircuts, Pedicure, Manicure and nails
                                    <br/><br/>
                                    Location:<br/>
                                    Vian Hub Salon, Shop 20, Cappador's place plaza, 134 Adetokunbo Ademola Cres, Wuse 2, Abuja
                                </p>
                                <Link className="btn btn-primary btn-shadow" to="/services">View services</Link>
                            </div>
                        </div>
                    </section>

                    <section className="row no-gutters">
                        <div className="col-md-6 bg-position-center bg-size-cover bg-secondary order-md-1"
                             style={{minHeight: '15rem', backgroundImage: `url(${about6})`,}}/>
                        <div className="col-md-6 px-3 px-md-5 py-5">
                            <div className="mx-auto py-lg-5" style={{maxWidth: '35rem'}}>
                                <h2 className="h3 pb-3">Book Online, or In Person</h2>
                                {/*<p className="font-size-sm pb-3 text-muted">Lorem ipsum dolor sit amet, consectetur*/}
                                {/*    adipiscing elit. Aliquam id purus at risus pellentesque faucibus a quis eros. In eu*/}
                                {/*    fermentum leo. Integer ut eros lacus. Proin ut accumsan leo. Morbi vitae est eget*/}
                                {/*    dolor consequat aliquam eget quis dolor. Mauris rutrum fermentum erat, at euismod*/}
                                {/*    lorem pharetra nec. Duis erat lectus, ultrices euismod sagittis at, pharetra eu*/}
                                {/*    nisl. Phasellus id ante at velit tincidunt hendrerit. Aenean dolor dolor tristique*/}
                                {/*    nec. Tristique nulla aliquet enim tortor at auctor urna nunc. Sit amet aliquam id*/}
                                {/*    diam maecenas ultricies mi eget.</p>*/}
                                <Link className="btn btn-accent btn-shadow" to="/services">Book an appointment</Link>
                            </div>
                        </div>
                    </section>
                    <hr/>
                    <ContactCards/>
                    <hr/>
                    <ContactUs/>
                </section>
            </>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(About);
