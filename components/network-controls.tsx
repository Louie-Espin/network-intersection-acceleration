"use client";

import {ReactNode, useState} from "react";

import { useBVHContext } from "@/components/context/bvh-context";
import Button from "@/components/ui/button"
import Select from "@/components/ui/select";
import Slider from "@/components/ui/slider";

const csv_items = [
    { label: "Default", value: "data/network_1.csv"      },
    { label: "Large",   value: "data/graph_lg_19_45.csv" },
    { label: "Medium",  value: "data/graph_md_7_47.csv"  },
    { label: "Small",   value: "data/graph_sm_9_58.csv"  },
]

const strategies = [
    { label: "Center (Alternating Axis)", value: "center" },
    { label: "Center (X-Axis)",           value: "center-x" },
    { label: "Center (Y-Axis)",           value: "center-y" },
    { label: "Mean Cuts",                 value: "mean" },
    { label: "Surface Area Heuristic",    value: "SAH" },
]

const ControlsGroup = ({ title, children }: { title: string, children?: ReactNode }) => {
    return (
        <fieldset className="w-full px-2 pb-5 pt-2 rounded-2xl border" id={`${title}-card`} >
            <legend className="text-md font-semibold px-2 bg-black ">
                {title}
            </legend>
            <div className="flex flex-col justify-start gap-4 px-2">
                {children}
            </div>
        </fieldset>
    )
}

const NetworkControls = () => {
    const { url, setURL } = useBVHContext();
    const { maxDepth, setMaxDepth } = useBVHContext();
    const { maxLeaf, setMaxLeaf } = useBVHContext();
    const { strategy, setStrategy } = useBVHContext();

    return (
        <div className="w-full max-w-xs my-12 ml-6 bg-black rounded-3xl opacity-[.6] pointer-events-auto">
            <div className="w-full flex flex-col justify-start gap-2 py-6 px-6" id='network-controls' >
                <h1 className="font-bold text-xl pl-4">Controls</h1>
                <ControlsGroup title="Network">
                    <Select id='network-select' label="Select Network" options={csv_items} value={url} onChange={setURL} />
                </ControlsGroup>
                <ControlsGroup title="BVH Build">
                    <Select id='strategy-select' label="Select Split Strategy"
                            options={strategies} value={strategy} onChange={setStrategy} />
                    <Slider id='depth-slider' label="Maximum Depth"
                            bounds={{min: 0, max: 30}} value={maxDepth} onChange={setMaxDepth} />
                    <Slider id='leaf-slider' label="Maximum Leaf Size"
                            bounds={{min: 1, max: 10}} value={maxLeaf} onChange={setMaxLeaf} />
                </ControlsGroup>
                <ControlsGroup title="Performance">
                    <Button text="Start Profiling"/>
                </ControlsGroup>
            </div>
        </div>
    );
}

export default NetworkControls;