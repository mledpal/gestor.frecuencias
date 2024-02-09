/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

import Pusher from "pusher-js";

Pusher.logToConsole = false;

var pusher = new Pusher("5285b606cdf2c249808a", {
    cluster: "eu",
});

var channel = pusher.subscribe("canal-comentarios");
channel.bind("NuevoComentario", function (data) {
    // alert(JSON.stringify(data));
});

var channel2 = pusher.subscribe("canal-mensajes");
channel2.bind("NuevoMensaje", function (data) {
    alert(JSON.stringify(data));
});

// Ably

// import Echo from "@ably/laravel-echo";
// import * as Ably from "ably";
// //

// window.Ably = Ably;
// window.Echo = new Echo({
//     broadcaster: "ably",
//     authEndpoint: "/broadcasting/auth",
// });

// window.Echo.connector.ably.connection.on((stateChange) => {
//     if (stateChange.current === "connected") {
//         console.log("connected to ably server");
//     }
// });
