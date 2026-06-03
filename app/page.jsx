import HeroSection from '@/sections/home/hero';
import StorySection from '@/sections/home/story';
import PageDivider from '@/components/PageDivider';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PageDivider />
      <StorySection />
    </main>
  );
}