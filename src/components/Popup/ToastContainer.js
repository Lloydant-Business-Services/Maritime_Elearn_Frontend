import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import {isSmallScreen} from "../../utils/helpers";


const ToastContainer = props => {
    return <>
        <div id='__toast' style={{
            position: 'fixed',
            textAlign: isSmallScreen() ? 'center' : 'left',
            top: isSmallScreen() ? 'auto' : '100px',
            bottom: isSmallScreen() ? '0' : 'auto',
            width: isSmallScreen() ? '100%' : 'auto',
            zIndex: '2000',
            right: isSmallScreen() ? '0' : '50px',
        }}>
            {
                props[stateKeys.TOAST].length ?
                    props[stateKeys.TOAST].map((text, i) => text &&
                        <div key={i} className='animated slideInUp' style={{
                            backgroundColor: '#333',
                            color: '#fff',
                            visibility: 'visible',
                            opacity: '1',
                            padding: '10px',
                            minWidth: '100px',
                            marginTop: '5px',
                            width: isSmallScreen() ? '100%' : 'auto',
                            borderRadius: isSmallScreen() ? '0px' : '5px',
                        }}>
                            {text}
                        </div>
                    ) : null
            }

        </div>
    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(ToastContainer)