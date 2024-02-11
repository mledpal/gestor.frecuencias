const click_in = new Audio("assets/sound/click_in.mp3");
const click_out = new Audio("assets/sound/click_out.mp3");

click_in.loop = false;
click_out.loop = false;

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        const botones = document.getElementsByClassName("tecla");
        const btn_menu = document.getElementsByClassName("btn_menu");
        const btn_up = document.querySelector(".btn_up");
        const btn_down = document.querySelector(".btn_down");
        const led = document.querySelector(".led_on");

        for (let btn of botones) {
            btn.addEventListener("mousedown", () => {
                click_in.play();
                btn.classList.add("clicked");
            });
            btn.addEventListener("mouseup", () => {
                btn.classList.remove("clicked");
                click_out.play();
            });
        }

        btn_menu[0].addEventListener("mousedown", () => {
            led.classList.add("pwr_on");
            click_in.play();
            btn_menu[0].classList.add("clicked");
        });
        btn_menu[0].addEventListener("mouseup", () => {
            led.classList.remove("pwr_on");
            btn_menu[0].classList.remove("clicked");
            click_out.play();
        });

        btn_up.addEventListener("mousedown", () => {
            btn_up.classList.add("clicked");
            click_in.play();
        });
        btn_up.addEventListener("mouseup", () => {
            btn_up.classList.remove("clicked");
            click_out.play();
        });

        btn_down.addEventListener("mousedown", () => {
            btn_down.classList.add("clicked");
            click_in.play();
        });
        btn_down.addEventListener("mouseup", () => {
            btn_down.classList.remove("clicked");
            click_out.play();
        });
    }, 200);
});
