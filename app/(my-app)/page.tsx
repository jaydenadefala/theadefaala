import OpeningScene from "@/app/components/opening/OpeningScene";
import ChapterWorld from "@/app/components/ChapterWorld";
import ChapterRail from "@/app/components/ChapterRail";
import WritingChapter from "@/app/components/WritingChapter";
import DevelopmentChapter from "@/app/components/DevelopmentChapter";
import PoetryChapter from "@/app/components/PoetryChapter";
import PreacherChapter from "@/app/components/PreacherChapter";
import FinalChapter from "@/app/components/FinalChapter";
import { getFeaturedWritingPiece } from "@/lib/payload/writing";
import { getFeaturedProject } from "@/lib/payload/development";
import { getFeaturedPoem } from "@/lib/payload/poems";
import { getFeaturedMessage } from "@/lib/payload/preacher";
import { getSiteSettings, getHomepageSettings } from "@/lib/payload/settings";

export const revalidate = 60;

export default async function Home() {
  const [writingPiece, project, poem, message, siteSettings, homepageSettings] =
    await Promise.all([
      getFeaturedWritingPiece(),
      getFeaturedProject(),
      getFeaturedPoem(),
      getFeaturedMessage(),
      getSiteSettings(),
      getHomepageSettings(),
    ]);

  return (
    <main id="top" className="flex flex-1 flex-col">
      <OpeningScene
        name={siteSettings.siteTitle}
        roles={homepageSettings.identityRoles}
      />
      <ChapterRail />
      <ChapterWorld>
        <WritingChapter piece={writingPiece} />
        <DevelopmentChapter project={project} />
        <PoetryChapter poem={poem} />
        <PreacherChapter message={message} />
        <FinalChapter
          email={siteSettings.email}
          identityRoles={homepageSettings.identityRoles}
          ctaHeadline={homepageSettings.ctaHeadline}
          ctaButtonText={homepageSettings.ctaButtonText}
          ctaSecondaryText={homepageSettings.ctaSecondaryText}
          copyrightName={homepageSettings.copyrightName}
        />
      </ChapterWorld>
    </main>
  );
}
