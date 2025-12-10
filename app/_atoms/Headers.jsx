export const Header1 = ({ children, className = "" }) => {
  return (
    <h1 className={`text-primary font-bold text-3xl ${className}`}>
      {children}
    </h1>
  );
};

export const Header2 = ({ children, className = "" }) => {
  return (
    <h2 className={`font-bold text-primary text-2xl ${className}`}>
      {children}
    </h2>
  );
};

export const Header3 = ({ children, className = "" }) => {
  return (
    <h3 className={`font-bold text-primary text-xl ${className}`}>
      {children}
    </h3>
  );
};
