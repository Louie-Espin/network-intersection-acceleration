import { Vector2, Vector2Like } from "three"

type BVNode = {
    bounds: BoundingVolume,
    nodes: Node[];
    childA?: BVNode,
    childB?: BVNode,
}

class BoundingVolume {

    #_max: Vector2 = new Vector2(-Infinity, -Infinity);
    #_min: Vector2 = new Vector2(+Infinity, +Infinity);

    constructor() {}

    updateBounds({x, y}: Vector2Like) {
        this.#_max.max({ x, y });
        this.#_min.min({ x, y });
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

    private root: BVNode;
    private max_depth:  number = 7;
    private num_leaves: number = 5;

    constructor(nodes: Node[]) {
        // create a root bounding box - encloses every node in the graph
        let bounds: BoundingVolume = new BoundingVolume();
        nodes.forEach((n) => bounds.updateBounds({ x: n.x, y: n.y }));

        // split the root node based on the chosen split strategy, depth & num_leaves FIXME DONT PASS ALL NODES
        this.root = { bounds: bounds, nodes: nodes, childA: undefined, childB: undefined }
        this.Split(this.root); // TODO implement split strategy options
    }

    Split(parent: BVNode, depth: number = 0 ): void {
        if (depth == this.max_depth || parent.nodes.length <= this.num_leaves)
            return;

        // create children
        parent.childA = { bounds: new BoundingVolume(), nodes: [] };
        parent.childB = { bounds: new BoundingVolume(), nodes: [] };

        // determine which axis to split on: x=0 or y=1
        let axis = (parent.bounds.Size.x > parent.bounds.Size.y) ? 'x' : 'y';

        // split nodes to either child
        parent.nodes.forEach((node) => {
            let inA: boolean = node[axis] < parent.bounds.Center[axis];
            let child = inA ? parent.childA! : parent.childB!;

            child.bounds.updateBounds(node)
            child.nodes.push(node);
        })

        // recursively split children
        this.Split(parent.childA, depth + 1);
        this.Split(parent.childB, depth + 1);
    }

    /* Returns the hierarchy as an array FIXME: inefficient & unnecessary, just compute the BVH as an array from the first */
    Flattened(): BVNode[] {
        const res = new Array<BVNode>();

        // BFS - o(v)
        let queue = new Array<BVNode>();
        queue.push(this.root);
        while (queue.length) {
            let curr = queue.shift();
            if (!curr) continue;
            res.push(curr);

            if (curr?.childA) queue.push(curr.childA);
            if (curr?.childB) queue.push(curr.childB);
        }

        return res;
    }
}