import React from 'react';
import Image from 'next/image';
import { login_side_img } from '@/assets';

/**
 * Two-column shell for the auth screens. The marketing panel is hidden on small
 * viewports, and the right column constrains each form to the design's width.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center gap-8 bg-background p-4 lg:p-8">
      <div className="hidden h-[calc(100vh-4rem)] flex-1 lg:block">
        <div className="relative h-full w-full overflow-hidden rounded-20">
          <Image
            src={login_side_img}
            alt=""
            className="h-full w-full object-cover"
            width={800}
            height={1200}
            priority
          />

          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-white">
            <h2 className="mb-4 text-4xl font-bold xl:text-5xl">Welcome to WORKHIVE!</h2>
            <ul className="list-inside list-disc space-y-2 text-sm">
              <li>
                Employee Management: View detailed profiles, track performance, and manage attendance.
              </li>
              <li>Performance Insights: Analyze team goals, progress, and achievements.</li>
              <li>
                Attendance &amp; Leaves: Track attendance patterns and manage leave requests effortlessly.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="mx-auto flex w-full max-w-[385px] flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}
