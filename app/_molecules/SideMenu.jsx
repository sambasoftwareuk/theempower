export default function SideMenu({ title, sections, activeSection, onClick }) {
  return (
    <aside className="w-64 sticky top-10 h-fit border rounded-lg bg-white shadow hidden md:block">
      <button className="w-full text-center px-4 py-3 border-b bg-primary text-white font-bold cursor-default">
        {title}
      </button>

      {sections.map((section) => (
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
    </aside>
  );
}
