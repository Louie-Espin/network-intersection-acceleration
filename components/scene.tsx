"use client"

import { Camera, Canvas, Size } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState, ReactNode } from "react";
import { DSVParsedArray } from "d3";
import * as THREE from "three";
import * as d3 from "d3";

type SceneProps = {
    dataURL: string;
    children?: ReactNode
}

type Node = { id: string, group: string, x: number, y: number };
type Edge = { source: string, target: string };
type Network = { nodes: Node[], edges: Edge[] };

/**
 * Parses a DSV Array of Edges into a Network of separate node-edge declarations.
 * @param data
 */
function parseNetwork(data?: DSVParsedArray<object>): Network {
    if (!data || !data.length)
        return { nodes: [], edges: [] }

    /* filter data for valid [x-y] coordinates TODO filter for valid source-target attrs?  */
    const filtered = data.filter(({x1, x2, y1, y2}) => [x1,x2,y1,y2].every(isFinite))

    /* Group source & target node ids */
    const source: d3.InternSet = d3.union(filtered.map(d => d["source"])); // FIXME: hard-coded attr
    const target: d3.InternSet = d3.union(filtered.map(d => d["target"])); // FIXME: hard-coded attr

    /* Form an edge list with only [source, target] values */
    const edges = filtered.map(d => ({ source: d["source"], target: d["target"] }));

    /* Form a set of all unique nodes from the data */
    const nodes = Array.from(source.union(target)).map((id: string) => {
        let direction = source.has(id) ? "source" : "target";
        let edge = filtered.find(edge => edge[direction] == id);

        if (!edge) throw Error("Error parsing network: node-edge mismatch!");

        return {
            id: id,
            group: edge[`${direction}_group`],
            x: (direction == "source" ? edge["x1"] : edge["x2"]),
            y: (direction == "source" ? edge["y1"] : edge["y2"]),
        };
    });

    return { nodes, edges };
}

function NetworkGeometry({ network }: Network) {
    const { nodes, edges } = network;

    const { pointPositions, linePositions } = useMemo(() => {
        if (!nodes || !edges)
            return { pointPositions: new Float32Array<ArrayBuffer>(), linePositions: new Float32Array<ArrayBuffer>() };

        /* buffers of coordinate positions that will be read by the GPU */
        const pointPositions: Float32Array<ArrayBuffer> = new Float32Array(nodes.length * 3) ?? [];
        const linePositions: Float32Array<ArrayBuffer> = new Float32Array(edges.length * 6) ?? [];

        /* allows for indexing later FIXME: just do this when you parse the network? */
        const nodeLookup: Map<string, Node> = new Map(nodes.map((n: Node) => [n.id, n]));

        /* flatten [x,y,z] coordinates of each node into a sequential buffer */
        nodes.forEach((node, i) => {
            pointPositions[i * 3] = node.x;
            pointPositions[i * 3 + 1] = node.y;
            pointPositions[i * 3 + 2] = 0;
        });

        /* flatten [x,y,z] coordinates of each edge direction into a sequential buffer */
        edges.forEach((edge, i) => {
            const source = nodeLookup.get(edge.source)!;
            const target = nodeLookup.get(edge.target)!;
            linePositions.set([source.x, source.y, 0, target.x, target.y, 0,], i * 6);
        });

        return { pointPositions, linePositions };
    }, [network]);

    /* Render the network as a group of points & line segments */
    return (
        <group>
            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
                </bufferGeometry>
                <lineBasicMaterial color="#64748b" transparent={true} opacity={0.5} />
            </lineSegments>
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial color="#38bdf8" size={4} sizeAttenuation={false} />
            </points>
        </group>
    );
}

function NetworkView({ network }: Network) {
    const { nodes } = network

    /* on each network state change, updates the bounds of the viewport */
    const bounds = useMemo(() => {
        if (nodes.length === 0)
            return { cX: 0, cY: 0, width: 10, height: 10 };

        const xs = nodes.map((n) => n.x);
        const ys = nodes.map((n) => n.y);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        return {
            cX: (minX + maxX) / 2,
            cY: (minY + maxY) / 2,
            width: Math.max(maxX - minX, 1),
            height: Math.max(maxY - minY, 1),
        };
    }, [network]);

    /* camera set-up */
    const onCanvas = (camera: Camera, size: Size): void => {
        const cam = camera as THREE.OrthographicCamera;
        const aspect = (size.width / size.height);
        const halfHeight = Math.max(bounds.height, bounds.width / aspect) * 0.6;

        cam.left = -halfHeight * aspect;
        cam.right = halfHeight * aspect;
        cam.top = halfHeight;
        cam.bottom = -halfHeight;
        cam.updateProjectionMatrix();
    }

    return (
        <div className="w-full h-full">
            <Canvas orthographic camera={{ position: [bounds.cX, bounds.cY, 100], near: 0.1, far: 1000, }}
                    onCreated={({ camera, size }) => onCanvas(camera, size)}
            >
                <color attach="background" args={["#0f172a"]} />
                <NetworkGeometry network={network} />
                <OrbitControls target={[bounds.cX, bounds.cY, 0]}
                               enableRotate={false} enablePan enableZoom screenSpacePanning
                />
            </Canvas>
        </div>
    );
}

export default function Scene({ dataURL, children }: SceneProps) {
    const [data, setData] = useState<DSVParsedArray<object>>(null);

    /* Fetching .CSV data */
    useEffect(() => {
        let cancelled = false;

        d3.csv(dataURL, d3.autoType)
            .then(res => {
                if (!cancelled) setData(res)
            })
            .catch(console.error);

        return () => { cancelled = true; };
    }, [dataURL]);

    /* Parse d3 array into separate nodes & edges */
    const network = useMemo(() => (parseNetwork(data)), [data]);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <NetworkView key={data ? "loaded" : "empty"} network={network} />
            {children}
        </div>
    );
}
