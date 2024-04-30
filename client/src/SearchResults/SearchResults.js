import { useState, useEffect } from "react";
import Henk from "../Henk/Henk";
import './SearchResults.css'

function SearchResults(props) {
    
    let [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetch("/api/tweet")
        .then(res => res.json())
        .then(data => {
            let tweets = data.tweets;
            let tempResults = [];

            tweets.forEach(tweet => {
                if(tweet.message.toUpperCase().indexOf(props.searchCriteria.toUpperCase()) > -1) {
                    tempResults.push(tweet);
                }
            });
            setSearchResults(tempResults);
        });
    });
    
    
    return (
        <div id="searchresults">
            <ul class="searchstyle">
                {
                    searchResults.map((henk) => <Henk user={henk.user} message={henk.message} time={henk.createdAt} userId={"self"} isDelete={false} />)
                }
            </ul>
        </div>
    );
}

export default SearchResults;