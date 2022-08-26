import React from 'react'
import './loader.css'
import loader from './loader.gif';

const Loader = ({show}) => {

    return (show ?
            <div className='page-loader'>
                <img src={loader} alt=""/>
            </div> : ''
    )
};

export default Loader
