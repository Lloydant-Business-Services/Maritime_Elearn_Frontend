import React, {Component} from 'react';
import ErrorScreen from "../components/ErrorScreen/ErrorScreen";
import {Link} from "react-router-dom";

export default class PageNotFound extends Component {

    render() {
        return <>
            <ErrorScreen title={'Page Not Found'}>
                <p>We could not locate the page you're looking for</p>
                <div style={{
                    'margin': 'auto auto 30px auto',
                    'width': '350px',
                    'textAlign': 'left',
                    'padding': '10px',
                    'backgroundColor': '#DAECD2',
                    'border': '1px solid #026E33'
                }}>
                    You can try:
                    <ul>
                        <li><Link to={'/'}>Returning to Homepage</Link></li>
                    </ul>
                </div>
            </ErrorScreen>
        </>
    }
}
