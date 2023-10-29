import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            nombre: user.nombre,
            apellidos: user.apellidos,
            username: user.username,
            indicativo: user.indicativo ?? "",
            email: user.email,
            photo: user.photo,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    function handleImageUpload(e) {
        const image = e.target.files[0];
        const formData = new FormData();

        formData.append("photo", e.target.value);

        setData("photo", image);
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Información del Usuario
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Actualiza la información de tu perfil.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="mt-6 space-y-6"
                encType="multipart/form-data"
                method="PATCH"
            >
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.nombre}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="apellidos" value="Apellidos" />

                    <TextInput
                        id="apellidos"
                        className="mt-1 block w-full"
                        value={data.apellidos}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="apellidos"
                    />

                    <InputError className="mt-2" message={errors.apellidos} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="indicativo" value="Indicativo" />

                    <TextInput
                        id="indicativo"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.indicativo}
                        onChange={(e) => setData("indicativo", e.target.value)}
                        autoComplete="indicativo"
                    />

                    <InputError className="mt-2" message={errors.indicativo} />
                </div>

                <div>
                    <InputLabel htmlFor="photo" value="Imagen Perfil" />
                    {/*
                    <TextInput
                        id="photo"
                        name="photo"
                        type="file"
                        className="mt-1 block w-full"
                        value={data.photo}
                        // onChange={(e) => setData("photo", e.target.value)}
                        onChange={handleImageUpload}
                        autoComplete="photo"
                    /> */}
                    <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    <InputError className="mt-2" message={errors.photo} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                            Tu correo no está verificado.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Reenviar la verificación del email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                Un nuevo enlace de verificación ha sido enviado
                                a tu correo.
                            </div>
                        )}
                    </div>
                )}

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
