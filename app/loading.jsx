export default function Loading() {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div
          className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-primary900 animate-spin"
          aria-hidden="true"
        />
        <p>Loading...</p>
      </div>
    );
  }