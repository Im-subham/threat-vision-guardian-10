
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 feature-gradient -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Secure Your Digital Assets?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Don't wait until it's too late. Start scanning your files now and get comprehensive protection against even the most sophisticated threats.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-cyber-teal text-cyber-blue hover:bg-cyber-teal/90">
              <Link to="/scan">Start Scanning Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-cyber-teal text-cyber-teal hover:bg-cyber-teal/10">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/20 p-6 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-cyber-teal mb-2">99.7%</div>
              <p className="opacity-80">Detection Rate</p>
            </div>
            <div className="bg-black/20 p-6 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-cyber-teal mb-2">10K+</div>
              <p className="opacity-80">Daily Scans</p>
            </div>
            <div className="bg-black/20 p-6 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-cyber-teal mb-2">24/7</div>
              <p className="opacity-80">Protection</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
