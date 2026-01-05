import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Book, useStore } from '@/lib/store';
import { toast } from 'sonner';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(book);
    toast.success(`${book.title} added to cart`);
  };

  return (
    <div className="card-book group">
      <Link to={`/shop/${book.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden relative">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500" />
          {!book.inStock && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-destructive text-destructive-foreground text-xs tracking-widest uppercase">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
          {book.category}
        </p>
        <Link to={`/shop/${book.id}`}>
          <h3 className="font-heading text-xl mb-2 hover:text-muted-foreground transition-colors line-clamp-2">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4">{book.author}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading text-xl">৳{book.price}</span>
          <button
            onClick={handleAddToCart}
            disabled={!book.inStock}
            className="flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-3 border border-foreground/30 
                       hover:bg-foreground hover:text-background transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground
                       group/btn"
          >
            <ShoppingCart className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
            <span className="hidden sm:inline">{book.inStock ? 'Add' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
