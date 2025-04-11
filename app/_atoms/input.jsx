const VARIANTS = {
  basic:
    "w-1/4 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
  iconEnd: "flex items-center border rounded-md pr-2",
  iconStart: "flex items-center border rounded-md pl-2",
};

const Input = ({
  variant = "basic",
  icon: Icon,
  onIconClick,
  classname = "",
  ...props
}) => {
  const inputClassName =
    variant === "basic"
      ? VARIANTS.basic
      : "flex-1 border-none px-3py-2text-sm focus:outline-none";
  return (
    <div className="{`${VARIANT[variant]} ${className}`}">
      {variant === "iconStart" && Icon && (
        <Icon size={18} className="text-gray-500 mx-2" />
      )}
      <input className={inputClassName} {...props} />

      {variant === "IconEnd" && Icon && (
        <button
          type="button"
          onClick={onIconClick}
          className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition"
        >
          <Icon size={18} className="text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default Input;
