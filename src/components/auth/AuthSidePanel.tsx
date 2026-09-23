import React from 'react';
import Image from 'next/image';
import { login_side_img } from '@/assets';

/** Marketing panel shown alongside the auth forms on large screens. */
export const AuthSidePanel = () => (
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
        <li>Employee Management: View detailed profiles, track performance, and manage attendance.</li>
        <li>Performance Insights: Analyze team goals, progress, and achievements.</li>
        <li>Attendance &amp; Leaves: Track attendance patterns and manage leave requests effortlessly.</li>
      </ul>
    </div>
  </div>
);
