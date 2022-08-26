import React from 'react'
import './ArticleCard.css';
import {Link} from "react-router-dom";

const ArticleCard = (props) => {
    return (
        <div className={'article-card'}>
            <div className={'line'}></div>
            <div className={'body'}>
                <h3><Link to={'/articles/' + props.slug}>{props.title}</Link></h3>
                <p>{props.children}</p>
                <Link to={'/articles/' + props.slug}>read more</Link>
            </div>
        </div>
    )
};

export default ArticleCard
