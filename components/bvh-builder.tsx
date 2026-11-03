import { useMemo } from "react"
import { Instances, Instance } from "@react-three/drei"
import * as THREE from "three"

import { BVH } from "@/library/bvh/BVH";

type BvhBuilderProps = {
    nodes: Node[],
    depth: number
}

const BvhBuilder = ({nodes = [], depth}: BvhBuilderProps) => {
    /* Re-Instantiate BVH when nodes change FIXME - WARNING: all BVH state will be wiped whenever deps change */
    const bvh = useMemo(() => new BVH(nodes, depth), [nodes, depth]);

    console.log("root:", bvh.Compact[0]);
    console.log('BVH (compact):', bvh.Compact);

    if (!bvh || !bvh.Compact.length) return null;
    return (
        <group>
            {/* MAX-DEPTH BOUNDS */}
            <Instances>
                <planeGeometry/>
                <meshBasicMaterial transparent={true} opacity={.5} side={THREE.DoubleSide} depthWrite={false}/>
                {bvh.Compact.map((bv, i) => (
                    (bv.depth == depth) && (
                        <Instance key={i}
                                  color={new THREE.Color().setHSL((bv.depth / 6.0 % 1.0), 1.0, 0.5)}
                                  position={[...bv.bounds.Center, 0]} scale={[...bv.bounds.Size, 1]}
                        />
                    )
                ))}
            </Instances>
            {/* EARLIER BOUNDS - wireframe */}
            <Instances>
                <planeGeometry/>
                <meshBasicMaterial transparent={true} wireframe={true} opacity={0.5} side={THREE.DoubleSide}
                                   depthWrite={false}/>
                {bvh.Compact.map((bv, i) => (
                    (bv.depth != depth) && (
                        <Instance key={i}
                                  color={new THREE.Color().setHSL((bv.depth / 6.0 % 1.0), 1.0, 0.5)}
                                  position={[...bv.bounds.Center, 0]} scale={[...bv.bounds.Size, 1]}
                        />
                    )
                ))}
            </Instances>
        </group>
    );
}

export default BvhBuilder;