import { useMemo } from "react"
import { Vector2 } from "three"
import * as THREE from "three"

type BoundingVolume = {
    extent: Vector2,
    center: Vector2,
}

type BvhBuilderProps = {
    nodes: Node[]
}

/**
 * Iterate over every node in the network, finding the [min, max] bounds of the entire scene
 * time complexity - O(v)
 * @param nodes
 */
const sceneBounds = (nodes: Node[]): { min: Vector2, max: Vector2 } => {
    const max: Vector2 = new Vector2(-Infinity, -Infinity);
    const min: Vector2 = new Vector2(+Infinity, +Infinity);

    nodes.forEach(({ x, y}) => {
        max.max({ x, y } as Vector2);
        min.min({ x, y } as Vector2)
    });

    return { min, max };
}


const BvhBuilder = ({ nodes }: BvhBuilderProps) => {


    const bvh: { size: Vector2, center: Vector2 } = useMemo(() => {
        if (!nodes || !nodes.length)
            return { size: new Vector2(0,0), center: new Vector2(0, 0) };

        const scene = sceneBounds(nodes);
        let w = Math.abs(scene.max.x - scene.min.x);
        let h = Math.abs(scene.max.y - scene.min.y);
        let center = new Vector2().addVectors(scene.max, scene.min).multiplyScalar(0.5);

        return ({
            size: new Vector2(w, h),
            center: center
        })
    }, [nodes])

    return (
        <mesh position={[...bvh.center, 0]}>
            <planeGeometry args={[...bvh.size]}/>
            <meshBasicMaterial color={"#ff0000"} transparent={true} opacity={0.25} side={2}/> {/* side={2} renders double-sided */}
        </mesh>
    )
}

export default BvhBuilder;