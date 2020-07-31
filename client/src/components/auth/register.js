import React, { useState, useRef, useEffect } from 'react';
import AuthService from '../../Services/AuthService';
import Message from './message';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';


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
                            <Link href="/login" variant="body2">
                                {"Already have an account? Sign in!"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                {message ? <Message message={message} /> : null}
            </div>
        </Container>
    )
}

export default Register;
