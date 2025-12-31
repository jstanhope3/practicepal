export default function Card({
  children,
  title,
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}
    >
      {title && (
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
