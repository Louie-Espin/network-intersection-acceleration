import {useEffect, useMemo, useRef} from "react"
import { Instances, Instance } from "@react-three/drei"
import { Vector2 } from "three"
import * as THREE from "three"

import { BVH } from "@/library/bvh/BVH";

type BoundingVolume = {
    extent: Vector2,
    center: Vector2,
}

type BvhBuilderProps = {
    nodes: Node[]
}

const BvhBuilder = ({ nodes = [] }: BvhBuilderProps) => {
    /* Re-Instantiate BVH when nodes change FIXME - WARNING: all BVH state will be wiped whenever deps change */
    const bvh = useMemo(() => new BVH(nodes), [nodes]);

    console.log("root:", bvh.Flattened()[0]);
    console.log(bvh.Flattened());

    if (!bvh || !bvh.Flattened().length) return null;
    return (
        <Instances>
            <planeGeometry />
            <meshBasicMaterial color={"#F00"} transparent={true} opacity={0.25} side={2} />
            {bvh.Flattened().map((bv, i) => (
                <Instance key={i} position={[...bv.bounds.Center, 0]} scale={[...bv.bounds.Size, 1]} />
            ))}
        </Instances>
    );

    // TODO: groups may be useful when traversal is implemented, ie. an individual hit square should glow a different color
    // return (
    //     <group>
    //         {bvh.Flattened().map((bv, i) => (
    //             <mesh key={i} position={[bv.bounds.Center.x, bv.bounds.Center.y, 0]}>
    //                 <planeGeometry args={[...bv.bounds.Size]}/>
    //                 <meshBasicMaterial color={"#ff0000"} transparent={true} opacity={0.25} side={2}/>
    //             </mesh>
    //         ))}
    //     </group>
    // )
}

export default BvhBuilder;