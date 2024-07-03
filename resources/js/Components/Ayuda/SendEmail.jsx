export const SendEmail = () => {
    const handleEmailClick = () => {
        const email = "info@radioescucha.es";
        const subject = "Ayuda desde www.radioescucha.es";
        const body = "";

        window.location.href = `mailto:${email}?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
    };

    return (
        <button
            className="px-4 py-2 bg-orange-300 shadow-[inset_0px_2px_2px_rgba(0,0,0,.5)] text-black rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out "
            onClick={handleEmailClick}
        >
            <i class="fa-regular fa-envelope mr-2"></i>Enviar e-mail
        </button>
    );
};
