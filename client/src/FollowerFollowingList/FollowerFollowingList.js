import { useState, useEffect } from "react";
import FollowerFollowing from "../FollowerFollowing/FollowerFollowing";
import './FollowerFollowingList.css'

function FollowerFollowingList(props) {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    
    useEffect(() => {
        if(props.userId === "self") {
            fetch("/api/session")
            .then(res => res.json().then(data => ({
                    resdata: data,
                    status: res.status
                    
                }))
            )
            .then(data => {
                if(data.status === 200) {
                    const userId = data.resdata.userId;

                    fetch(`/api/user/${userId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.user.followers.length > 0) {
                            setFollowers(data.user.followers);
                        }
                        if (data.user.following.length > 0) {
                            setFollowing(data.user.following);
                        }
                    });
                }
            });
        } else {
            fetch(`/api/user/${props.userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.user.followers.length > 0) {
                    setFollowers(data.user.followers);
                }
                if (data.user.following.length > 0) {
                    setFollowing(data.user.following);
                }
            });
        }
    }, []);

    return (
        <div id="profilefollow">
            <label><b>Followers</b></label>
            <ul class="followlistStyle">
                {
                    followers.map((follower) => <FollowerFollowing userId={props.userId} user={follower} followerFollowing={"followers"} />)
                }
            </ul>
            <label><b>Following</b></label>
            <ul class="followlistStyle">
                {
                    following.map((following) => <FollowerFollowing userId={props.userId} user={following} followerFollowing={"following"} />)
                }
            </ul>
        </div>
    )
}

export default FollowerFollowingList;