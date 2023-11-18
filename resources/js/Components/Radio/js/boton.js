const click_in = new Audio("assets/sound/click_in.mp3");
const click_out = new Audio("assets/sound/click_out.mp3");

click_in.loop = false;
click_out.loop = false;

document.addEventListener("DOMContentLoaded", function () {
    const teclas = document.getElementsByClassName("tecla_funcion");
    const teclas_inf = document.getElementsByClassName("btn_inf");
    const btn_ps = document.getElementsByClassName("boton_ps");

    setTimeout(() => {
        for (let btn of teclas) {
            btn.addEventListener("mousedown", () => {
                btn.classList.add("clicked");
                click_in.play();
            });
            btn.addEventListener("mouseup", () => {
                btn.classList.remove("clicked");
                click_out.play();
            });
        }

        for (let btn of teclas_inf) {
            btn.addEventListener("mousedown", () => {
                btn.classList.add("clicked");
                click_in.play();
            });
            btn.addEventListener("mouseup", () => {
                btn.classList.remove("clicked");
                click_out.play();
            });
        }

        btn_ps[0].addEventListener("mousedown", () => {
            btn_ps[0].classList.add("clicked");
            click_in.play();
        });
        btn_ps[0].addEventListener("mouseup", () => {
            btn_ps[0].classList.remove("clicked");
            click_out.play();
        });
    }, 200);
});
