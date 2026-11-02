"use client";

import {ChangeEvent} from "react";

type SliderProps = {
    id: string
    label: string
    value: number
    onChange: (number) => void
    step?: number | string
    bounds?: { min: number, max: number }
}

function Slider({ id, label, value, onChange, step, bounds }: SliderProps) {

    return (
        <div className="flex flex-col items-stretch">
            <div>
                <label htmlFor={id}>{`${label}: `}</label>
                <output>{value}</output>
            </div>
            <input id="discrete-slider" type="range" value={value}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                   step={step ?? 1} min={bounds?.min ?? 0} max={bounds?.max ?? 100}
            />
        </div>
    );
}

export default Slider;