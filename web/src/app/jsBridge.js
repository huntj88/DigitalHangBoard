
export function setupPostMessaging(onMessage) {
    if (global.myObject) {
        console.log("setting up post messaging", global.myObject.postMessage);
        global.myObject.onmessage = onMessage;
        return {
            postMessage: global.myObject.postMessage,
        }
    } else {
        console.log("did not setup post messaging", global);
        return {
            postMessage: undefined
        }
    }
}