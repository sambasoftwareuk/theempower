const buttonBase = 'py-2 px-4 rounded focus:outline-none transition-all';

const buttonVariants = {
  primary: 'bg-primary900 text-white border border-primary900 hover:bg-primary active:bg-primary500 disabled:bg-primary300',
  outlined: 'bg-transparent text-primary900 border border-primary900 hover:bg-primary50 active:bg-primary300 disabled:text-primary300',
  text: 'bg-transparent text-primary900 border-none hover:bg-primary50 active:bg-primary300 disabled:text-primary300',
  iconOnly: 'bg-transparent text-primary900 border-none p-2 hover:bg-primary50 active:bg-primary300',
  iconOnlyBorder: 'bg-transparent text-primary900 border border-primary900 p-2 hover:bg-primary50 active:bg-primary300',
  courseTagActive: 'flex flex-col justify-center px-6 py-3 rounded-full mr-4 transition-all duration-200 whitespace-nowrap text-xs font-medium bg-secondary text-white hover:bg-secondary400',
  courseTagInactive: 'flex flex-col justify-center px-6 py-3 rounded-full mr-4 transition-all duration-200 whitespace-nowrap text-xs font-medium bg-secondary100 text-black hover:bg-secondary200',
  direction:"w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-secondary100 text-secondary"
};

export default function Button({
  label,
  type = 'button',
  onClick,
  variant = 'primary',
  icon,
  disabled = false,
  className = ''
}) {
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;
  const classes = `${buttonBase} ${variantClasses} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={label ? 'mr-2' : ''}>{icon}</span>}
      {label}
    </button>
  );
}
