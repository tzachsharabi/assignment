import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {Card, CardContent, IconButton,} from "@material-ui/core";
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

const styles = theme => ({
    card: {
        display: "flex",
    },
    details: {
        display: "flex",
        flexDirection: "column"
    },
    content: {
        flex: "1 0 auto"
    },
    cover: {
        width: 151
    },
    controls: {
        display: "flex",
        alignItems: "center"
    },
    div: {background: '#dcdcdc', borderRadius: '0px 50px 50px 0px', paddingRight: 14},
    playIcon: {
        height: 38,
        width: 38
    },
    actionText: {
        margin: 'auto',
        borderRadius: 50,
        background:  '#dcdcdc',
        padding: 10,
        fontSize: 12
    }
});

function PlayerCard(props) {
    const { classes , theme} = props;

    return (
        <Card className={classes.card} style={props.showNoDataLabel? {background: '#474747'} : {background: '#eaeaea'}}>
            <div className={classes.details}>
                <CardContent style={{padding: 0, height: props.playerScreenHeight}}>
                    {props.content}
                </CardContent>
                {props.showPlayer && <div className={classes.controls}>
                    <div className={classes.div}>
                    <IconButton aria-label="Play" disabled={props.isPlayingNow}>
                        <PlayCircleFilledIcon
                            className={classes.playIcon}
                            onClick={() => props.play()}
                        />
                    </IconButton>
                    <IconButton aria-label="Pause" onClick={() => props.pause("next")} disabled={!props.isPlayingNow}>
                       <PauseCircleFilledIcon/>
                    </IconButton>
                    </div>
                    { props.actionText !== '' && <span className={classes.actionText}>{props.actionText}</span>}
                </div>}
            </div>
        </Card>
    );
}


export default withStyles(styles, { withTheme: true })(PlayerCard);
