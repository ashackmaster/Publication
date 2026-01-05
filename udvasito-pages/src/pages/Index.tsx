import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import heroBooks from '@/assets/hero-books.jpg';
import readingPerson from '@/assets/reading-person.jpg';
import openBook from '@/assets/open-book.jpg';
import { BookCard } from '@/components/BookCard';
import { useBooks } from '@/hooks/use-api';

const Index = () => {
  const { data: books, isLoading } = useBooks();
  const featuredBooks = books?.filter(b => b.featured).slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <section className="min-h-[85vh] flex items-center py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20 pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl animate-slide-up">Udvasito</h1>
            <h1 className="heading-italic text-5xl md:text-7xl lg:text-8xl animate-slide-up delay-100">Pathshala</h1>
            <div className="section-divider mb-6 animate-fade-in delay-200"></div>
            <p className="heading-italic text-lg md:text-xl leading-relaxed text-foreground/70 max-w-xl animate-fade-in delay-300">
              Curating stories that shape the literary landscape of Bengal.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in delay-400">
              <Link to="/shop" className="btn-editorial group">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/portfolio" className="btn-editorial bg-foreground text-background hover:bg-transparent hover:text-foreground">
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {[
              { value: '150+', label: 'Books' },
              { value: '50+', label: 'Authors' },
              { value: '10K+', label: 'Readers' },
              { value: '15+', label: 'Awards' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-2xl md:text-3xl mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="overflow-hidden group">
                <img src={heroBooks} alt="Books" className="w-full aspect-[4/3] object-cover grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
              </div>
              <div className="bg-foreground text-background p-6 md:p-8">
                <p className="heading-italic text-lg md:text-xl">"Every book is a journey."</p>
              </div>
            </div>
            <div className="space-y-6 md:mt-12">
              <div className="overflow-hidden group">
                <img src={readingPerson} alt="Reading" className="w-full aspect-[4/3] object-cover grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 md:p-8 border border-border">
                <h3 className="font-heading text-lg mb-2">Our Philosophy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Excellence in every publication.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl mb-2">The Soul of</h2>
              <h2 className="font-heading text-3xl md:text-4xl italic mb-6">Publishing</h2>
              <div className="w-16 h-px bg-background/30 mb-6"></div>
              <p className="text-background/70 leading-relaxed mb-6">
                Founded in 2024, we bring literary excellence to Bangladesh through meticulous attention to detail.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-background hover:text-background/70 transition-colors group text-sm tracking-widest uppercase">
                <span>Work With Us</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="relative">
              <img src={openBook} alt="Open book" className="w-full rounded" />
            </div>
          </div>
        </div>
      </section>

      {featuredBooks.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="heading-display text-3xl md:text-4xl mb-3">Featured</h2>
              <p className="text-sm text-muted-foreground">Our latest publications</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={{...book, id: book.id.toString(), image: book.coverImage}} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/shop" className="btn-editorial group">
                <span>View All</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto text-center">
          <h2 className="heading-italic text-2xl md:text-3xl mb-6">Stories worth keeping</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="btn-editorial group">
              <span>Browse</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="btn-editorial bg-foreground text-background hover:bg-transparent hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
