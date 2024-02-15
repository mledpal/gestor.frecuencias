export const TipoContacto = ({ t, delTipo, editTipo }) => {
    return (
        <div
            key={t.id}
            className={`w-full bg-${t.color}  flex flex-row items-center justify-between px-5 h-[60px]`}
        >
            <span className="w-2/5">{t.nombre}</span>
            <span
                className={`w-2/5 h-full flex items-center justify-center p-2`}
            >
                {t.color}
            </span>
            <div className="w-1/5 flex flex-col h-full items-center justify-around">
                <i
                    className="fa-solid fa-pencil text-white hover:scale-150 duration-200 cursor-pointer"
                    onClick={() => {
                        editTipo(t);
                    }}
                ></i>
                <i
                    className="fa-solid fa-trash-can text-red-500 hover:scale-150 duration-200 cursor-pointer"
                    onClick={() => {
                        delTipo(t.id);
                    }}
                ></i>
            </div>
        </div>
    );
};
