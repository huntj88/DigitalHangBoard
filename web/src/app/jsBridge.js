
export function setupPostMessaging(onMessage) {
    if (global.myObject) {
        console.log("setting up post messaging");
        global.myObject.onmessage = onMessage;
        return {
            postMessage: global.myObject.postMessage,
        }
    } else {
        console.log("did not setup post messaging", global);
        return {
            postMessage: (message) => { console.log("NoOp postMessage", message)}
        }
    }
}