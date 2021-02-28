import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../Services/AuthService';
import { AuthContext } from '../../Context/AuthContext';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
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
                    <ExitToAppIcon />
                </Link>
            </>
        )
    }


    // Toggle theme mode
    const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.mode === 'dark' ? '#e4e9eb' : '#323232'};
    color: ${props => props.theme.mode === 'dark' ? '#e4e9eb' : '#323232'};
  }`
  
  ;

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
    

    const useStylesAppbar = makeStyles(theme => ({
        root: {
            boxShadow: "none",
            backgroundColor: "#34cfa3",
            position: "static"
        }
    }));

    const classesAppbar = useStylesAppbar();


    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <div>
                <AppBar className={classesAppbar.root}>
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