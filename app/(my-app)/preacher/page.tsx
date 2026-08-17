import type { Metadata } from "next";
import Link from "next/link";
import { getMessages } from "@/lib/payload/preacher";
import { getSiteSettings } from "@/lib/payload/settings";
import { buildMetadata } from "@/lib/seo";
import { pickFeatured } from "@/lib/payload/featured";
import PreacherList from "./PreacherList";
import styles from "./preacher.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  return buildMetadata({
    title: "Preacher — theAdefala",
    description:
      "Not a brand pillar — a starting point. Reflections and messages by theAdefala.",
    path: "/preacher",
    image: pickFeatured(messages)?.coverImage,
  });
}

export const revalidate = 60;

export default async function PreacherPage() {
  const [messages, { siteTitle }] = await Promise.all([
    getMessages(),
    getSiteSettings(),
  ]);
  const sorted = [...messages].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          {siteTitle}
        </Link>
        <Link href="/#preacher" className={styles.back}>
          ← Back to the story
        </Link>
      </header>

      <section className={styles.hero}>
        <span className={styles.kicker}>Preacher</span>
        <h1 className={styles.title}>
          Everything else here is downstream of what I believe.
        </h1>
        <p className={styles.body}>
          This isn&rsquo;t a persona layered on top of the rest of the
          site. It&rsquo;s the starting point the other three chapters
          build on top of.
        </p>
        <p className={styles.body}>
          Messages, notes, and reflections will live here as they&rsquo;re
          ready — recorded or written, not performed for an algorithm.
        </p>
      </section>

      <PreacherList messages={sorted} />
    </main>
  );
}
