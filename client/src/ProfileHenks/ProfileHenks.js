import { useState, useEffect } from "react";
import Henk from '../Henk/Henk';
import './ProfileHenks.css'

function ProfileHenks(props) {
    const [userHenks, setUserHenks] = useState([]);
    const [isDelete, setIsDelete] = useState(false);

    useEffect(() => {
        fetchTweets();
    }, []);

    const fetchTweets = () => {
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

                    fetch(`/api/tweet/user/${userId}`)
                    .then(res => res.json())
                    .then(data => {
                        data.tweets.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                        setUserHenks(data.tweets);
                        setIsDelete(true);
                    });
                }
            });
        } else {
            fetch(`/api/tweet/user/${props.userId}`)
            .then(res => res.json())
            .then(data => {
                data.tweets.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                setUserHenks(data.tweets);
                setIsDelete(false);
            });
        }
    }

    return (
        <div class="profilehenks">
            <ul class="profilelistStyle">
                {
                    userHenks.map((henk) => <Henk user={henk.user} message={henk.message} time={henk.createdAt} tweetId={henk._id} userId={"self"} isDelete={isDelete} fetchTweets={fetchTweets} />)
                }
            </ul>
        </div>
    );
}

export default ProfileHenks;