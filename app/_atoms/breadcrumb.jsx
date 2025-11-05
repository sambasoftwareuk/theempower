import Link from "next/link";
import { HomeIcon } from "./Icons";
import { ChevronRight } from "./Icons";

export const Breadcrumb = ({ items = [], className = "" }) => {
  return (
    <nav className={`flex items-center justify-center py-4 px-6 ${className}`}>
      <ol className="flex items-center space-x-2 text-sm">
        {/* Home Link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-secondary400 hover:text-primary900 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </Link>
        </li>

        {/* Dynamic Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-secondary400 mx-1" />
              {isLast ? (
                <span className="text-secondary font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-secondary400 hover:text-primary900 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
