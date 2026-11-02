"use client";

type ButtonProps = {
    text: string
}

const Button = ({ text }: ButtonProps) => {
    return (
        <button className="bg-indigo-600 px-4 rounded-sm">
            {text}
        </button>
    )
}

export default Button;