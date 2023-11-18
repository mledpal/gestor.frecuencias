const botones = document.getElementsByClassName("btn");
const btn_radio = document.getElementsByClassName("btn_inf");
const btn2_radio = document.getElementsByClassName("tecla_funcion");
const boton_ps = document.querySelector(".boton_ps");

const click_in = new Audio("assets/sound/click_in.mp3");
const click_out = new Audio("assets/sound/click_out.mp3");

click_in.loop = false;
click_out.loop = false;

for (let btn of botones) {
    btn.addEventListener("mousedown", () => {
        btn.classList.add("clicked");
        click_in.play();
    });
    btn.addEventListener("mouseup", () => {
        btn.classList.remove("clicked");
        click_out.play();
    });
}

for (let btn of btn_radio) {
    btn.addEventListener("mousedown", () => {
        btn.classList.add("clicked");
        click_in.play();
    });
    btn.addEventListener("mouseup", () => {
        btn.classList.remove("clicked");
        click_out.play();
    });
}

for (let btn of btn2_radio) {
    btn.addEventListener("mousedown", () => {
        btn.classList.add("clicked");
        click_in.play();
    });
    btn.addEventListener("mouseup", () => {
        btn.classList.remove("clicked");
        click_out.play();
    });
}

boton_ps.addEventListener("mousedown", () => {
    boton_ps.classList.add("clicked");
    click_in.play();
});
boton_ps.addEventListener("mouseup", () => {
    boton_ps.classList.remove("clicked");
    click_out.play();
});
