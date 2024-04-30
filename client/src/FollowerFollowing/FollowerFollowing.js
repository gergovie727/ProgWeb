import { useState, useEffect } from "react";
import './FollowerFollowing.css';

function FollowerFollowing(props) {
    const [username, setUsername] = useState("");
    
    useEffect(() => {
        fetch(`/api/user/${props.user}`)
        .then(res => res.json())
        .then(data => {
            setUsername(data.user.username);
        });
    }, []);

    const unfollow = () => {
        let sessionId;
        fetch("/api/session")
        .then(res => res.json())
        .then(data => {
            sessionId = data.userId;

            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({  userId: sessionId })
            };
    
            fetch(`/api/user/unfollow/${props.user}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                 console.log(data.message);
            });
            
        });
    }

    return (
        <div class="followerfollowing">
            <li>
                <label>{username}</label>
                <button id="unfollowbutton" onClick={unfollow} style={{ display : (props.followerFollowing === "following" && props.userId === "self")? "block" : "none" }}>Unfollow</button>
            </li>
        </div>
    )
}

export default FollowerFollowing;