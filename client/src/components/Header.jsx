import {useEffect, useState} from "react";



const Header = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setLoggedIn(false);
    };


    return (
        <header className="header-bar" >
            
            <nav>
                {/* <ul>
                    <li >
                        <a className="primary"href="/">Home</a>
                    </li>
                    <li>
                        <a href="http://127.0.0.1:5000">Login</a>
                    </li>   
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul> */}
            </nav>
        </header>
    );
}

export default Header;