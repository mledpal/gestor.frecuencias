import { useRef } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

export default function UpdateLocalizacionForm({ className = "" }) {
    const localidadRef = useRef();
    const provinciaRef = useRef();
    const paisRef = useRef();
    const gpsRef = useRef();

    const user = usePage().props.user;

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        localidad: user?.localizacion?.localidad ?? "",
        provincia: user?.localizacion?.provincia ?? "",
        pais: user?.localizacion?.pais ?? "",
        gps: user?.localizacion?.gps ?? "",
    });


    const updateLocalizacion = (e) => {
        e.preventDefault();

        put(route("localizacion.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Localización
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Si usa coordenadas GPS, asegúrese de usar el mismo formato
                    que existe en Google Maps
                </p>
            </header>

            <form onSubmit={updateLocalizacion} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="localidad" value="Localidad" />

                    <TextInput
                        id="localidad"
                        ref={localidadRef}
                        value={data.localidad}
                        onChange={(e) => setData("localidad", e.target.value)}
                        type="text"
                        className="mt-1 block w-full text-gray-800 bg-slate-100 dark:text-gray-300 dark:bg-black"
                    />

                    <InputError message={errors.localidad} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="provincia" value="Provincia" />

                    <TextInput
                        id="provincia"
                        ref={provinciaRef}
                        value={data.provincia}
                        onChange={(e) => setData("provincia", e.target.value)}
                        type="text"
                        className="mt-1 block w-full text-gray-800 bg-slate-100 dark:text-gray-300 dark:bg-black"
                    />

                    <InputError message={errors.provincia} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="pais" value="Pais" />

                    <TextInput
                        id="pais"
                        ref={paisRef}
                        value={data.pais}
                        onChange={(e) => setData("pais", e.target.value)}
                        type="text"
                        className="mt-1 block w-full text-gray-800 bg-slate-100 dark:text-gray-300 dark:bg-black"
                    />

                    <InputError message={errors.pais} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="gps" value="Coordenadas GPS" />

                    <TextInput
                        id="gps"
                        ref={gpsRef}
                        value={data.gps}
                        onChange={(e) => setData("gps", e.target.value)}
                        type="text"
                        className="mt-1 block w-full text-gray-800 bg-slate-100 dark:text-gray-300 dark:bg-black"
                    />

                    <InputError message={errors.gps} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Guardado.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
