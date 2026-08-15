import OpeningScene from "@/app/components/opening/OpeningScene";
import ChapterWorld from "@/app/components/ChapterWorld";
import ChapterRail from "@/app/components/ChapterRail";
import WritingChapter from "@/app/components/WritingChapter";
import DevelopmentChapter from "@/app/components/DevelopmentChapter";
import PoetryChapter from "@/app/components/PoetryChapter";
import PreacherChapter from "@/app/components/PreacherChapter";
import FinalChapter from "@/app/components/FinalChapter";

export default function Home() {
  return (
    <main id="top" className="flex flex-1 flex-col">
      <OpeningScene />
      <ChapterRail />
      <ChapterWorld>
        <WritingChapter />
        <DevelopmentChapter />
        <PoetryChapter />
        <PreacherChapter />
        <FinalChapter />
      </ChapterWorld>
    </main>
  );
}
