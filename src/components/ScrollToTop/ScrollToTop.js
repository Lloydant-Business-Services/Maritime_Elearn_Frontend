import {Component} from "react";
import {withRouter} from "react-router-dom";

class ScrollToTop extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
            const menu = document.getElementById('menu');
            if (menu)
                menu.checked = false;
        }
    }

    render() {
        return this.props.children
    }
}

export default withRouter(ScrollToTop);