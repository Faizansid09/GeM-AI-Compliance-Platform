import { MOCK_BIDDERS } from '../api/mockData';

interface BidderSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

/**
 * Tender/bidder selector. In production this list is fetched from the backend;
 * here it uses the seeded mock bidders. Each seeded bidder also has a complete
 * offline compliance record for development when the backend is unavailable.
 */
export function BidderSelector({ selectedId, onSelect }: BidderSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOCK_BIDDERS.map((bidder) => {
        const active = bidder.id === selectedId;
        return (
          <button
            key={bidder.id}
            type="button"
            onClick={() => onSelect(bidder.id)}
            className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
              active
                ? 'border-brand bg-brand/5 text-brand'
                : 'border-slate-300 bg-white text-slate-600 hover:border-brand/50 hover:text-brand'
            }`}
          >
            {bidder.display}
          </button>
        );
      })}
    </div>
  );
}
