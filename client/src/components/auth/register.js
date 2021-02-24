import React, { useState, useRef, useEffect } from 'react';
import AuthService from '../../Services/AuthService';
import Message from './message';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import HomeImage from '../../images/home.jpg'


const Register = props => {
    const [user, setUser] = useState({ username: "", password: "", password_confirmation: "", email: "", mastodon_app_access_token: "", role: "" });
    const [message, setMessage] = useState(null);
    let timerID = useRef(null);

    useEffect(() => {
        return () => {
            clearTimeout(timerID);
        }
    }, []);

    const onChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const resetForm = () => {
        setUser({ username: "", password: "", password_confirmation: "", email: "", mastodon_app_access_token: "", role: "" });
    }

    const onSubmit = e => {
        e.preventDefault();
        AuthService.register(user).then(data => {
            const { message } = data;
            setMessage(message);
            resetForm();
            if (!message.msgError) {
                timerID = setTimeout(() => {
                    props.history.push('/login');
                }, 2000) //if register success -> redirect to login
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
                    <p style={{ letterSpacing: "2px", fontSize: "22px", color: "#4f4f4f" }}>Digital Health Twin</p>
                    <form onSubmit={onSubmit} className={classes.form} noValidate>
                        <TextField
                            onChange={onChange}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
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
                        <TextField
                            onChange={onChange}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password_confirmation"
                            label="Password Confirmation"
                            type="password"
                            id="password_confirmation"
                        />
                        <TextField
                            onChange={onChange}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            id="email"
                        />
                        <TextField
                            onChange={onChange}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="mastodon_app_access_token"
                            label="Mastodon Access Token"
                            type="password"
                            id="mastodon_app_access_token"
                        />
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="role" name="role" value={user.role} onChange={onChange}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <FormControlLabel value="doctor" control={<Radio />} label="Doctor" />
                                    <FormControlLabel value="patient" control={<Radio />} label="Patient" />
                                </Grid>
                            </RadioGroup>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Register
                    </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/login" variant="body2">
                                    {"Already have an account? Sign in!"}
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

export default Register;
