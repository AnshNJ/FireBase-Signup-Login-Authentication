import { createContext , useEffect, useState, useMemo , useCallback } from "react";


let logoutTimer;

const AuthContext = createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

// function for clearing token in localStorage
const calculateRemainingTime = (expirationTime) => {
    // const currentTime = new Date().getTime();
    // const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingTime = expirationTime - Date.now()

    return remainingTime;
}

// Function to check stored token validity
const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if(remainingTime <= 60000) {
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime
    }
};



export const AuthContextProvider = (props) => {
    const tokenData = useMemo(() => retrieveStoredToken(),[])
    let initialToken;
    if(tokenData) {
        initialToken = tokenData.token;
    }
    
    const [token, setToken] = useState(initialToken)

    const userIsLoggedIn = !!token

    
    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    },[])
    
    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);

        // clear token as soon as time expires
        logoutTimer = setTimeout(logoutHandler, remainingTime);

    }

    useEffect(() => {
        if(tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    },[tokenData, logoutHandler()])

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    }


    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext;