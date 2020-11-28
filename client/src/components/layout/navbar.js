import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../Services/AuthService';
import { AuthContext } from '../../Context/AuthContext';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import storage from 'local-storage-fallback'
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import BrightnessHigh from '@material-ui/icons/BrightnessHigh';
import HomeIcon from '@material-ui/icons/Home';




const Navbar = props => {
    const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(AuthContext);

    const styles = {
        navLinks: {
            color: "white",
            marginLeft: "15px",
            marginRight: "15px"
        }
    }

    // Account options
    const onClickLogoutHandler = () => {
        AuthService.logout().then(data => {
            if (data.logged_out) {
                setUser(data.user);
                setIsAuthenticated(false);
            }
        });
    }

    const unauthenticatedNavBar = () => {
        return (
            <>
            </>
        )
    }

    const authenticatedNavBar = () => {
        return (
            <>

                <Link onClick={onClickLogoutHandler} style={styles.navLinks}>
                    <AccountCircle />
                </Link>
            </>
        )
    }


    // Toggle theme mode
    const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.mode === 'dark' ? 'rgb(61,61,61)' : '#e0e0e0'};
    
  }
  .App {
    color: ${props => props.theme.mode === 'dark' ? 'rgb(173 173 173)' : 'rgb(61,61,61)'}; 
  }
  `;

    function getInitialTheme() {
        const savedTheme = storage.getItem('theme')
        return savedTheme ? JSON.parse(savedTheme) : { mode: 'light' }
    }

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(
        () => {
            storage.setItem('theme', JSON.stringify(theme))
        },
        [theme]
    );

    const toggleTheme = (event) => {
        setTheme(theme.mode === 'dark' ? { mode: 'light' } : { mode: 'dark' })
    }




    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <div classname="navbar">
                <AppBar position="static">
                    <Toolbar >

                        {isAuthenticated && user.role === "doctor" ?
                            <Link
                                className="btn btn-link nav-item nav-link"
                                to="/doctor">
                                <HomeIcon />
                            </Link> : null}

                        {isAuthenticated && user.role === "patient" ?
                            <Link
                                className="btn btn-link nav-item nav-link"
                                to="/patient">
                                <HomeIcon />
                            </Link> : null}

                        <Grid container
                            direction="row"
                            justify="flex-end"
                        >
                            {theme.mode === 'dark' ? <Link><BrightnessHigh onClick={toggleTheme} style={styles.navLinks} /></Link> : <Link><BrightnessMediumIcon onClick={toggleTheme} style={styles.navLinks} /></Link>}
                            {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
                        </Grid>
                    </Toolbar>
                </AppBar>
            </div >
        </ThemeProvider >
    )
}

export default Navbar;