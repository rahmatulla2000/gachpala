'use client';

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      defaultValue={defaultValue}
      className="input-field text-sm py-2.5 w-auto"
      onChange={(e) => {
        const params = new URLSearchParams(window.location.search);
        params.set('sort', e.target.value);
        params.delete('page');
        window.location.href = `/trees?${params.toString()}`;
      }}
    >
      <option value="date_desc">Newest First</option>
      <option value="date_asc">Oldest First</option>
      <option value="name_asc">Name A-Z</option>
      <option value="name_desc">Name Z-A</option>
      <option value="scientific">Scientific Name</option>
    </select>
  );
}
