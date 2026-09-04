import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-lg">
      <p className="text-text-secondary text-small">
        Pagina {currentPage} de {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-white/15 text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let page: number
          if (totalPages <= 5) {
            page = i + 1
          } else if (currentPage <= 3) {
            page = i + 1
          } else if (currentPage >= totalPages - 2) {
            page = totalPages - 4 + i
          } else {
            page = currentPage - 2 + i
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'bg-gradient-to-r from-green-400 to-emerald-700 text-white shadow shadow-green-500/25'
                  : 'text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              {page}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-white/15 text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
