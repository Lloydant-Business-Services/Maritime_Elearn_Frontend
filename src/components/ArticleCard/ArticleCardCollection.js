import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import ArticleCard from "./ArticleCard";
import Endpoint from "../../utils/endpoint";
import ErrorScreen from "../ErrorScreen/ErrorScreen";
import ArticleCardsLoading from "../Loader/ArticleCardsLoading";
import ReactPaginate from 'react-paginate';

class ArticleCardCollection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'items': [],
            'page': 1,
            'total_count': 0,
            'last_page': 1,
            'chunk': 2,
            'view': null
        }
    }

    componentDidMount() {
        this.loadArticlesFromServer();
    }

    loadArticlesFromServer() {
        const parent = this;
        parent.setState({view: null});
        //Make Ajax call
        let xhr = Endpoint.getArticles({
            'perPage': this.props.perPage ? this.props.perPage : 10,
            'page': this.state.page,
            'chunk': this.state.chunk,
        });
        xhr.then(res => {
            parent.setState({
                items: res.data.data.data,
                total_count: res.data.data.total,
                last_page: res.data.data.last_page,
                view: 1
            });
        }).catch(function () {
            parent.setState({view: 0});
        })
    }

    handlePageClick = data => {
        let selected = data.selected;
        this.setState({page: selected + 1, view: null}, () => {
            window.scrollTo(0, 0);
            this.loadArticlesFromServer();
        });
    };

    render() {
        switch (this.state.view) {
            case 0:
                return <ErrorScreen/>
            case 1:
                let pkey = 1;
                const screen = (this.state.items.map(itemRow => {
                    let items = [];
                    for (let key in itemRow)
                        if (itemRow.hasOwnProperty(key))
                            items.push(
                                <div className="col-1" key={key}>
                                    <ArticleCard slug={itemRow[key].slug} title={itemRow[key].title}>
                                        {itemRow[key].subtitle}
                                    </ArticleCard>
                                </div>)

                    return <div className={'grid'} key={pkey++}>{items}</div>
                }));

                let paginator;
                if (typeof this.props.perPage === 'undefined')
                    paginator =
                        <ReactPaginate
                            pageCount={this.state.last_page}
                            marginPagesDisplayed={3}
                            pageRangeDisplayed={2}
                            forcePage={this.state.page - 1}
                            previousLabel={'<<'}
                            nextLabel={'>>'}
                            breakLabel={'...'}
                            breakClassName={'break'}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                        />
                return (<>
                    {screen}
                    {paginator}
                </>);
            default:
                return <ArticleCardsLoading/>
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ArticleCardCollection);
