(function () {
    'use strict';
    const sessionDate = new Date().toLocaleString();
    const recorderStartTime = new Date();
    const recordEvents = [];

    document.getElementById("redirectBtn").onclick = function () {
        window.location.href = "http://localhost:3001";
    };

    function startRecord() {
        // adding all needed events listeners
        console.log('Recording started');
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('click', onClick);
        document.addEventListener('contextmenu', onRightClick);
        document.addEventListener('scroll', onScroll);
        document.addEventListener('close', onCloseDocument);
        document.addEventListener('beforeunload', onCloseDocument);
        document.addEventListener("mousewheel", onScroll);
        window.addEventListener('close', onCloseDocument);
        window.addEventListener('beforeunload', onCloseDocument);
        window.addEventListener('onbeforeunload', onCloseDocument);
    }

    function onMouseMove(e) {
        addEvent('move', e.pageX, e.pageY);
    }

    function onClick(e) {
        addEvent('click', e.pageX, e.pageY);
    }
    function onRightClick(e) {
        addEvent('rightClick', e.pageX, e.pageY);
    }

    function onScroll(event) {
        const deltaY = Math.sign(event.deltaY);
        const deltaX = Math.sign(event.deltaX);
        addEvent('scroll', deltaX, deltaY);
    }

    function addEvent(type, x, y) {
        const eventObj = {
            type: type, x: x, y: y,
            screenProportions: {
                height: document.documentElement.clientHeight,
                width: document.documentElement.clientWidth
            },
            time: Date.now()
        };
        recordEvents.push(eventObj);
        const curLog = "Event: " + type + ", screen height: " + document.documentElement.clientHeight + ", width: " + document.documentElement.clientWidth;
        console.log(curLog);
    }
    //had zero if needed for creating hh:mm:ss format for duration
    function checkTime(time) {
        return (time < 10) ? "0" + time : time;
    }

    async function onCloseDocument() {
        const recordTimeEnd = new Date();
        let hours = checkTime(recordTimeEnd.getHours() - recorderStartTime.getHours()).toString();
        let minutes = checkTime(recordTimeEnd.getMinutes() - recorderStartTime.getMinutes()).toString();
        let seconds = checkTime(recordTimeEnd.getSeconds() - recorderStartTime.getSeconds()).toString();
        const duration = hours + ':' + minutes + ':' + seconds;
        const record = {
            sessionDate: sessionDate,
            recordEvents: recordEvents,
            duration: duration
        }
        await savesSessionToDb(record);
    }

    async function savesSessionToDb(recordObj) {
        const isRecordObjIsNotValid = !(recordObj && isAnObject(recordObj) && recordObj.sessionDate && recordObj.recordEvents && recordObj.duration);
        if (isRecordObjIsNotValid) {
            console.error("Failed to save Record, Record object is not valid")
        } else {
            try {
                const callRes = await fetch('http://localhost:3000/server/savesSessionToDb', {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(recordObj)
                });
                const finalRes = await callRes.json();
                const failedToGetData = !(finalRes && finalRes.statusCode === 201);
                if (failedToGetData) {
                    console.error('Failed to save');
                } else {
                    console.log("Saved to DB");
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    function isAnObject (val) {
        return !!(val && typeof val === 'object' && val.constructor === Object);
    }

    startRecord();

}).call();
