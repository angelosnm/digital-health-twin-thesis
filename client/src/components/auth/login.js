import React, { useState, useContext } from 'react';
import AuthService from '../../Services/AuthService';
import Message from './message';
import { AuthContext } from '../../Context/AuthContext';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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
            const { isAuthenticated, user_details, message } = data;
            console.log(message)
            if (isAuthenticated) {
                authContext.setUser(user_details);
                authContext.setIsAuthenticated(isAuthenticated);
                props.history.push('/home');
            }
        });
    }

    const useStyles = makeStyles((theme) => ({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        }
    }));

    const classes = useStyles();

    return (

        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <form onSubmit={onSubmit} className={classes.form} >
                    <TextField
                        onChange={onChange}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                    />
                    <TextField
                        onChange={onChange}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="secondary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up!"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                {message ? <Message message={message} /> : null}
            </div>
        </Container>
    )
}


export default Login;