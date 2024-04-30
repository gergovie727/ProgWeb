import { useState, useEffect } from 'react';
import moment from 'moment';
import './Henk.css';

function Henk(props) {
    const [username, setUsername] = useState("");
    const [formattedDate, setFormattedDate] = useState("");

    useEffect(() => {
        setFormattedDate(moment(props.time).format('YYYY-MM-DD HH:mm'));
        getUsernameFromId();
    }, []);

    const viewProfile = () => {
        if(props.userId !== "self") {
            props.userId(props.user);
            props.profilePage();
        }
    };

    const getUsernameFromId = () => {
        fetch(`/api/user/${props.user}`)
        .then(res => res.json())
        .then(data => {
            setUsername(data.user.username);
        });
    };

    const deleteTweet = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(`/api/tweet/delete/${props.tweetId}`, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data.message);
        })
        .then(() => props.fetchTweets());
    };

    return (
        <li>
            <div id="Henk">
                <div class="textDiv">
                    <label class="username" onClick={viewProfile}>{username}</label>
                </div>
                <div class="textDiv">
                    <label class="henk">{props.message}</label>
                </div>
                <div class="timestampDiv">
                    <label class="timestamp">{formattedDate}</label>
                </div>
                <button onClick={deleteTweet} class="deleteButton" style={{ display : props.isDelete ? "block" : "none" }}>Delete Henk</button>
            </div>
        </li>
    );
}

export default Henk;