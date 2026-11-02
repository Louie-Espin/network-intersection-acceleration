"use client";

import { ChangeEvent } from "react";

type SelectProps = {
    id: string,
    label: string,
    value: string,
    options: { label: string, value: string }[]
    onChange: (string) => void,
}

export default function Select({ id, label, value, options, onChange }: SelectProps) {

    return (
        <div className="flex flex-col items-start justify-center w-full h-auto">
            {label && <label htmlFor={id}>{label}</label>}
            <select
                className="p-1 rounded-lg border-1 border-solid border-white w-full"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
                id={id} name={id} value={value}
            >
                {options.map(({ label, value }) => (
                    <option key={label} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}