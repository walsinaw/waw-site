interface ChipPickerProps {
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

export default function ChipPicker({ options, selected, onChange }: ChipPickerProps) {
  const extras = selected.filter((value) => !options.some((option) => same(option, value)));

  const toggle = (value: string) =>
    onChange(
      selected.some((s) => same(s, value)) ? selected.filter((s) => !same(s, value)) : [...selected, value],
    );

  return (
    <div className="chips">
      {[...options, ...extras].map((option) => {
        const active = selected.some((s) => same(s, option));
        return (
          <button
            key={option}
            type="button"
            className={`chip${active ? ' chip--active' : ''}`}
            aria-pressed={active}
            onClick={() => toggle(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
