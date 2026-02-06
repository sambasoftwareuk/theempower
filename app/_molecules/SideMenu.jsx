import Link from "next/link";

export default function SideMenu({
  title,
  sections,
  activeSection,
  onClick,
  items,
  currentSlug,
}) {
  return (
    <aside className="w-64 sticky top-10 h-fit border rounded-lg bg-white shadow hidden md:block">
      <button className="w-full text-center px-4 py-3 border-b bg-primary text-white font-bold cursor-default">
        {title}
      </button>

      {sections &&
        sections.map((section) => (
          <button
            key={section.id}
            className={`w-full text-left px-4 py-3 border-b ${
              activeSection === section.id
                ? "bg-primary500 text-white font-bold"
                : "bg-white"
            }`}
            onClick={() => onClick(section.id)}
          >
            {section.title}
          </button>
        ))}
      {items &&
        items
          .filter((item) => item.slug && item.label)
          .map((item) => {
            const isActive = item.slug === currentSlug;

            return (
              <Link
                key={item.slug}
                href={`${item.slug}`}
                className={`block w-full text-left px-4 py-3 border-b transition-all duration-200 ${
                  isActive
                    ? "bg-primary500 text-white font-bold"
                    : "bg-white hover:bg-primary500 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
    </aside>
  );
}
