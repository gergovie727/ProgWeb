import Logout from "../Logout/Logout";
import Login from "../Login/Login";

function NavigationPanel(props) {
    return (
        <nav id="navigation_pan">
            {
                (props.isConnected) ? <Logout logout={props.logout} /> : <Login login={props.login} navigationPanel={props.navigationPanel} />
            }
        </nav>
    );
}

export default NavigationPanel;