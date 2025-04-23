
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyber-teal/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
              <ShieldCheck size={16} />
              <span className="text-sm font-medium">Next Generation Malware Protection</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Advanced Threat Detection with <span className="text-primary">AI Precision</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Protect your digital assets with our dual-engine malware detection platform. 
              Leverage the power of VirusTotal's extensive database and our proprietary machine learning models.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="px-8 py-6">
                <Link to="/scan">Start Scanning</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex -space-x-2 mr-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-800">{i}</span>
                  </div>
                ))}
              </div>
              <span>Trusted by 10,000+ security professionals</span>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative w-full h-96 rounded-xl cyber-border cyber-glow overflow-hidden bg-cyber-highlight">
              <div className="scan-line animate-scan"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-24 h-24 text-cyber-teal opacity-50" />
              </div>
              <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-cyber-dark to-transparent">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-cyber-teal mb-1">System Status</div>
                    <div className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-threat-safe rounded-full animate-pulse"></span>
                      Protected
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-cyber-teal mb-1">Threats Detected</div>
                    <div className="text-xl font-bold text-white">0</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-lg shadow-lg border w-48">
              <div className="text-sm font-medium mb-2">Last scan completed</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">2 mins ago</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-threat-safe/20 text-threat-safe">
                  Clean
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
