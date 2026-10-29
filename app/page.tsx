import Image from "next/image";

import Scene from "@/components/scene";
import NetworkView from "@/components/NetworkView";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <Scene dataURL={"data/network_1.csv"}>

        </Scene>
      {/*<main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">*/}
      {/*</main>*/}
    </div>
  );
}
