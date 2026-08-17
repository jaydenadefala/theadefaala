import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/payload/settings";
import { buildMetadata } from "@/lib/seo";
import styles from "./connect.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { profileImage } = await getSiteSettings();
  return buildMetadata({
    title: "Connect — theAdefala",
    description: "Get in touch with theAdefala.",
    path: "/connect",
    image: profileImage,
  });
}

export const revalidate = 60;

export default async function ConnectPage() {
  const { email, siteTitle } = await getSiteSettings();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          {siteTitle}
        </Link>
        <Link href="/#connect" className={styles.back}>
          ← Back to the story
        </Link>
      </header>

      <section className={styles.main}>
        <span className={styles.kicker}>Connect</span>
        <h1 className={styles.title}>
          Say the thing you came here to say.
        </h1>
        <a href={`mailto:${email}`} className={styles.email}>
          {email}
        </a>
        <p className={styles.note}>
          Work inquiries, writing, speaking, or just to say something
          landed — real replies, no forms, no gatekeeping.
        </p>

        <nav className={styles.chapters} aria-label="Other chapters">
          <Link href="/writing" className={styles.chapterLink}>
            Writing
          </Link>
          <Link href="/development" className={styles.chapterLink}>
            Development
          </Link>
          <Link href="/poetry" className={styles.chapterLink}>
            Poetry
          </Link>
          <Link href="/preacher" className={styles.chapterLink}>
            Preacher
          </Link>
        </nav>
      </section>
    </main>
  );
}
