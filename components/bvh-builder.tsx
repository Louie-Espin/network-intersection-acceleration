import { useMemo, useEffect } from "react"
import { Instances, Instance } from "@react-three/drei"
import { PlaneGeometry, EdgesGeometry, Color, Vector2, DoubleSide } from "three";
import * as THREE from "three"

import { BVH } from "@/library/bvh/BVH";

type BvhBuilderProps = {
    nodes: Node[],
    depth: number
}

type PaneBVHProps = {
    position: Vector2
    scale: Vector2
    depth: number
    filled: boolean
}

/* Represents a single node on the BVH as a colored pane */
const PaneBVH = ({ position, scale, depth, filled }: PaneBVHProps) => {
    /* Color hue based on node's depth */
    const color = useMemo(
        () => new Color().setHSL((depth / 6.0) % 1.0, 1.0, 0.5),
        [depth]
    );

    /* Memoized geometry based on the [width, height] of the node's bounds */
    const geometry: EdgesGeometry = useMemo(() => {
        const plane = new PlaneGeometry(scale.x, scale.y);
        const edges = new EdgesGeometry(plane);
        plane.dispose();

        const lines = new THREE.LineSegments(edges);
        lines.computeLineDistances();

        return edges;
    }, [scale]);

    /* Clean up on geometry change or unmount */
    useEffect(
        () => { return () => geometry.dispose() },
        [geometry]
    );

    return (
        <group>
            <lineSegments geometry={geometry} position={[...position, 0.001]}>
                <lineDashedMaterial color={color} transparent={true} opacity={0.5} depthWrite={false}
                                    dashSize={0.01} gapSize={0.05} />
            </lineSegments>
            { filled && (
                <mesh position={[...position, 0.0]}>
                    <planeGeometry args={[...scale]}/>
                    <meshBasicMaterial color={color} transparent={true} opacity={.5}
                                       side={DoubleSide} depthWrite={false} />
                </mesh>
            )}
        </group>
    )
}

const BvhBuilder = ({nodes = [], depth}: BvhBuilderProps) => {
    /* Re-Instantiate BVH when nodes change FIXME - WARNING: all BVH state will be wiped whenever deps change */
    const bvh = useMemo(() => new BVH(nodes, depth), [nodes, depth]);
    const edgeGeometry = useMemo(
        () => new EdgesGeometry(new PlaneGeometry(1, 1)),
        []
    );

    console.log("root:", bvh.Compact[0]);
    console.log('BVH (compact):', bvh.Compact);

    if (!bvh || !bvh.Compact.length) return null;
    return (
        <group>
            {bvh.Compact.map((bv, i) => (
                <PaneBVH key={i} position={bv.bounds.Center} scale={bv.bounds.Size} depth={bv.depth} filled={bv.depth == depth} />
            ))}
        </group>
    );
}

export default BvhBuilder;