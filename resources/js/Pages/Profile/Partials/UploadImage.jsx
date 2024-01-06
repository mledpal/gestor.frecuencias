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
                    if(datos.mensaje == "OK") {
                        document.getElementById('photoMessage').textContent = "Archivo subido exitosamente";
                    } else {
                        document.getElementById('photoMessage').textContent = `${datos.message}`;
                    }
                })
                .catch((error) => {
                    document.getElementById('photoMessage').textContent = "Error al subir la imagen";
                });
        }
    };


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
                    <InputLabel htmlFor="photo" value="Imagen de Perfil" />

                    <TextInput
                        id="photo"
                        name="photo"
                        type="file"
                        className="mt-1 block w-full"
                        filename={user.photo ? user.photo : ""}
                        onChange={(e) => handleSendFile(e)}
                        autoComplete="photo"
                        // onChange={handleImageUpload}
                    />
                    <label className="text-red-600 text-sm" id="photoMessage"></label>

                    <InputError className="mt-2" message={errors.photo} />
                </div>

                {/* <div>
                    <InputLabel htmlFor="photo" value="QSL" />

                    <TextInput
                        id="qsl"
                        name="qsl"
                        type="file"
                        className="mt-1 block w-full"
                        filename={user.qsl ? user.qsl : ""}
                        onChange={(e) => handleSendFile(e)}
                        autoComplete="photo"
                        // onChange={handleImageUpload}
                    />
                    <label className="text-red-600 text-sm" id="qslMessage"></label>

                    <InputError className="mt-2" message={errors.photo} />
                </div> */}



            </form>
        </section>
    );
}
