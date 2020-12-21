module.exports.setCursorPosition = (x, y, screenProportions, defaultWidth, defaultHeight, cursor) => {
    cursor = getDefaultCursorStyle(cursor);
    cursor = getDefaultCursorPosition(cursor);
    const playerHeight = (defaultHeight / screenProportions.height) * 100
    const playerWidth = (defaultWidth / screenProportions.width) * 100

    cursor.style.left = ((x * playerWidth) / 100) + ((document.documentElement.clientWidth / 2) - (defaultWidth / 2)) + 'px';
    cursor.style.top = ((y * playerHeight) / 100) + 50 + 64 + 'px';
    return cursor;
}

module.exports.showCursor = (cursor) => {
    cursor = cursor || this.getCursor();
    document.body.appendChild(cursor)
    return cursor;
}

module.exports.showScrollPointer = (cursor, direction) => {
    cursor = getScrollCursorStyle(cursor, direction);
    return cursor;
}

module.exports.hideCursor = (cursor) => {
    document.body.removeChild(cursor)
    return cursor;
}

module.exports.clickOnElementAtPosition = (x, y, screenProportions, cursor, isRightClick = false) => {
    cursor = getDefaultCursorStyle(cursor);
    let clickCandidate = document.elementFromPoint(x, y);
    while (clickCandidate && !clickCandidate.click) {
        clickCandidate = clickCandidate.parentNode;
    }
    if (clickCandidate && clickCandidate.click) {
        clickCandidate.click();
    }

    if (isRightClick) {
        cursor.innerHTML = 'Mouse right click';
    } else {
        cursor.innerHTML = 'Mouse left click';
    }
    return cursor;
}

module.exports.getCursor = () => {
    let cursorNode = document.createElement('div');
    cursorNode = getDefaultCursorStyle(cursorNode);
    return cursorNode;
}


const getDefaultCursorStyle = (cursor) => {
    cursor.style.borderRadius = '50%';
    cursor.style.background = '#1c1c1c';
    cursor.style.width = '5px';
    cursor.style.height = '5px';
    cursor.style.position = 'fixed';
    cursor.innerHTML = '';
    cursor.style.fontSize = 12;

    return cursor;
}

const getDefaultCursorPosition = (cursor) => {
    cursor.style.top = 0;
    cursor.style.left = 0;
    cursor.style.zIndex = 999;

    return cursor;
}

const getScrollCursorStyle = (cursor ,direction) => {
    cursor = getDefaultCursorStyle(cursor);
    cursor.innerHTML = direction;
    return cursor;
}


