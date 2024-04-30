import './Logout.css'

function Logout (props) {
    return (
        <div>
            <button className="buttonlogout" onClick={props.logout}>logout</button>
        </div>
    );
}

export default Logout;