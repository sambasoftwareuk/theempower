export function BaseButton({ children, className = "", ...props }) {
  return (
    <button
      className={`py-2 px-4 rounded focus:outline-none transition-all ${className} flex justify-center items-center`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ label, className="", icon, ...props}) {
  return (
    <BaseButton
      className={`text-white bg-primary900 border border-primary900 hover:bg-primary  ${className}`}
      {...props}
    >
      {icon && <span className={label ? "mr-2" : ""}>{icon}</span>}
      {label}
    </BaseButton>
  );
}

export function OutlinedButton({ label, icon, className = "", ...props }) {
  return (
    <BaseButton
      className={`bg-transparent  border border-primary900 hover:bg-primary50 ${className}`}
      {...props}
    >
      {icon && <span className={label ? "mr-2" : ""}>{icon}</span>}
      {label}
    </BaseButton>
  );
}

export function IconOnlyButton({ icon, className = "", ...props }) {
  return (
    <BaseButton
      className={`bg-transparent text-secondary400 border-none p-2 hover:bg-primary50 hover:text-primary900 ${className}`}
      {...props}
    >
      {icon}
    </BaseButton>
  );
}

export function OutlinedButtonWithIcon({ icon, className, ...props }) {
  return (
    <BaseButton
      className={`bg-transparent text-secondary400 border p-2  border-primary900 hover:bg-primary50 ${className}`}
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

export function TabButton({ label, className = "", icon, ...props }) {
  return (
    <BaseButton
      className={`text-gray-600 ${className}`}
      {...props}
    >
      {icon && <span className={label ? "mr-2" : ""}>{icon}</span>}
      {label}
    </BaseButton>
  );
}

