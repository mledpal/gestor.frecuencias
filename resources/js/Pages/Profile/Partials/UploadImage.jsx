import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

export default function UploadImage({ className = "" }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            id: user.id,
            photo: user.photo,
            qsl: user.qsl,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.upload"));
    };

    const handleSendFile = (e) => {
        let imagen = e.target.files[0];
        setData('photo', e.target.value);

        if (imagen) {
            const token = document
                .getElementById("meta_token")
                .getAttribute("content");

            const formData = new FormData();

            formData.append("photo", imagen, e.target.value);
            formData.append("_token", token);

            // Realiza la lógica de envío al servidor
            fetch("/profile/upload", {
                "Content-Type": "multipart/form-data",
                headers: {
                    "X-CSRF-TOKEN": token,
                    "X-Requested-With": "XMLHttpRequest",
                },
                method: "POST",
                body: formData,
            })
                .then((respuesta) => respuesta.json())
                .then((datos) => {
                    console.log("Archivo subido exitosamente", datos);
                })
                .catch((error) => {
                    console.error("Error al subir el archivo", error);
                });
        }
    };


    console.log(user, user.photo);
    
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Imágenes del Usuario
                </h2>
            </header>

            <form
                onSubmit={submit}
                className="mt-6 space-y-6"
                encType="multipart/form-data"
                method="PATCH"
            >
                <div>
                    <InputLabel htmlFor="photo" value="Imagen Perfil" />

                    <TextInput
                        id="photo"
                        name="photo"
                        type="file"
                        className="mt-1 block w-full"
                        filename={data.photo ? data.photo : ""}
                        onChange={(e) => handleSendFile(e)}
                        autoComplete="photo"
                        // onChange={handleImageUpload}
                    />

                    <InputError className="mt-2" message={errors.photo} />
                </div>

                {/* <div className="flex items-center gap-4">
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
                </div> */}
            </form>
        </section>
    );
}
