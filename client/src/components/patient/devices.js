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
import HoverImage from "react-hover-image";


function Devices() {
    useEffect(() => {
        fetchPosts();
    }, []);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState();

    const fetchPosts = async () => {
        const data = await fetch('/patient/mydevices');

        const posts = await data.json();
        setLoading(true)

        setPosts(posts);
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
                            <Link underline="none" component={RouterLink} to={{ pathname: "http://localhost:5000/patient/mydevices/fitbit_auth" }} target="_blank">
                                <HoverImage src={require('../../images/fitbit-flex.jpg')} hoverSrc={require('../../images/device-css-effect.jpg')} className={classes.cardImg} />
                            </Link>
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
                            <Link underline="none" component={RouterLink} to={{ pathname: "http://localhost:5000/patient/mydevices/bpmonitor" }} target="_blank">
                                <HoverImage src={require('../../images/bpm.jpg')} hoverSrc={require('../../images/device-css-effect.jpg')} className={classes.cardImg} />
                            </Link>
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
                            <Link underline="none" component={RouterLink} to={{ pathname: "http://localhost:5000/patient/mydevices/bpmonitor" }} target="_blank">
                                <HoverImage src={require('../../images/scale.jpg')} hoverSrc={require('../../images/device-css-effect.jpg')} className={classes.cardImg} />
                            </Link>
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