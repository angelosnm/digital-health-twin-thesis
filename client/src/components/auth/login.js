import React, { useState, useContext } from 'react';
import AuthService from '../../Services/AuthService';
import Message from './message';
import { AuthContext } from '../../Context/AuthContext';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import HomeImage from '../../images/home.jpg'


const Login = props => {
    const [user, setUser] = useState({ username: "", password: "" });
    const [message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);

    const onChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        AuthService.login(user).then(data => {
            const { isAuthenticated, user, message } = data;
            console.log(message)
            console.log(user)
            if (isAuthenticated) {
                authContext.setUser(user);
                authContext.setIsAuthenticated(isAuthenticated);

                if (user.role === "doctor")
                    props.history.push('/doctor');
                else if (user.role === "patient")
                    props.history.push('/patient');
            }
        });
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            height: '80vh',
        },
        image: {
            backgroundImage: `url(${HomeImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        paper: {
            margin: theme.spacing(8, 4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
            '& label.Mui-focused': {
                color: '#34cfa3',
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: '#34cfa3',
            },
            '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                    borderColor: '#34cfa3',
                },
            },
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
            backgroundColor: "#34cfa3"
        },
    }));

    const classes = useStyles();



    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <img src={require('../../images/heart-icon.png')} width="20%" />
                    <p style={{letterSpacing: "2px", fontSize: "22px", color: "#4f4f4f"}}>Digital Health Twin</p>
                    <form onSubmit={onSubmit} className={classes.form} noValidate>
                        <TextField
                            onChange={onChange}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            onChange={onChange}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Log In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    {message ? <Message message={message} /> : null}
                </div>
            </Grid>
        </Grid>
    )
}


export default Login;