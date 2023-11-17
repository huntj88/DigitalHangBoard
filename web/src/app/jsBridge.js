export function setupPostMessaging(onMessage) {
    if (global.myObject) {
        console.log("setting up post messaging", global.myObject.postMessage);
        global.myObject.onmessage = onMessage;
        const postMessage = global.myObject.postMessage
        return {
            postMessage: postMessage.bind(global.myObject),
        }
    } else {
        console.log("did not setup post messaging", global);
        return {
            postMessage: undefined
        }
    }
}