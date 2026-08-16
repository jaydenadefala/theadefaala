import { getPayload } from "payload";
import config from "@payload-config";

interface SectionCounts {
  total: number;
  published: number;
  drafts: number;
}

const CONTENT_SECTIONS = [
  { slug: "writing", label: "Writing", href: "/admin/collections/writing" },
  { slug: "poems", label: "Poetry", href: "/admin/collections/poems" },
  {
    slug: "development-projects",
    label: "Development",
    href: "/admin/collections/development-projects",
  },
  {
    slug: "preacher-messages",
    label: "Preacher",
    href: "/admin/collections/preacher-messages",
  },
] as const;

async function getSectionCounts(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: (typeof CONTENT_SECTIONS)[number]["slug"]
): Promise<SectionCounts> {
  const [total, published, drafts] = await Promise.all([
    payload.count({ collection }),
    payload.count({ collection, where: { _status: { equals: "published" } } }),
    payload.count({ collection, where: { _status: { equals: "draft" } } }),
  ]);
  return {
    total: total.totalDocs,
    published: published.totalDocs,
    drafts: drafts.totalDocs,
  };
}

/**
 * The "Overview" the master directive's admin spec calls for — real
 * content counts and quick links pulled live from Payload's local
 * API, not a static placeholder screen. Registered as
 * admin.components.beforeDashboard in payload.config.ts, so it renders
 * above Payload's own default collection-list dashboard rather than
 * replacing it (that default view is still useful — this adds the
 * "how much is here, and is it published" glance it was missing).
 */
export async function DashboardOverview() {
  const payload = await getPayload({ config });

  const [sectionCounts, mediaCount] = await Promise.all([
    Promise.all(
      CONTENT_SECTIONS.map((section) => getSectionCounts(payload, section.slug))
    ),
    payload.count({ collection: "media" }),
  ]);

  return (
    <div className="ta-dashboard">
      <h2 className="ta-dashboard__heading">Overview</h2>
      <div className="ta-dashboard__grid">
        {CONTENT_SECTIONS.map((section, i) => {
          const counts = sectionCounts[i];
          return (
            <a key={section.slug} href={section.href} className="ta-dashboard__card">
              <span className="ta-dashboard__cardLabel">{section.label}</span>
              <span className="ta-dashboard__cardCount">{counts.total}</span>
              <span className="ta-dashboard__cardBreakdown">
                {counts.published} published · {counts.drafts} draft
              </span>
            </a>
          );
        })}
        <a href="/admin/collections/media" className="ta-dashboard__card">
          <span className="ta-dashboard__cardLabel">Media</span>
          <span className="ta-dashboard__cardCount">{mediaCount.totalDocs}</span>
        </a>
      </div>
      <div className="ta-dashboard__quickLinks">
        <a href="/admin/globals/site-settings">Site Settings</a>
        <a href="/admin/globals/homepage-settings">Homepage Settings</a>
      </div>
    </div>
  );
}
