import OpeningScene from "./components/OpeningScene";
import WritingChapter from "./components/WritingChapter";
import DevelopmentChapter from "./components/DevelopmentChapter";
import PoetryChapter from "./components/PoetryChapter";
import PreacherChapter from "./components/PreacherChapter";
import FinalChapter from "./components/FinalChapter";

export default function Home() {
  return (
    <main id="top" className="flex flex-1 flex-col">
      <OpeningScene />
      <WritingChapter />
      <DevelopmentChapter />
      <PoetryChapter />
      <PreacherChapter />
      <FinalChapter />
    </main>
  );
}
