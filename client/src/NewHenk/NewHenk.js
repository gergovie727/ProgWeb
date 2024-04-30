import { useState } from 'react';
import './NewHenk.css';

function NewHenk(props) {
    const [henk, setHenk] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isStatusMessageVisible, setIsStatusMessageVisible] = useState(false);

    const getHenk = (evt) => {setHenk(evt.target.value)};

    const submissionHandler = (evt) => {
        evt.preventDefault();
        setStatusMessage("");
        setIsStatusMessageVisible(false);

        fetch("/api/session")
        .then(res => res.json())
        .then(data => {
            const userId = data.userId;

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: henk, user: userId })
            };
            
            fetch("/api/tweet/add", requestOptions)
            .then(res => res.json().then(data => ({
                    resdata: data,
                    status: res.status
                }))
            )
            .then(data => {
                if(data.status !== 200) {
                    setStatusMessage(data.resdata.message);
                    setIsStatusMessageVisible(true);
                } else {
                    setHenk("");
                    props.fetchStats();
                    props.fetchTweets();
                }
            });
        });
    }

    return (
        <div>
            <h4>Share your thoughts, post a Henk ヽ(・∀・)ﾉ</h4>
            {
                isStatusMessageVisible ? <p style={{color:"red"}}>{statusMessage}</p> : <p></p> 
            }
            <div class="newHenk">
                <textarea id="comment" rows="5" cols="80" value={henk} onChange={getHenk} />
                <label class="newHenkLabel"></label>
            </div>
            <div>
                <button class="newHenkButton" onClick={submissionHandler} disabled={!henk}>Submit</button>
            </div>
        </div>
    )
}

export default NewHenk;