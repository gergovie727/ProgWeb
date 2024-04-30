import { useState } from 'react';
import "./Signin.css";

function Signin (props) {
    const [login, setLogin] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isStatusMessageVisible, setIsStatusMessageVisible] = useState(false);

    const getLogin = (evt) => {setLogin(evt.target.value)};
    const getFirstName = (evt) => {setFirstName(evt.target.value)};
    const getLastName = (evt) => {setLastName(evt.target.value)};
    const getPass1 = (evt) => {setPass1(evt.target.value)};
    const getPass2 = (evt) => {setPass2(evt.target.value)};

    const submissionHandler = (evt) => {
        evt.preventDefault();
        setStatusMessage("");
        setIsStatusMessageVisible(false);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: login, firstname: firstName, lastname: lastName, password: pass1, confirmpassword: pass2 })
        };
            
        fetch("/api/user/signin", requestOptions)
        .then(res => res.json().then(data => ({
            resdata: data,
            status: res.status
        }))
    )
        .then(data => {
            if(data.status === 200) {
                console.log("User successfully created");
                props.messagePage();
            } else {
                setStatusMessage(data.resdata.message);
                setIsStatusMessageVisible(true);
            }
        });
    };
    
    return (
    
        <div id = "screen">
            <div id = "signup">
                <div id ="form">

                    <div id = "title">
                    <label htmlFor="title">Sign up</label>
                    </div>

                    <div id = "test">
                    <input id="test2" value={firstName} onChange={getFirstName}/><label htmlFor="firstname" id="test3">First name</label>
                    </div>

                    <div id = "test">
                    <input id="test2" value={lastName} onChange={getLastName}/><label htmlFor="lastname" id="test3">Last name</label>
                    </div>

                    <div id = "test">
                    <input id="test2" value={login} onChange={getLogin}/><label htmlFor="signin_login" id="test3">Username</label>
                    </div>

                    <div id = "test">
                    <input type="password" id="test2" value={pass1} onChange={getPass1}/><label htmlFor="signin_mdp1" id="test3">Password</label>
                    </div>

                    <div id = "test">
                    <input type="password" id="test2" value={pass2} onChange={getPass2}/><label htmlFor="signin_mdp2" id="test3">Confirm Password</label>
                    </div>


                    <button onClick={submissionHandler} id="button">Sign In</button>
                    <button type="reset" onClick={props.messagePage} id="button">Reset</button>



                    {
                        isStatusMessageVisible ? <p style={{color:"red"}}>{statusMessage}</p> : <p></p> 
                    }
                </div>
            </div>
        </div>
    
    );
}

export default Signin;