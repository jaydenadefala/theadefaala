import OpeningScene from "./components/opening/OpeningScene";
import ChapterWorld from "./components/ChapterWorld";
import ChapterRail from "./components/ChapterRail";
import WritingChapter from "./components/WritingChapter";
import DevelopmentChapter from "./components/DevelopmentChapter";
import PoetryChapter from "./components/PoetryChapter";
import PreacherChapter from "./components/PreacherChapter";
import FinalChapter from "./components/FinalChapter";

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
