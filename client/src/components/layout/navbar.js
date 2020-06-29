import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../Services/AuthService';
import { AuthContext } from '../../Context/AuthContext';
import * as ReactBootstrap from 'react-bootstrap'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import storage from 'local-storage-fallback'
import * as Style from '@material-ui/core/';




const Navbar = props => {
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);

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
                <Link className="btn btn-link nav-item nav-link justify-content-end" onClick={onClickLogoutHandler}>
                    <AccountCircle />
                </Link>
            </>
        )
    }

    const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.mode === 'dark' ? 'rgb(61,61,61)' : '#e0e0e0'};
  }
  `;

    function getInitialTheme() {
        const savedTheme = storage.getItem('theme')
        return savedTheme ? JSON.parse(savedTheme) : { mode: 'light' }
    }


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

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        }
    }));

    const classes = useStyles();
    return (
        // <nav className="navbar navbar-expand-md navbar-light bg-light">
        //     <Link to="/home">
        //         <div className="navbar-brand">NoobCoder</div>
        //     </Link>
        //     <div className="collapse navbar-collapse">
        //         <ul className="navbar-nav mr-auto">
        //             {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
        //         </ul>
        //     </div>
        // </nav>
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Link className="navbar-brand mx-auto" to="/home">
                            <img src={require('../../images/heart-icon-navbar-brand.png')} style={{ width: "18%" }} ></img>
                        </Link>

                        <Style.Switch
                            onChange={toggleTheme}
                            color='default'
                        />
                        {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
                    </Toolbar>
                </AppBar>
            </div >
        </ThemeProvider>
    )
}

export default Navbar;