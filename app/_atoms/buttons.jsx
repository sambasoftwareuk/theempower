export function BaseButton({ children, className = "", ...props }) {
  return (
    <button
      className={`py-2 px-4 rounded focus:outline-none transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ label, icon, ...props }) {
  return (
    <BaseButton
      className="text-white bg-primary900 border border-primary900 hover:bg-primary "
      {...props}
    >
      {icon && <span className={label ? "mr-2" : ""}>{icon}</span>}
      {label}
    </BaseButton>
  );
}

export function OutlinedButton({ label, icon, ...props }) {
  return (
    <BaseButton
      className="bg-transparent text-primary900 border border-primary900 hover:bg-primary50"
      {...props}
    >
      {icon && <span className={label ? "mr-2" : ""}>{icon}</span>}
      {label}
    </BaseButton>
  );
}

export function IconOnlyButton({ icon, ...props }) {
  return (
    <BaseButton
      className="bg-transparent text-secondary400 border-none p-2 hover:bg-primary50 hover:text-primary900"
      {...props}
    >
      {icon}
    </BaseButton>
  );
}

export function IconOnlyBorderButton({ icon, ...props }) {
  return (
    <BaseButton
      className="bg-transparent text-secondary400 border border-primary900 p-2 hover:bg-primary50"
      {...props}
    >
      {icon}
    </BaseButton>
  );
}

export function CourseTagButton({ active, label, ...props }) {
  const baseClasses = `flex flex-col justify-center px-6 py-3 rounded-full mr-4 whitespace-nowrap text-xs font-medium transition-all duration-200`;
  const activeClasses = `bg-secondary text-white hover:bg-secondary400`;
  const inactiveClasses = `bg-secondary100 text-black hover:bg-secondary200`;

  return (
    <button
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      {...props}
    >
      {label}
    </button>
  );
}

export function DirectionButton({ icon, ...props }) {
  return (
    <button
      className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-secondary100 text-secondary"
      {...props}
    >
      {icon}
    </button>
  );
}
