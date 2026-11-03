import { Vector2, Vector2Like } from "three"

class NodeBVH {
    constructor(
        public bounds: BoundingVolume = new BoundingVolume(),
        public depth: number = 0,
        public nodes: Node[] = [],
        public childIdx: number = 0
    ) { }
}

class Ray {
    constructor(
        public origin: Vector2,
        public dir: Vector2,
        public invDir: Vector2 = new Vector2(1,1).divide(dir) // (1 / dir)
    ) { }
}

class BoundingVolume {

    #_max: Vector2 = new Vector2(-Infinity, -Infinity);
    #_min: Vector2 = new Vector2(+Infinity, +Infinity);

    constructor() {}

    updateBounds({x, y}: Vector2Like) {
        this.#_max.max({ x, y });
        this.#_min.min({ x, y });
    }

    get Min(): Vector2 {
        return this.#_min;
    }

    get Max(): Vector2 {
        return this.#_max;
    }

    get Center(): Vector2 {
        return new Vector2().addVectors(this.#_max, this.#_min).multiplyScalar(0.5)
    }

    get Size(): Vector2 {
        let w = Math.abs(this.#_max.x - this.#_min.x);
        let h = Math.abs(this.#_max.y - this.#_min.y);
        return new Vector2(w, h);
    }
}

export class BVH {

    private bvh: NodeBVH[] = [];
    private max_depth:  number = 7;
    private num_leaves: number = 5;

    /**
     * Construct a Bounding Volume Hierarchy based on the vertices of a network & a set of {...options} TODO add options
     * @param nodes - a list of all points in the network
     * @param maxDepth - maximum depth of the BVH tree
     * @param numLeaves - maximum number of items (ie. vertices, triangles) contained by a leaf bvh node
     */
    constructor(nodes: Node[], maxDepth = 7, numLeaves = 5) {
        // set bvh options TODO create an options object param
        this.max_depth  = maxDepth;
        this.num_leaves = numLeaves;

        // create a root bounding box - encloses every node in the graph
        let bounds: BoundingVolume = new BoundingVolume();
        nodes.forEach((n) => bounds.updateBounds({ x: n.x, y: n.y }));

        // split the root node based on the chosen split strategy, depth & num_leaves TODO implement split strategy options
        this.bvh.push({ bounds: bounds, depth: 0, nodes: nodes, childIdx: 0 });
        this.Split(this.bvh[0]);
    }

    /**
     * Get the computed BVH in compact form (i.e. a continuous array of BVH nodes)
     */
    get Compact(): NodeBVH[] {
        return this.bvh;
    }

    /**
     *  Traverse the compact hierarchy
     */
    Traverse(): NodeBVH[] {
        const res = new Array<NodeBVH>();

        // BFS - o(v)
        let queue = new Array<NodeBVH>();
        queue.push(this.bvh[0]);
        while (queue.length) {
            let curr = queue.shift();
            if (!curr) continue;
            res.push(curr);

            if (this.bvh[curr.childIdx]) queue.push(this.bvh[curr.childIdx]);
            if (this.bvh[curr.childIdx + 1]) queue.push(this.bvh[curr.childIdx + 1]);
        }

        return res;
    }

    private Split(parent: NodeBVH, depth: number = 0 ): void {
        if (depth == this.max_depth || parent.nodes.length <= this.num_leaves)
            return;

        // create children
        parent.childIdx = this.bvh.length;
        const childA: NodeBVH = { bounds: new BoundingVolume(), depth: depth + 1, nodes: [], childIdx: 0 }; // idx: parent.childIdx
        const childB: NodeBVH = { bounds: new BoundingVolume(), depth: depth + 1, nodes: [], childIdx: 0 }; // idx: parent.childIdx++

        // determine which axis to split on: x=0 or y=1
        let axis = (parent.bounds.Size.x > parent.bounds.Size.y) ? 'x' : 'y';

        // split nodes to either child
        parent.nodes.forEach((node) => {
            let inA: boolean = node[axis] < parent.bounds.Center[axis];
            let child = inA ? childA! : childB!;

            child.bounds.updateBounds(node)
            child.nodes.push(node);
        })

        // update the BVH & continue splitting recursively
        this.bvh.push(childA);
        this.bvh.push(childB);
        this.Split(childA, depth + 1);
        this.Split(childB, depth + 1);
    }

    public Trace(ray: Ray) {
        const dist: number = Infinity;
        const stack: NodeBVH[] = new Array<NodeBVH>(this.max_depth);
        stack.push(this.bvh[0]);

        while (stack.length) {
            let curr = stack.pop()!;
            let test = this.RayBoxIntersection(ray, curr.bounds)

            if (test) {
                if (curr.childIdx == 0) {
                    curr.nodes.forEach(({ x, y }: Node, i: number) => {
                        /* check if curr node is collinear with ray TODO: do proper ray-triangle intersection test */
                        const V: Vector2 = new Vector2().subVectors({ x, y }, ray.origin); // V = P-O
                        const D: Vector2 = ray.dir.clone().normalize();
                        let t = V.dot(D); // t = V⋅D = (P-O)⋅D
                        // TODO: calculate Closest Point
                        //  Q = O + (D * t)
                        // TODO: Check if distance between P and Q is practically zero
                        //  float distSquared = distanceSquared(P, Q)
                        //  if distSquared <= (epsilon * epsilon): return true
                    })
                }
            }
        }

        return dist;
    }

    /**
     * Ray-Box intersection using the 'slab method'.
     * [source](https://tavianator.com/2022/ray_box_boundary.html)
     * @param {Ray} ray
     * @param {BoundingVolume} box
     */
    private RayBoxIntersection(ray: Ray, box: BoundingVolume): number {
        let tMin: Vector2 = new Vector2().subVectors(box.Min, ray.origin).multiply(ray.invDir); // (boxMin - origin) / dir
        let tMax: Vector2 = new Vector2().subVectors(box.Max, ray.origin).multiply(ray.invDir); // (boxMax - origin) / dir
        let t1: Vector2 = tMin.clone().min(tMax); // min(tMin, tMax)
        let t2: Vector2 = tMin.clone().max(tMax); // max(tMin, tMax)
        let distFar  = Math.min(t2.x, t2.y);
        let distNear = Math.max(t1.x, t1.y);

        if (distFar > 0 && distFar >= distNear) return distNear;
        else return Infinity;
    }
}