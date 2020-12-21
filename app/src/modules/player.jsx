import React from 'react';
import BasicTable from "./components/table.jsx";
import animateHelpers from "../helpers/animate-helpers.js";
import Api from "../helpers/api.js";
import MenuBar from "./components/menuBar";
import PlayerCard from "./components/playerCard";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";

let api;
let cursor;
let playerWidth = 700;
let playerHeight = 400;
let capturedSessionScreenSize = 'Recording browser resolution: ' + playerWidth + 'x' + playerHeight;

class Player extends React.Component {
    constructor(props) {
        api = new Api();

        super(props);
        this.state ={
            tableHeaders: ['Session Date', 'Duration', 'Play'],
            tableData: null,
            currentAction: null,
            sessionFinishedPlaying: true,
            showPlayer: false,
            shouldPlayerPause: false,
            isPlayingNow: false,
            nowTime: 0,
            preTime: 0
        }
    }

    componentDidMount() {
        this.getSessions();
    }

    /**
     * getting sessions from db and creating table for the player
     * @returns {object} {Promise<void>}
     */
    async getSessions() {
        try {
            const callRes = await api.getSessions();
            const failedToGetData = !(callRes && callRes.data && callRes.data.data && callRes.data.statusCode === 200);
            if (failedToGetData) {
                console.error('Failed to get records');
            } else {
                const sessionsData = callRes.data.data || [];

                const tableData = sessionsData.map((session) => {
                    return {
                        sessionDate: session.sessionDate,
                        duration: session.duration,
                        play: <PlayCircleFilledIcon
                            style={{cursor: 'pointer', color: '#393939'}}
                            onClick={this.handlePlayFromListClick.bind(this, session.recordEvents)}/>
                    }
                });

                this.setState({tableData: tableData || [], sessionsData: sessionsData || [],
                    showNoDataLabel: (tableData && tableData.length === 0)})
            }
        } catch (ex) {
            console.error(ex)
        }
    }

    handlePlayFromListClick(actions) {
        if (this.state.timeout) {
            window.clearTimeout(this.state.timeout);
        }
        this.setState({showPlayer: true, shouldPlayerPause: false}, this.play.bind(this, actions, true))
    }

    play(actions, isTriggeredFromList = false) {
        this.setState({isPlayingNow: true, sessionFinishedPlaying: false});
        this.animateActions(actions, isTriggeredFromList)
    }

    /**
     * animating the mouse events on player
     * @param {array} actions
     * @param {boolean} isTriggeredFromList
     */
    animateActions(actions, isTriggeredFromList) {
        let nowTime = this.state.nowTime;
        let preTime = this.state.preTime;
        let actionNumber = this.state.actionNumber;
        let actionsCount = this.state.actions && this.state.actions.length;
        let timeout = this.state.timeout;
        let currentAction = this.state.currentAction;
        let cursor = this.state.cursor;

        if (actions && isTriggeredFromList) {
            nowTime = 0;
            preTime = 0;
            actionNumber = 0;
            actionsCount = actions.length;
            timeout = null;
            currentAction = null;
            cursor = null;
        }

        actions = actions || this.state.actions;
        cursor = animateHelpers.showCursor(cursor);
        currentAction = actions[actionNumber];

        // resizing player with the screen captured proportion
        if (currentAction.screenProportions) {
            playerWidth = currentAction.screenProportions.width;
            playerHeight = currentAction.screenProportions.height;
            capturedSessionScreenSize = 'Recording browser resolution: ' + currentAction.screenProportions.width + 'x' + currentAction.screenProportions.height;

            while (playerWidth > window.innerWidth || playerHeight > window.innerHeight) {
                playerWidth = playerWidth * 0.8;
                playerHeight = playerHeight * 0.8;
            }
        }

        // setting position of mouse
        if (currentAction.type === 'move') {
            cursor = animateHelpers.setCursorPosition(currentAction.x, currentAction.y,
                currentAction.screenProportions, playerWidth, playerHeight, cursor);
        }

        // showing mouse click
        if (currentAction.type === 'click') {
            cursor = animateHelpers.clickOnElementAtPosition(currentAction.x, currentAction.y, currentAction.screenProportions, cursor, false);
            this.updateActionText('Mouse left click');
        }
        // showing mouse right click
        if (currentAction.type === 'rightClick') {
            cursor = animateHelpers.clickOnElementAtPosition(currentAction.x, currentAction.y, currentAction.screenProportions, cursor, true);
            this.updateActionText('Mouse right click');
        }

        // showing mouse scroll
        if (currentAction.type === 'scroll') {
            //window.scrollTo(currentAction.x, currentAction.y);
            let direction = '';
            if (currentAction.y > -0) {
                direction += 'scroll up';
            } else if (currentAction.y < -0) {
                direction += 'scroll down';
            } else if (currentAction.x < -0) {
                direction += 'scroll left';
            } else if (currentAction.x < -0) {
                direction += 'scroll right';
            }

            cursor = animateHelpers.showScrollPointer(cursor, direction);
            let text = 'Mouse ' + direction;
            this.updateActionText(text);
        }

        // set for showing the  mouse movement int the right time
        preTime = nowTime;
        nowTime = currentAction.time;
        actionNumber++;

        // once the session events are done we clear data
        if (actionNumber === actionsCount) {
            console.log('Finished playing recording');
            window.clearTimeout(timeout);
            cursor = animateHelpers.hideCursor(cursor);
            this.clearPlayerData();
        } else {

            //recursively animating the mouse events in case users didnt press the pause button
            timeout = setTimeout(() => {
                if (!this.state.shouldPlayerPause) {
                    this.setState({actionNumber: actionNumber, actions: actions, cursor: cursor, timeout: timeout,
                        actionsCount: actionsCount, currentAction: currentAction, nowTime: nowTime, preTime: preTime
                    });
                    this.animateActions(null,false);
                }
            }, nowTime - preTime);
        }
    }

