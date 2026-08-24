// components/LayoutWrapper.js
"use client";

import Navbar from "@/components/nav";
import FeedbackForm from "@/components/Feedback";
import Footer from "@/components/Footer";
import { SiteImagesProvider } from "@/components/SiteImagesProvider";
import { SurveyProvider } from "@/components/SurveyProvider";
import { SkeletonTheme } from "react-loading-skeleton";
import { usePathname } from 'next/navigation';

// Shared shimmer palette so every <Skeleton /> in the app matches the brand
// without needing baseColor/highlightColor passed in at every call site.
const SKELETON_BASE_COLOR = "#EBE3D5";
const SKELETON_HIGHLIGHT_COLOR = "#F8F3E9";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  // If we are in the admin section, render ONLY children.
  // The AdminLayoutWrapper will handle the Sidebar and its own <main> tag.
  if (isAdminPage) {
    return (
      <SkeletonTheme baseColor={SKELETON_BASE_COLOR} highlightColor={SKELETON_HIGHLIGHT_COLOR}>
        {children}
      </SkeletonTheme>
    );
  }

  // Otherwise, render the standard public site layout
  return (
    <SkeletonTheme baseColor={SKELETON_BASE_COLOR} highlightColor={SKELETON_HIGHLIGHT_COLOR}>
      <SiteImagesProvider>
        <SurveyProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
          <FeedbackForm />
        </SurveyProvider>
      </SiteImagesProvider>
    </SkeletonTheme>
  );
}