import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import UserCart from "../../components/Cart/UserCart";

const Cart = () => {

    return <>
        <div className="page-title-overlap bg-green-dark pt-4">
            <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
                <div className="pr-lg-4 text-center text-lg-left">
                    <h1 className="h3 text-light mb-0">Cart</h1>
                </div>
            </div>
        </div>


        <div className="pt-1 pb-5">
            <section>
                <div className="pt-1 pb-5">
                    <section className="mb-5">
                        <div className="mt-3">
                            <div className="container mb-5 pb-3">
                                <div className="bg-light box-shadow-lg rounded-lg overflow-hidden min-vh-50">
                                    <UserCart paymentPage={'/payment'}/>
                                </div>
                            </div>

                        </div>
                    </section>

                </div>

            </section>
        </div>
    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);