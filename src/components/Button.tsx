type ButtonProps = {
    name: string,
    handleClick: (name: string) => void
}

function Button({name, handleClick}: ButtonProps) {
    return <button type="button" className="btn btn-primary btn-lg" onClick={() => handleClick(name)}>{name}</button>
}

export default Button;