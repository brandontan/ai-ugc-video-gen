import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">AI UGC Video Platform</h1>
        <div className="flex flex-col gap-4 w-full max-w-md">
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold">Product Image Upload</h2>
            <input type="file" accept="image/*" className="mt-2" />
          </div>
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold">Custom Avatar Upload</h2>
            <input type="file" accept="image/*" className="mt-2" />
          </div>
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold">Video Prompt</h2>
            <textarea className="w-full mt-2 p-2 border rounded" placeholder="Enter your video prompt here..."></textarea>
          </div>
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold">Audio Upload</h2>
            <input type="file" accept="audio/*" className="mt-2" />
          </div>
          <div className="flex gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Generate Preview (5s)</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">Generate Final Video (10-20s)</button>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