    updateActionText(action) {
        if(action !== this.state.actionText){
            this.setState({actionText: action}, () => {
                setTimeout(() => {
                    this.setState({actionText: ''})
                }, 700);
            })
        }
    }

    clearPlayerData() {
        this.resetPlayerWidthAndHeight()
        this.setState({
            actionNumber: 0, actions: [], cursor: null,
            timeout: null, actionsCount: 0, isPlayingNow: false, showPlayer: false,
            sessionFinishedPlaying: true
        });
    }

    resetPlayerWidthAndHeight() {
        playerWidth = 700
        playerHeight = 400;
    }

    resume = action => {
        if(!this.state.sessionFinishedPlaying){
            this.setState({shouldPlayerPause: false});
            this.play();
        } else{
            this.setState({showPlayer: false});
        }
    };

    pause = action => {
        this.setState({shouldPlayerPause: true, isPlayingNow: false, sessionFinishedPlaying: false});
    };

    handleGoToListClick = action => {
        if(this.state.cursor){
            cursor = animateHelpers.hideCursor(this.state.cursor);
        }
        this.resetPlayerWidthAndHeight()
        this.setState({shouldPlayerPause: true, showPlayer: false, isPlayingNow: false, cursor: cursor});
    };

    getPlayerContent() {
        const noDataLabel = `Lest start recording first`;

        return (this.state.showPlayer ?
            <div id={"playerCanvas"} style={{background: '#cbcbcb', width: playerWidth, height: playerHeight}}>
                <div style={{textAlign: 'right', position: 'relative', top: 10, right: 13, fontSize: 12}}>{capturedSessionScreenSize}</div>
            </div> :
            this.state.showNoDataLabel ?
                <div style={{minWidth: playerWidth, textAlign: 'center',
                    margin: '160px auto',
                    background: '#393939',
                    color:  '#ececec'}}>{noDataLabel}</div> :
                <BasicTable
                    tableHeaders={this.state.tableHeaders || []}
                    tableData={this.state.tableData || []}
                    width={playerWidth}
                    showNoDataLabel={this.state.showNoDataLabel || false}
                />);
    }

    render() {
        const playerContent = this.getPlayerContent();

        return (
            <div style={{margin: '50px auto', width: playerWidth}}>
                <MenuBar showPlayer={this.state.showPlayer || false}
                         handleListClick={() => this.handleGoToListClick()}/>
                <PlayerCard
                    pause={() => this.pause()}
                    play={() => this.resume()}
                    showPlayer={this.state.showPlayer || false}
                    isPlayingNow={this.state.isPlayingNow || false}
                    actionText={this.state.actionText || ''}
                    playerScreenHeight={playerHeight}
                    playerScreenWidth={playerWidth}
                    content={playerContent}
                    showNoDataLabel={this.state.showNoDataLabel || false}
                />
            </div>
        );
    }
}
export default Player;
