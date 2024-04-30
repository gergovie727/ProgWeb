import { useState } from 'react';
import './Login.css';

function Login (props) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isStatusMessageVisible, setIsStatusMessageVisible] = useState(false);

    const getLogin = (evt) => {setLogin(evt.target.value)};
    const getPassword = (evt) => {setPassword(evt.target.value)};

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setStatusMessage("");
        setIsStatusMessageVisible(false);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: login, password: password })
        };
        
        fetch("/api/user/login", requestOptions)
        .then(res => res.json().then(data => ({
                resdata: data,
                status: res.status
            }))
        )
        .then(data => {
            if(data.status === 200) {
                props.login();
            } else {
                setStatusMessage(data.resdata.message);
                setIsStatusMessageVisible(true);
            }
        });
    }

    return (
        <>
            <div id="screen">
                <div id="login">
                    <form onSubmit={handleSubmit}>

                        <div id="test">
                        <input type="text" name="login" required id="test2" onChange={getLogin} /><label id="test3">Username</label>
                        </div>

                        <div id="test">
                        <input type="password" name="password" required id="test2" onChange={getPassword} /><label id="test3">Password</label>
                        </div>
                        
                        <button type="submit" disabled={!(login && password)} id="buttonlogin">Log In</button>
                        <button type="reset" onClick={props.navigationPanel} id="buttonlogin">Back</button>
                    </form>
                </div>
            </div>
            {
                isStatusMessageVisible ? <p style={{color:"red"}}>{statusMessage}</p> : <p></p> 
            }
        </>
        
    );
}

export default Login;