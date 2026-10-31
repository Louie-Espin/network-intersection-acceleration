import Image from "next/image";

import Scene from "@/components/scene";
import NetworkView from "@/components/NetworkView";

export default function Home() {
  return (
    <main className="bg-zinc-50 font-sans dark:bg-black">
        <Scene dataURL="data/graph_lg_19_45.csv">
            <div className="w-full h-[80dvh] max-w-xs my-12 ml-6 bg-black rounded-3xl opacity-[.6] pointer-events-auto">
                <div className="w-full h-full flex flex-1 flex-col items-start justify-between py-32 px-16">
                    <button className="bg-indigo-600 px-4 rounded-sm">
                        Sample UI Button
                    </button>
                </div>

            </div>
        </Scene>
    </main>
  );
}
