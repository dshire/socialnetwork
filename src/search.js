import React from "react";
import { connect } from 'react-redux';
import { getSearch, clearSearch } from "./actions";
import { Link } from 'react-router';



class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }
    handleChange(e) {
        this.props.dispatch(getSearch(e.target.value));
        this.setState({
            search: e.target.value
        });
    }
    clearSearch() {
        this.props.dispatch(clearSearch());
        this.setState({
            search: ''
        });
    }
    render() {
        console.log(this.props.searchResults);
        let res;
        if(this.props.searchResults) {
            res = (
                <div className="search-results">
                    {this.props.searchResults.map(result => <div className="each-search-result"><Link to={"/user/" + result.id} onClick = {this.clearSearch}><div className="search-flex-box"><img className="search-pic" src={"http://peppermountain.s3.amazonaws.com/" + result.pic} alt={result.first + ' ' + result.last} /><p className="search-name">{result.first} {result.last}</p></div></Link></div>)}
                </div>
            );
        }
        return (
            <div className="search">
                <input type="text" onChange={this.handleChange} value={this.state.search} />
                {res}
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        searchResults: state.searchResults
    };
};

export default connect(mapStateToProps)(Search);
