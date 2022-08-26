import React from 'react'
import './PageLoader.css'
import loader from './loader.gif';

const PageLoader = (props) => {
    return (
        <div id="page-loader">
            <div id="loader"
                 style={{'display': 'none'}}
                 className="text-center padding-2em">
                <img src={loader} alt=""/>
                <p className="text-center grey-text">Loading...</p>
            </div>
        </div>
    )
};

export default PageLoader
