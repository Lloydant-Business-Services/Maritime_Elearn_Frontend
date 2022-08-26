import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            info: null
        };
    }


    componentDidCatch(error, errorInfo) {
        this.setState({
            hasError: true,
            error: error,
            info: errorInfo
        });

        // log the error to an error reporting service e.g slack
        // console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={'container'} style={{
                    'textAlign': 'center',
                    'margin': '170px auto 100px'
                }}>
                    <h1>Oops, something went wrong :(</h1>
                    <p>Please try again later.</p>
                </div>
            );
        } else {
            return this.props.children;
        }

    }
}

export default ErrorBoundary