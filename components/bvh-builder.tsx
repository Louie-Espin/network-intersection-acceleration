import { useMemo } from "react"
import { Instances, Instance } from "@react-three/drei"
import { PlaneGeometry, EdgesGeometry } from "three";
import * as THREE from "three"

import { BVH } from "@/library/bvh/BVH";

type BvhBuilderProps = {
    nodes: Node[],
    depth: number
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
            {/* NON-MAX-DEPTH BOUNDS */}
            {bvh.Compact.map((bv, i) =>
                bv.depth !== depth && (
                    <lineSegments key={i} geometry={edgeGeometry}
                                  position={[...bv.bounds.Center, 0.001]} scale={[...bv.bounds.Size, 1]}
                                  onUpdate={(line) => line.computeLineDistances()}
                    >
                        <lineDashedMaterial transparent={true} opacity={0.5} depthWrite={false}
                                            dashSize={0.02} gapSize={0.01}
                                            color={new THREE.Color().setHSL((bv.depth / 6.0) % 1.0, 1.0, 0.5)}
                        />
                    </lineSegments>
                )
            )}
        </group>
    );
}

export default BvhBuilder;