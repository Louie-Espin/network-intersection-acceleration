"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type BVHContextType = {
    url: string
    setURL: (url: string) => void
    maxDepth: number
    setMaxDepth: (num: number) => void
    maxLeaf: number
    setMaxLeaf: (num: number) => void
    strategy: string
    setStrategy: (s: string) => void
};

const BVHContext = createContext<BVHContextType | null>(null);

export function BVHContextProvider({ children }: { children: ReactNode }) {
    const [url, setURL] = useState<string>("data/graph_md_7_47.csv");
    const [maxDepth, setMaxDepth] = useState<number>(7);
    const [maxLeaf, setMaxLeaf] = useState<number>(5);
    const [strategy, setStrategy] = useState<string>("alternate")

    return (
        <BVHContext.Provider value={{
            url:      url, setURL,
            maxDepth: maxDepth, setMaxDepth,
            maxLeaf:  maxLeaf, setMaxLeaf,
            strategy: strategy, setStrategy
        }}>
            {children}
        </BVHContext.Provider>
    );
}

export function useBVHContext() {
    const context = useContext(BVHContext);
    if (!context)
        throw new Error("useBVHContext must be used within BVHContextProvider");

    return context;
}