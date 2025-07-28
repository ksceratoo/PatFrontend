import type { Route } from "./+types/index";
import Nav from "~/components/Nav";
import Hero from "~/components/Hero";
import Intros from "~/components/Intros";

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
