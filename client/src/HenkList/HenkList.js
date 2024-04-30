import { useState, useEffect } from "react";
import Henk from '../Henk/Henk';
import './HenkList.css';

function HenkList(props) {
    const [henks, setHenks] = useState([]);

    useEffect(() => {
        setHenks(props.henks);
        fetchTweets();
    }, []);

    const fetchTweets = () => {
        fetch("/api/tweet")
        .then(res => res.json())
        .then(data => {
            setHenks(data.tweets);
        });
    }

    return (
        <div class="henkList">
            <ul class="listStyle">
                {
                    henks.map((henk) => <Henk user={henk.user} message={henk.message} time={henk.createdAt} profilePage={props.profilePage} userId={props.userId} isDelete={false} />)
                }
            </ul>
        </div>
    );
}

export default HenkList;