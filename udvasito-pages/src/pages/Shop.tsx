import { useState } from 'react';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { useBooks } from '@/hooks/use-api';

const Shop = () => {
  const { data: books, isLoading } = useBooks();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'title'>('default');
  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const categories = ['All', ...new Set(books?.map((book) => book.category) || [])];

  let filteredBooks = selectedCategory === 'All'
    ? books || []
    : books?.filter((book) => book.category === selectedCategory) || [];

  if (searchQuery) {
    filteredBooks = filteredBooks.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortBy === 'price-low') {
    filteredBooks = [...filteredBooks].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredBooks = [...filteredBooks].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'title') {
    filteredBooks = [...filteredBooks].sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto">
        <div className="mb-12 animate-fade-in">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Our Collection</p>
          <h1 className="heading-display text-5xl md:text-6xl mb-6">Browse Books</h1>
          <p className="text-muted-foreground max-w-lg">
            Explore our carefully curated collection of literary works that inspire and enlighten.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10 animate-fade-in delay-100">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-border/50 focus:border-foreground outline-none transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-6 py-4 bg-card border border-border/50 focus:border-foreground outline-none cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="title">Title: A to Z</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3 mb-12 animate-fade-in delay-200">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm tracking-widest uppercase px-5 py-3 border transition-all duration-300 hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-foreground border-foreground/30 hover:border-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book, index) => (
            <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <BookCard book={{...book, id: book.id.toString(), image: book.coverImage}} />
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <p className="heading-italic text-2xl text-muted-foreground mb-4">No books found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
