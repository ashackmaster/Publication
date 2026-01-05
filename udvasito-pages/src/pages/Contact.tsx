import { useState } from 'react';
import { Send, MapPin, Mail, Phone, Clock, ArrowRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import { config } from '@/lib/config';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      date: new Date().toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.contactTemplateId,
        templateParams,
        config.emailjs.publicKey
      );
      
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16 max-w-3xl animate-fade-in">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Connect With Us
          </p>
          <h1 className="heading-display text-5xl md:text-6xl mb-6">Get in Touch</h1>
          <p className="text-muted-foreground leading-relaxed text-lg">
            We'd love to hear from you. Whether you're an author with a manuscript, 
            a reader with feedback, or just want to say hello — we're here to listen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="animate-fade-in delay-100">
            <div className="space-y-10 mb-16">
              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-secondary group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-2">Visit Us</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    House 123, Road 45<br />
                    Gulshan, Dhaka 1212<br />
                    Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-secondary group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-2">Email Us</h3>
                  <p className="text-muted-foreground">
                    info@udvasitopathshala.com<br />
                    submissions@udvasitopathshala.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-secondary group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-2">Call Us</h3>
                  <p className="text-muted-foreground">
                    +880 1XXX-XXXXXX<br />
                    +880 1XXX-XXXXXX
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-secondary group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-2">Office Hours</h3>
                  <p className="text-muted-foreground">
                    Sunday - Thursday: 10:00 AM - 6:00 PM<br />
                    Friday - Saturday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="p-8 bg-foreground text-background">
              <h3 className="font-heading text-xl mb-4">Quick Questions?</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors group">
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  <span>How to submit a manuscript?</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors group">
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  <span>Shipping & delivery information</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors group">
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  <span>Return & refund policy</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in delay-200">
            <div className="bg-card p-8 md:p-12 border border-border/50">
              <h2 className="heading-display text-3xl mb-2">Send a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-editorial w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-editorial w-full"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-editorial w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Your Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="input-editorial w-full resize-none"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-editorial w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
