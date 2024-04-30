import { useState, useEffect } from "react";
import ProfileHenks from "../ProfileHenks/ProfileHenks";
import './Profile.css';

function Profile(props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [followersCount, setFollowersCount] = useState("");
    const [followingCount, setFollowingCount] = useState("");
    const [isFollowButtonVisible, setisFollowButtonVisible] = useState(false);
    const [followLabel, setFollowLabel] = useState("Follow");
    const [isFollowing, setIsFollowing] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [isStatusMessageVisible, setIsStatusMessageVisible] = useState(false);
    
    useEffect(() => {
        fetch("/api/session")
        .then(res => res.json().then(data => ({
                resdata: data,
                status: res.status
            }))
        )
        .then(data => {
            if(data.status === 200) {
                const sessionId = data.resdata.userId;

                if(props.userId === "self" || props.userId === sessionId) {
                    fetch(`/api/user/${sessionId}`)
                    .then(res => res.json())
                    .then(data => {
                        setFirstName(data.user.firstname);
                        setLastName(data.user.lastname);
                        setFollowersCount(data.user.followers.length);
                        setFollowingCount(data.user.following.length);
                        setisFollowButtonVisible(false);
                    });
                } else {
                     updateProfileDisplay(sessionId);
                }
                setStatusMessage("");
                setIsStatusMessageVisible(false);
            } else {
                if (props.userId === "self") {
                    setStatusMessage(data.resdata.message);
                    setIsStatusMessageVisible(true);
                } else {
                    updateProfileDisplay(props.userId);
                }
            }
        });
    }, []);

    const updateProfileDisplay = (sessionId) => {
        fetch(`/api/user/${props.userId}`)
        .then(res => res.json())
        .then(data => {
            // Check if current user is not in followers list
            if(data.user.followers.indexOf(sessionId) > -1) {
                setIsFollowing(true);
                setFollowLabel("Unfollow");
            } else {
                setIsFollowing(false);
                setFollowLabel("Follow");
            }

            setFirstName(data.user.firstname);
            setLastName(data.user.lastname);
            setFollowersCount(data.user.followers.length);
            setFollowingCount(data.user.following.length);
            if(props.userId === sessionId) {
                setisFollowButtonVisible(false);
            } else {
                setisFollowButtonVisible(true);
            }
        });
    }

    const followOrUnfollow = () => {
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
    
            if(isFollowing) {
                fetch(`/api/user/unfollow/${props.userId}`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    updateProfileDisplay(sessionId);
                });
            } else {
                fetch(`/api/user/follow/${props.userId}`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    updateProfileDisplay(sessionId);
                });
            }
        });
    }

    const showFollowerFollowingPage = () => {
        props.followerFollowingPage();
    }

    return (
        <>
            {
                isStatusMessageVisible ? <p style={{color:"red"}}>{statusMessage}</p> : 
                <div id="profile">
                        <p>First name: <i>{firstName}</i></p>
                        <p>Last name: <i>{lastName}</i></p>
                        <p>Followers: <label id="numberfollow" onClick={showFollowerFollowingPage}><b>{followersCount}</b></label></p>
                        <p>Following: <label id="numberfollow" onClick={showFollowerFollowingPage}><b>{followingCount}</b></label></p>
                        <button id="followOrUnfollowbutton" onClick={followOrUnfollow} style={{ display : isFollowButtonVisible ? "block" : "none" }}><label>{followLabel}</label></button>

                        <div id="profilehenks">
                            <ProfileHenks profilePage={props.profilePage} userId={props.userId} />
                        </div>
                </div>
            }
        </>
    );
}

export default Profile;