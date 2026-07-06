import { Container } from "@/components/ui/container";

export function PolicyLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Container className="max-w-2xl py-16">
      <h1 className="font-display text-4xl font-medium tracking-tightest">{title}</h1>
      <div className="prose-sm mt-8 space-y-4 text-sm leading-relaxed text-stone-600">{children}</div>
    </Container>
  );
}
