import type { Route } from "./+types/index";
import Nav from "~/components/Navs/Nav";
import Hero from "~/components/PageElements/Hero";
import Intros from "~/components/PageElements/Intros";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pat" },
    { name: "Official Website for Pat: Programming Language", content: "Pat" },
  ];
}

export default function Home() {
  return (
    <>
      <div className="mx-auto">
        <Hero />
      </div>
      <Intros />
    </>
  );
}
