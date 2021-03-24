import './devices.css'
import React from 'react'
import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link'

function Devices() {
    useEffect(() => {
        fetchtoots();
    }, []);

    const [toots, setToots] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchtoots = async () => {
        const data = await fetch('/auth/patient/mydevices');

        const toots = await data.json();
        setLoading(true)

        setToots(toots);
    };

    const useStyles = makeStyles({
        root: {
            flexGrow: 1,
            marginLeft: "10%"
        },
        card: {
            maxWidth: 345,
            position: 'relative',
        },
        cardImg: {
            height: 330,
            width: "100%"
        }
    });

    const classes = useStyles()

    return (
        <div className={classes.root}>
            < Grid container spacing={9}>
                <Grid item xs={4} >
                    <Card className={classes.card}>
                        <CardActionArea>
                            <CardMedia
                                title="Fitbit Flex"
                            />
                            <a href="http://localhost:5000/auth/patient/mydevices/fitbit_auth" target="_blank">
                                <img src={require('../../images/fitbit-flex.jpg')} style={{ width: "100%" }}></img>
                            </a>
                            <CardContent >
                                <Typography gutterBottom variant="h5" component="h2">
                                    Fitbit Flex
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Fitbit Flex is a simple way to track steps and calories
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={4} >
                    <Card className={classes.card}>
                        <CardActionArea>
                            <CardMedia
                                title="Blood pressure monitor"
                            />
                            <a href="/auth/patient/mydevices/bpmonitor" target="_blank">
                                <img src={require('../../images/bpm.jpg')} style={{ width: "100%" }}></img>
                            </a>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Blood pressure monitor
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Track your heart rate data
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={4} >
                    <Card className={classes.card}>
                        <CardActionArea>
                            <CardMedia
                                title="Scale"
                            />
                            <a href="/auth/patient/mydevices/scale" target="_blank">
                                <img src={require('../../images/scale.jpg')} style={{ width: "100%" }}></img>
                            </a>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Scale
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Track your weight data
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </div >
    );
}

export default Devices;