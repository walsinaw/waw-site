interface Filter {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}

export default function Filters({ filters, children }: { filters: Filter[]; children?: React.ReactNode }) {
  return (
    <div className="filters">
      <span className="filters__label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" />
        </svg>
        Filtros
      </span>
      {filters.map((filter) => (
        <select
          key={filter.label}
          className="filters__select"
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          aria-label={filter.label}
        >
          {filter.options.map(([value, label]) => (
            <option key={value} value={value}>
              {value === 'todos' ? `${filter.label}: ${label}` : label}
            </option>
          ))}
        </select>
      ))}
      {children}
    </div>
  );
}
