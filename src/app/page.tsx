
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

function page() {
  return (
    <>
      <main className="min-h-screen px-0 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-[1280px] mx-auto">

        </div>
      </main>
    </>
  )
}

export default page