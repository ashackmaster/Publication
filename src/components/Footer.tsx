import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { config } from '@/lib/config';
import { useState } from 'react';
import { toast } from 'sonner';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await emailjs.send(config.emailjs.serviceId, config.emailjs.templateId, { email }, config.emailjs.publicKey);
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      toast.error('Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="border-b border-background/10">
        <div className="container mx-auto py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-2xl mb-2">Stay Connected</h3>
              <p className="text-background/70">Subscribe for updates on new releases and events.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-background/50 transition-colors"
              />
              <button disabled={loading} className="px-6 py-3 bg-background text-foreground hover:bg-background/90 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-7 h-7" />
              <div>
                <span className="font-heading text-xl block leading-tight">Udvasito Pathshala</span>
                <span className="text-xs tracking-[0.2em] uppercase text-background/50">Publication</span>
              </div>
            </div>
            <p className="text-background/70 leading-relaxed mb-6">
              Where tradition meets the avant-garde. Curating stories that shape the intellectual landscape of Bengal.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-background/70 hover:text-background transition-colors">Home</Link>
              <Link to="/shop" className="text-background/70 hover:text-background transition-colors">Shop</Link>
              <Link to="/portfolio" className="text-background/70 hover:text-background transition-colors">Portfolio</Link>
              <Link to="/contact" className="text-background/70 hover:text-background transition-colors">Contact</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-6">Services</h4>
            <nav className="flex flex-col gap-3">
              <span className="text-background/70">Book Publishing</span>
              <span className="text-background/70">Manuscript Editing</span>
              <span className="text-background/70">Cover Design</span>
              <span className="text-background/70">Distribution</span>
            </nav>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-6">Contact Us</h4>
            <address className="not-italic space-y-4">
              <div className="flex items-start gap-3 text-background/70"><MapPin className="w-5 h-5 shrink-0" /><span>House 123, Road 45, Gulshan, Dhaka</span></div>
              <div className="flex items-center gap-3 text-background/70"><Mail className="w-5 h-5" /><span>info@udvasitopathshala.com</span></div>
              <div className="flex items-center gap-3 text-background/70"><Phone className="w-5 h-5" /><span>+880 1XXX-XXXXXX</span></div>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
};
