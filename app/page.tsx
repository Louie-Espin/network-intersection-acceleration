import Image from "next/image";

import Scene from "@/components/scene";
import NetworkView from "@/components/NetworkView";
import NetworkControls from "@/components/network-controls";
import { BVHContextProvider } from "@/components/context/bvh-context";
import NetworkStatistics from "@/components/network-statistics";

export default function Home() {
  return (
    <main className="bg-zinc-50 font-sans dark:bg-black">
        <BVHContextProvider>
            <Scene>
                <NetworkControls />
            </Scene>
        </BVHContextProvider>
    </main>
  );
}
