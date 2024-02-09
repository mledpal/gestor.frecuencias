/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// import Pusher from "pusher-js";

// Pusher.logToConsole = true;

// var pusher = new Pusher("5285b606cdf2c249808a", {
//     cluster: "eu",
// });

// var channel = pusher.subscribe("canal-comentarios");
// channel.bind("NuevoComentario", function (data) {
//     console.log(JSON.stringify(data));
// });

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: "pusher",
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//     forceTLS: true,
// });

import Echo from "@ably/laravel-echo";
import * as Ably from "ably";

window.Ably = Ably; // make globally accessible to Echo
window.Echo = new Echo({
    broadcaster: "ably",
});

window.Echo.connector.ably.connection.on((stateChange) => {
    if (stateChange.current === "connected") {
        console.log("connected to ably server");
    }
});
