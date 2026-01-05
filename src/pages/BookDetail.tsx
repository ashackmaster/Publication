import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, BookOpen, Calendar, Hash, Layers, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { useBooks } from '@/hooks/use-api';

const BookDetail = () => {
  const { id } = useParams();
  const { data: books, isLoading } = useBooks();
  const addToCart = useStore((state) => state.addToCart);
  
  const book = books?.find((b) => b.id.toString() === id);
  const relatedBooks = books?.filter((b) => b.category === book?.category && b.id.toString() !== id).slice(0, 4) || [];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!book) {
    return (
      <div className="container mx-auto py-24 text-center min-h-screen flex items-center justify-center animate-fade-in">
        <div>
          <h1 className="heading-display text-4xl mb-6">Book Not Found</h1>
          <Link to="/shop" className="btn-editorial inline-flex">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({...book, id: book.id.toString(), image: book.coverImage});
    toast.success(`${book.title} added to cart`);
  };

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto">
        <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 transition-colors group animate-fade-in">
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm tracking-widest uppercase">Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative animate-fade-in">
            <div className="aspect-[3/4] overflow-hidden bg-card sticky top-24">
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              {!book.inStock && <div className="absolute top-6 left-6 px-4 py-2 bg-destructive text-destructive-foreground text-sm tracking-widest uppercase">Out of Stock</div>}
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-border/50 -z-10" />
          </div>

          <div className="flex flex-col justify-center animate-fade-in delay-100">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">{book.category}</p>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-4">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">by {book.author}</p>
            <div className="section-divider mb-8"></div>
            <p className="text-foreground/80 leading-relaxed text-lg mb-10">{book.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-center gap-3 p-4 bg-secondary/50">
                <Hash className="w-5 h-5 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground uppercase tracking-wider">ISBN</p><p className="font-medium">{book.isbn}</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/50">
                <Layers className="w-5 h-5 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Pages</p><p className="font-medium">{book.pages}</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/50">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Published</p><p className="font-medium">{book.publishedYear}</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/50">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p><p className={`font-medium ${book.inStock ? 'text-green-700' : 'text-destructive'}`}>{book.inStock ? 'In Stock' : 'Out of Stock'}</p></div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <span className="text-4xl font-heading">৳{book.price}</span>
              <button onClick={handleAddToCart} disabled={!book.inStock} className="btn-editorial flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed group">
                <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>{book.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className="mt-24 animate-fade-in">
            <h2 className="heading-display text-3xl mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <Link key={relatedBook.id} to={`/shop/${relatedBook.id}`} className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-card mb-4">
                    <img src={relatedBook.coverImage} alt={relatedBook.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="font-heading text-lg group-hover:text-muted-foreground transition-colors line-clamp-1">{relatedBook.title}</h3>
                  <p className="text-sm text-muted-foreground">{relatedBook.author}</p>
                  <p className="font-medium mt-1">৳{relatedBook.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
