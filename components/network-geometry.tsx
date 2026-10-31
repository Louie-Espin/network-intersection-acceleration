import { useMemo } from "react";

export default function NetworkGeometry({ network }: { network: Network }) {
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