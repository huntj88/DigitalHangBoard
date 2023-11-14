
export function setupPostMessaging() {
    if (global.myObject) {
        global.myObject.onmessage = function (event) {
            // prints "Got it!" when we receive the app's response.
            console.log(event.data);
        }
        global.myObject.postMessage("I'm ready!");
        console.log("setup post messaging");
    }
}