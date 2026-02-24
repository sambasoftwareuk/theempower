"use client";

import { BaseButton} from "./_atoms/buttons";
import Link from "next/link";
import { Header2 } from "./_atoms/Headers";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <Header2 className="text-xl font-bold text-gray-900">Something went wrong</Header2>
      <p className="text-gray-600 text-center max-w-md">{error?.message}</p>
      <div className="flex flex-wrap gap-4 justify-center">

      <BaseButton onClick={reset} className="bg-primary900 text-white hover:bg-white hover:text-primary900 hover:border-2">Try again</BaseButton>
      <Link href="/" className="inline-block py-2 px-4 rounded border-2 border-primary900 text-primary900 hover:bg-primary900 hover:text-white transition-colors">Go to home</Link>
      </div>
    </div>
  );
}