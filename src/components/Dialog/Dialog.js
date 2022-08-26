import React from 'react'
import './Dialog.css';
import ReactModal from 'react-modal';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";

class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

        this.props.setState(this.handleOpenModal, stateKeys.OPEN_DIALOG);
        this.props.setState(this.handleCloseModal, stateKeys.CLOSE_DIALOG);
    }

    componentDidMount() {
        ReactModal.setAppElement('main');
    }

    handleOpenModal() {
        this.setState({showModal: true});
    }

    handleCloseModal() {
        this.setState({showModal: false});
    }

    render() {
        const okAction = this.props[stateKeys.DIALOG_ACTION] ?
            <button className={'btn btn-success'} onClick={this.props[stateKeys.DIALOG_ACTION]}>
                {this.props[stateKeys.DIALOG_ACTION_TEXT]}</button> : '';
        const title = this.props[stateKeys.DIALOG_TITLE] ?
            <h2 className={'modal-title'}>{this.props[stateKeys.DIALOG_TITLE]}</h2> : '';
        const body = this.props[stateKeys.DIALOG_CONTENT] ?
            <div className={'modal-body'}>{this.props[stateKeys.DIALOG_CONTENT]}</div> : '';

        return (
            <ReactModal
                isOpen={this.state.showModal}
                contentLabel="Dialog"
                onRequestClose={this.handleCloseModal}
                className="dialog"
                overlayClassName="dialog-overlay">
                {title}
                {body}
                <div className={'modal-footer'}>
                    <button className={'btn btn-default'} onClick={this.handleCloseModal}>Close</button>
                    {okAction}
                </div>
            </ReactModal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
