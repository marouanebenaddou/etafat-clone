import { Pill } from "./Pill";

export function QuestionCTA() {
  return (
    <section className="bg-[#f5f7f9] py-20">
      <div className="container-etafat flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <h2 className="text-navy text-3xl md:text-4xl font-semibold leading-tight">
          Vous avez une question&nbsp;?
        </h2>
        <Pill href="/contact/" variant="teal" arrow="right">
          Nous contacter
        </Pill>
      </div>
    </section>
  );
}
