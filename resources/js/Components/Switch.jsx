import "../../css/Switch.css";
export const Switch = ({
    type = "checkbox",
    className = "",
    checked,
    disabled,
    children,
    handleCheck,
    ...props
}) => {
    return <input className="" type="checkbox" name="" checked={checked} onChange={handleCheck}></input>;
};
