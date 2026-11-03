## Introduction
Goals of this project:
- create a BVH library that can be generalized to fit multiple needs
- design a UI that helps the user intuit how a BVH is built and traversed

## To-Do
- [ ] abstract the BVH class for future, more precise implementations:
  - [ ] refactor `BVH.ts` to be "abstract"
  - [ ] abstract `split` method
  - [ ] create logger & stats checker
  - [x] change BVH build behavior based on different options
  - [x] implement 2-d pane BVH
  - [ ] implement 3-d AABB BVH (?)

- [ ] create a BVH `options` object supporting the following:
  - [x] `leaf_size`: maximum number of objects in a leaf node
  - [x] `max_depth`: maximum depth of the BVH
  - [ ] `strategy`: `SAH | Center | Average` - BVH split strategy
  - [x] invoked during BVH construction & subsequent rebuilds
  - [x] re-render UI on `options` change

- [x] implement support for different node-edge networks
  - [x] parse CSV file for unique nodes & edges
  - [x] build BVH on network updates
  - [x] draw the network on-load
  - [x] draw BVH on-load

- [x] CPU (top-down) BVH building
  - [x] recursive build
  - [x] compact (array) BVH representation
  - [ ] split strategies
    - [x] spatial split by center (alternating axes)
    - [ ] surface area heuristic
    - [ ] point/triangle average

- [ ] BVH Traversal
  - [x] box intersection test
  - [ ] triangle intersection test
  - [ ] closest point test

- [ ] Create the Options Pane UI:
  - [x] network select
  - [x] split strategy
  - [x] maximum depth
  - [X] maximum leaf size
  - [x] profiler start

- [ ] Performance Profiler & Statistics Pane:
  - [ ] BVH stats: 
    - [ ] construction time 
    - [ ] update time
    - [ ] traversal time
    - [ ] node count
    - [ ] average leaf size & extent
    - [ ] tree depth
  - [ ] Network stats:
    - [ ] node count
    - [ ] edge count
  - [ ] Traversal stats:
    - [ ] real-time traversal time chart
    - [ ] (on-hover) display bounding-box or tri info

- [ ] track BVH building compute for a network of `e` edges & `v` nodes
  - [x] root volume bounds calc: `O(v)`

## Resources
- [How to Build a BVH - jbikker](https://jacco.ompf2.com/2022/04/13/how-to-build-a-bvh-part-1-basics/)
- [Compact BVH - Wikipedia](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy#Compact_BVH_for_efficient_traversal)

## Getting Started
To run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.