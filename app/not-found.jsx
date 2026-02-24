import Link from "next/link"
import { Header2 } from "./_atoms/Headers"

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 bg-gray-50">
    <Header2 className="text-xl font-bold text-gray-900">Page not found</Header2>
    <p className="text-gray-600 text-center max-w-md">The page you are looking for does not exist.</p>
    <Link href="/" className="inline-block py-2 px-4 rounded border-2 border-primary900 text-primary900 hover:bg-primary900 hover:text-white transition-colors">Go to home</Link>
    </div>
  )
}

export default NotFound