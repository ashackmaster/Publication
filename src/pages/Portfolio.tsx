import { usePortfolio } from '@/hooks/use-api';
import { Award, Calendar, User, Loader2 } from 'lucide-react';

const Portfolio = () => {
  const { data: portfolio, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto">
        <div className="mb-20 max-w-3xl animate-fade-in">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Our Work</p>
          <h1 className="heading-display text-5xl md:text-6xl mb-6">Publication Portfolio</h1>
          <p className="text-muted-foreground leading-relaxed text-lg">
            A showcase of our published works. Each title represents our unwavering commitment to literary excellence.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-20 animate-fade-in delay-100">
          <div className="text-center p-6 bg-card">
            <Award className="w-6 h-6 mx-auto mb-3 text-muted-foreground" />
            <p className="font-heading text-2xl mb-1">15+</p>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">Awards</p>
          </div>
          <div className="text-center p-6 bg-card">
            <Calendar className="w-6 h-6 mx-auto mb-3 text-muted-foreground" />
            <p className="font-heading text-2xl mb-1">2024</p>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">Founded</p>
          </div>
          <div className="text-center p-6 bg-card">
            <User className="w-6 h-6 mx-auto mb-3 text-muted-foreground" />
            <p className="font-heading text-2xl mb-1">50+</p>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">Authors</p>
          </div>
        </div>

        <div className="space-y-32">
          {portfolio?.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="overflow-hidden group">
                  <img src={item.image} alt={item.title} className="w-full aspect-[3/4] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                </div>
                <div className={`absolute -bottom-6 ${index % 2 === 1 ? '-left-6' : '-right-6'} w-2/3 h-full border border-border/50 -z-10`} />
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {item.year}
                </p>
                <h2 className="heading-display text-4xl md:text-5xl mb-4">{item.title}</h2>
                <p className="text-lg text-muted-foreground mb-6 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  by {item.author}
                </p>
                <div className="section-divider mb-8"></div>
                <p className="text-foreground/80 leading-relaxed text-lg mb-8">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {!portfolio?.length && (
          <div className="text-center py-20 animate-fade-in">
            <p className="heading-italic text-2xl text-muted-foreground">Portfolio coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
