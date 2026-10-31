type Node = {
    id: string,
    group: string,
    x: number,
    y: number
};

type Edge = {
    source: string,
    target: string
};

type Network = {
    nodes: Node[],
    edges: Edge[]
};
