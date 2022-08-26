import React, {Component} from 'react';
import FrontHeader from "../../layouts/FrontHeader";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import ErrorScreen from "../../components/ErrorScreen/ErrorScreen";
import Loading from "../../components/Loader/Loading";

class Article extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'data': [],
            'view': null
        }
    }

    componentDidMount() {
        this.props.setState('article', stateKeys.PAGE_CLASS);

        const parent = this;
        parent.setState({view: null});

        let xhr = Endpoint.getArticle(this.props.match.params.article);
        xhr.then(res => {
            parent.setState({
                data: res.data.data,
                view: 1
            });
        }).catch(function () {
            parent.setState({view: 0});
        })
    }

    render() {
        let content;
        switch (this.state.view) {
            case 0:
                content = <ErrorScreen/>
                break;
            case 1:
                const date = new Date(Date.parse(this.state.data.created_at));
                const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
                content = <section className={'container'}>
                    <h1>{this.state.data.title}</h1>
                    <p className={'update-date'}>Posted {date.toLocaleDateString("en-US", options)}</p>
                    <div>{this.state.data.content}</div>
                </section>
                break;
            default:
                content = <Loading/>
        }

        return <>
            <FrontHeader/>
            {content}
        </>
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Article);
