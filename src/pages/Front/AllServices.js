import React, {useRef, useState} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {useMergeState} from "../../utils/helpers";
import ClipLoader from "react-spinners/ClipLoader";
import ServiceCardCollection from "../../components/Cards/Services/ServiceCardCollection";

const Services = props => {

    const [searchResult, setSearchResult] = useState([])
    const [searchText, setSearchText] = useState()
    const [searching, setSearching] = useState(false)
    const [searchXhrStatus, setSearchXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });

    let timer = useRef();
    const handleSearchInput = (e) => {
        if (timer.current)
            clearTimeout(timer.current)

        const text = e.target.value;
        setSearchText(text)
        timer.current = setTimeout(() => {
            search(text);
        }, 1000)
    };

    const search = (text) => {
        setSearchXhrStatus({loading: !!text})
        setSearching(!!text);

        Endpoint.getShopServices({search: text ? text : searchText})
            .then(res => setSearchResult(res.data.data))
            .finally(r => setSearchXhrStatus({loading: false}));
    }

    const override = {
        display: 'block',
        margin: '0 auto',
    };

    const services = searching ? searchResult : props[stateKeys.SERVICES];
    const reduxLoading = !props[stateKeys.SERVICES].length

    return <>
        <div className="page-title-overlap bg-green-dark pt-4">
            <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
                <div className="pr-lg-4 text-center text-lg-left">
                    <h1 className="h3 text-light mb-0">All Services</h1>
                </div>
                <div>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Search Services"
                               onKeyUp={handleSearchInput}/>
                        <button className="btn btn-green-dark" type="button"
                                id="button-addon2" onClick={() => search()}>Search
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="container">

            <div className="row mb-5">
                {
                    searching ?
                        <>
                            <p className="cursor-pointer text-white col-12 font-weight-bold"
                               onClick={() => setSearching(false)}>
                                <i className="czi-arrow-left-circle mr-2"/>
                                Show All Services
                            </p>
                            <br/>
                        </>
                        : null
                }
                {
                    searchXhrStatus.loading || reduxLoading ?
                        <div className="col-lg-12">
                            <div className="sweet-loading my-5vh mr-3">
                                <div className="row justify-content-center">
                                    <div className="col-md-3">
                                        <div className=" product-card box-shadow">
                                            <div className="card-body">
                                                <ClipLoader
                                                    css={override}
                                                    size={70}
                                                    color={"#FF9595"}
                                                    loading={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <ServiceCardCollection services={services}>
                            <div className="col-lg-12 p-2">
                                <h6 className="text-center bg-white rounded py-5 px-3">
                                    {searching ? "Search yielded no results" : 'No service available'}
                                </h6>
                            </div>
                        </ServiceCardCollection>
                }
            </div>

        </div>

    </>
}


export default connect(mapStateToProps, mapDispatchToProps)(Services);
