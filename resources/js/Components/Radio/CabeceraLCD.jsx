import { useContext, useMemo } from "react";
import { AppContext } from "@/Components/AppProvider";
import { UserImage } from "@/Components/Images/UserImage";
import { BurgerMenu } from "@/Components/Menu/BurgerMenu";
import { Repetidor } from "@/Components/Contactos/Icons/Repetidor";
import { Privado } from "@/Components/Contactos/Icons/Privado";
import { Gps } from "@/Components/Contactos/Icons/Gps";
import { FrecuenciaComprobada } from "@/Components/Contactos/Icons/FrecuenciaComprobada";
import { Favorito } from "@/Components/Contactos/Icons/Favorito";

const ETIQUETAS_MODO = {
    main: "MAIN",
    movil: "MEM",
    crear_contacto: "MEM",
    filtros: "SCAN",
    buscar_contacto: "SCAN",
    mensajes: "MSG",
    conversacion: "MSG",
    buscar_usuario: "MSG",
    admin_users: "ADM",
    admin_user_info: "ADM",
    admin_tipo_contacto: "ADM",
    admin_tipo_codificacion: "ADM",
};

/**
 * Deriva un nivel de S-meter (0-9) determinista a partir de la frecuencia:
 * no hay señal real que medir, y un valor aleatorio que cambiara en cada
 * render se leería de inmediato como decorado falso. La misma frecuencia
 * siempre da la misma lectura.
 */
const nivelSMeter = (frecuencia) => {
    if (!frecuencia) return 0;

    let hash = 0;
    for (let i = 0; i < frecuencia.length; i++) {
        hash = (hash * 31 + frecuencia.charCodeAt(i)) >>> 0;
    }

    return (hash % 9) + 1;
};

/**
 * Cabecera de la app como display LCD de escáner: frecuencia del contacto
 * activo, indicadores, S-meter y LEDs de estado (RX/TX/MSG). Sustituye el
 * header plano de AppMain.jsx sin cambiar el resto del layout.
 */
export const CabeceraLCD = ({ userDB }) => {
    const {
        contactoActivo,
        setContactoActivo,
        contactos,
        busqueda,
        vista,
        setVista,
        isSmallScreen,
        ledsActivos,
    } = useContext(AppContext);

    const indiceMemoria = useMemo(() => {
        if (!contactoActivo || !contactos) return null;
        const idx = contactos.findIndex((c) => c.id === contactoActivo.id);
        return idx === -1 ? null : idx + 1;
    }, [contactoActivo, contactos]);

    const frecuencia = contactoActivo?.frecuencia?.frecuencia;
    const nivel = useMemo(() => nivelSMeter(frecuencia), [frecuencia]);
    const etiquetaModo = ETIQUETAS_MODO[vista] ?? "MAIN";
    const escaneando = busqueda !== null && busqueda !== undefined;

    return (
        <header className="px-3 relative flex flex-row items-center justify-between py-2 w-full h-[10%] min-h-[60px] bg-gradient-to-b from-chasis to-chasisbajo border-b-2 border-escborde">
            <div
                className="flex flex-row items-center gap-3 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                    setContactoActivo(null);
                    setVista(isSmallScreen ? "movil" : "main");
                }}
                title="Ir al inicio"
            >
                <img
                    src="/img/logo.webp"
                    alt="Logo Radioescucha"
                    className="w-[50px] h-[50px]"
                />
                {!isSmallScreen && (
                    <span className="font-ethno text-rotulo text-xs tracking-wider hidden lg:inline">
                        RADIOESCUCHA
                    </span>
                )}
            </div>

            <div className="lcd flex-1 min-w-0 mx-3 max-w-3xl px-4 py-1 flex flex-col justify-center">
                <div className="flex items-baseline justify-between gap-2">
                    <span className="relative font-lcd font-bold text-2xl leading-none whitespace-nowrap">
                        <span
                            className="absolute inset-0 text-lcdoff select-none"
                            aria-hidden="true"
                        >
                            888.888
                        </span>
                        <span className="relative">
                            {frecuencia ?? "---.---"}
                        </span>
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                        <Repetidor repetidor={contactoActivo?.repetidor_id} />
                        <Privado privado={contactoActivo?.privado} />
                        <Gps gps={contactoActivo?.localizacion?.gps ?? ""} />
                        <FrecuenciaComprobada
                            comprobada={contactoActivo?.comprobado}
                        />
                        <Favorito favorito={contactoActivo?.favorito} />
                    </div>
                </div>

                {!isSmallScreen && (
                    <div className="flex items-center justify-between text-[.8rem] font-semibold mt-1 gap-3 text-lcd">
                        <div
                            className="flex items-center gap-[2px] shrink-0"
                            aria-hidden="true"
                        >
                            {Array.from({ length: 9 }).map((_, i) => (
                                <span
                                    key={i}
                                    className="w-1 h-2"
                                    style={{
                                        backgroundColor:
                                            i < nivel
                                                ? "var(--esc-lcd-on)"
                                                : "var(--esc-lcd-off)",
                                    }}
                                />
                            ))}
                        </div>
                        <span className="truncate">
                            {contactoActivo
                                ? [
                                      contactoActivo.nombre,
                                      contactoActivo.localizacion?.localidad,
                                  ]
                                      .filter(Boolean)
                                      .join(" · ")
                                : "SIN SELECCIÓN"}
                        </span>
                        <span className="flex items-center gap-2 shrink-0">
                            {indiceMemoria && contactos && (
                                <span>
                                    MEM{" "}
                                    {String(indiceMemoria).padStart(3, "0")}/
                                    {String(contactos.length).padStart(
                                        3,
                                        "0"
                                    )}
                                </span>
                            )}
                            {escaneando && (
                                <span className="esc-anim-parpadeo">
                                    SCAN
                                </span>
                            )}
                            <span>{etiquetaModo}</span>
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-row items-center gap-3 shrink-0">
                <div
                    className="flex items-center gap-2 text-[.7rem] font-semibold text-rotulo"
                    title="Estado"
                >
                    <span className="flex flex-col items-center gap-[2px]">
                        <span
                            className="led"
                            data-encendido={!!contactoActivo}
                            style={{ "--color-led": "var(--esc-led-rx)" }}
                        />
                        RX
                    </span>
                    <span className="flex flex-col items-center gap-[2px]">
                        <span
                            className="led"
                            data-encendido={ledsActivos.tx}
                            style={{ "--color-led": "var(--esc-led-tx)" }}
                        />
                        TX
                    </span>
                    <span className="flex flex-col items-center gap-[2px]">
                        <span
                            className="led"
                            data-encendido={ledsActivos.msg}
                            style={{ "--color-led": "var(--esc-led-msg)" }}
                        />
                        MSG
                    </span>
                </div>

                {!isSmallScreen && (
                    <UserImage userDB={userDB} link="/profile" />
                )}
                <BurgerMenu />
            </div>
        </header>
    );
};
