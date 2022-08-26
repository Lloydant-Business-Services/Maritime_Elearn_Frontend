import React from 'react';

class ErrorScreen extends React.Component {
    render() {
        return (
            <div className={'container'}
                 style={{
                     'textAlign': 'center',
                     'margin': '30px auto'
                 }}>
                <h1>:(</h1>
                <h4>{this.props.title ? this.props.title : 'Could not retrieve data at this time'}</h4>
                {this.props.children ? this.props.children : <p>Please try again later.</p>}
            </div>
        );
    }
}

export default ErrorScreen