'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUSES = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'ESCALATED'];
const CATEGORIES = ['INFRASTRUCTURE', 'ACADEMIC', 'ADMINISTRATIVE', 'HOSTEL', 'LIBRARY', 'CANTEEN', 'OTHER'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export default function AdvancedSearch({ onSearchChange }) {
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    category: [],
    priority: [],
    dateFrom: '',
    dateTo: '',
    sort: 'createdAt',
    order: 'desc',
  });

  // Debounce callback
  const debouncedChange = useCallback(
    debounce((s, f) => onSearchChange({ search: s, ...f }), 300),
    []
  );

  useEffect(() => {
    debouncedChange(search, filters);
  }, [search, filters]);

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearAll = () => {
    setSearch('');
    setFilters({ status: [], category: [], priority: [], dateFrom: '', dateTo: '', sort: 'createdAt', order: 'desc' });
  };

  const activeChips = [
    ...filters.status.map((v) => ({ label: `Status: ${v}`, remove: () => toggleFilter('status', v) })),
    ...filters.category.map((v) => ({ label: `Category: ${v}`, remove: () => toggleFilter('category', v) })),
    ...filters.priority.map((v) => ({ label: `Priority: ${v}`, remove: () => toggleFilter('priority', v) })),
    ...(filters.dateFrom ? [{ label: `From: ${filters.dateFrom}`, remove: () => setFilters((p) => ({ ...p, dateFrom: '' })) }] : []),
    ...(filters.dateTo ? [{ label: `To: ${filters.dateTo}`, remove: () => setFilters((p) => ({ ...p, dateTo: '' })) }] : []),
  ];

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or ticket ID..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          Filters
          {filtersOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>

        {/* Sort */}
        <select
          value={`${filters.sort}-${filters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-');
            setFilters((p) => ({ ...p, sort, order }));
          }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="priority-desc">Priority (High → Low)</option>
          <option value="priority-asc">Priority (Low → High)</option>
        </select>
      </div>

      {/* Collapsible Filters */}
      {filtersOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Status</p>
              <div className="space-y-1">
                {STATUSES.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={filters.status.includes(s)} onChange={() => toggleFilter('status', s)} className="rounded" />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Category</p>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={filters.category.includes(c)} onChange={() => toggleFilter('category', c)} className="rounded" />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Priority + Dates */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Priority</p>
                <div className="space-y-1">
                  {PRIORITIES.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={filters.priority.includes(p)} onChange={() => toggleFilter('priority', p)} className="rounded" />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Date Range</p>
                <input type="date" value={filters.dateFrom} onChange={(e) => setFilters((p) => ({ ...p, dateFrom: e.target.value }))} className="w-full border border-slate-200 rounded px-2 py-1 text-sm mb-1" />
                <input type="date" value={filters.dateTo} onChange={(e) => setFilters((p) => ({ ...p, dateTo: e.target.value }))} className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
              </div>
            </div>
          </div>

          <button onClick={clearAll} className="text-xs text-red-600 hover:text-red-700 font-medium">
            Clear all filters
          </button>
        </div>
      )}

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip, i) => (
            <FilterChip key={i} label={chip.label} onRemove={chip.remove} />
          ))}
        </div>
      )}
    </div>
  );
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
