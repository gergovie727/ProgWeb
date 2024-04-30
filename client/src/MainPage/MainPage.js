import { useState, useEffect } from 'react';
import NavigationPanel from '../NavigationPanel/NavigationPanel';
import Signin from '../Signin/Signin';
import NewHenk from '../NewHenk/NewHenk';
import HenkList from '../HenkList/HenkList';
import Profile from '../Profile/Profile';
import FollowerFollowingList from '../FollowerFollowingList/FollowerFollowingList';
import SearchResults from '../SearchResults/SearchResults';
import Logo from './squid.png';
import Sea from './sea.png';
import './MainPage.css';

function MainPage (props) {
    const [isConnected, setConnect] = useState(false);
    const [page, setPage] = useState("message_page");
    const [search, setSearch] = useState("");
    const [section, setSection] = useState("home_section");
    const [userId, setUserId] = useState("self");
    const [henks, setHenks] = useState([]);
    //for statistics
    const [totalUsers, setTotalUsers] = useState("");
    const [totalTweets, setTotalTweets] = useState("");
    const [topStar, setTopStar] = useState("");
    const [talkTooMuch, setTalkTooMuch] = useState("");
    const [topSimp, setTopSimp] = useState("");

    const getConnected = () => {
        setConnect(true);
        setPage("message_page");
    }

    const setLogout = () => {
        setConnect(false);
        setPage("message_page");
        
        fetch("/api/session/logout")
        .then(res => res.json())
        .then(data => {
            console.log(data.message);
        });
    }

    const [isNavigationPanel, setIsNavigationPanel] = useState(false);

    const showNavigationPanel = () => {
        setIsNavigationPanel(true);
    }

    const hideNavigationPanel = () => {
        setIsNavigationPanel(false);
    }

    const showSigninPage = () => {
        setPage("signin_page");
    }

    const hideSigninPage = () => {
        setPage("message_page");
    }

    const showHomeSection = () => {
        setSection("home_section");
    }

    const showOwnProfileSection = () => {
        setUserId("self");
        setSection("profile_section");
    }

    const showProfileSection = () => {
        setSection("profile_section");
    }

    const showFollowerFollowingPage = () => {
        setSection("follower_following_section");
    }

    const getSearchValue = (evt) => {
        setSearch(evt.target.value);
    }

    const searchHenks = () => {
        setSection("search_results");
    }

    const fetchStats = () => {
        fetch("/api/user")
        .then(res => res.json())
        .then(data => {
            setTotalUsers(data.users.length);
        });

        fetch("/api/tweet")
        .then(res => res.json())
        .then(data => {
            setTotalTweets(data.tweets.length);
        });

        fetch("/api/user/stats/topStar")
        .then(res => res.json())
        .then(data => {
            setTopStar(data.topStar[0].username);
        });

        fetch("/api/user/stats/talkTooMuch")
        .then(res => res.json())
        .then(data => {
            setTalkTooMuch(data.talkTooMuch[0].username);
        });

        fetch("/api/user/stats/topSimp")
        .then(res => res.json())
        .then(data => {
            setTopSimp(data.topSimp[0].username);
        });
    }
    
    const fetchTweets = () => {
        fetch("/api/tweet")
        .then(res => res.json())
        .then(data => {
            setHenks(data.tweets);
        });
    }

    useEffect(() => {
        fetch("/api/session")
        .then(res => res.json().then(data => ({
                resdata: data,
                status: res.status
            }))
        )
        .then(data => {
            if(data.status === 200) {
                showNavigationPanel();
                getConnected();
            }
        })
        .then(() => {
            fetchStats();
            fetchTweets();
        });
    }, [])

    return (
        <html>
            {
                page === "signin_page" ? <Signin messagePage={hideSigninPage} /> :
                <>
                    <body>
                        <header>
                            <div id="Logo">
                                    <img src={Logo} alt="logo" width="150" length="150"/>
                            </div>
                            <div>
                                <div id="Search">
                                    <input type="text" name="Search" required class="searchText" onChange={getSearchValue}/>
                                    <label for="Search" class="searchLabel">Look for a Henk with just a keyword!</label>
                                </div>                                
                                <div>
                                    <button onClick={searchHenks} class="searchButton">Search</button>
                                </div>
                            </div>
                            
                            
                            <div id="Login">
                                    {
                                        isNavigationPanel ? <NavigationPanel login={getConnected} logout={setLogout}
                                                                isConnected={isConnected} navigationPanel={hideNavigationPanel} /> :
                                        <>
                                            <button class="mainButton" onClick={showNavigationPanel}>Login</button>
                                            <button class="mainButton" onClick={showSigninPage}>Register</button>
                                        </>
                                    }
                            </div>
                        </header>
                        <main>
                            <aside class="leftPanelAside">
                                <button class="leftsidebutton" onClick={showHomeSection}>Home</button>
                                <button class="leftsidebutton" onClick={showOwnProfileSection}>Profile</button>
                            </aside>
                            {
                                section === "profile_section" ? <Profile profilePage={showProfileSection} followerFollowingPage={showFollowerFollowingPage} userId={userId} /> :
                                section === "follower_following_section" ? <FollowerFollowingList profilePage={showProfileSection} userId={userId} /> :
                                section === "search_results" ? <SearchResults searchCriteria={search} /> :
                                <>
                                    <section>
                                        <div id="NewHenk">
                                            <NewHenk fetchStats={fetchStats} fetchTweets={fetchTweets} />
                                        </div>
                                    
                                    
                                        <div class="AllHenks">
                                            <HenkList profilePage={showProfileSection} userId={setUserId} henks={henks} />
                                        </div>

                                    </section>
                                </>
                            }
                            <aside class="statisticsAside">
                                <div class="statistics">
                                    <div class="stats">
                                        Total Users: <b>{totalUsers}</b>
                                    </div>
                                    <div class="stats">
                                        Total Henks: <b>{totalTweets}</b>
                                    </div>
                                    <div class="stats2">
                                        Top Star <i>(Most Followers)</i>:<br/><b>{topStar}</b>
                                    </div>
                                    <div class="stats2">
                                        Talk Too Much <i>(Most Henks)</i>:<br/><b>{talkTooMuch}</b>
                                    </div>
                                    <div class="stats2">
                                        Top Simp <i>(Most Following)</i>:<br/><b>{topSimp}</b>
                                    </div>
                                </div>
                            </aside>
                        </main>
                    </body>
                    <footer>
                    <img src={Sea} alt="sea" width="1450"/>
                    </footer>
                </>
            }
        </html>
    );
}
export default MainPage;