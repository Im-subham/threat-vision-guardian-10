
import React from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ComparisonSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Compare Detection Methods</h2>
          <p className="text-lg text-muted-foreground">
            Understand the strengths of each detection method and why ThreatGuardian's dual-engine approach provides superior protection.
          </p>
        </div>
        
        <Tabs defaultValue="virustotal" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="virustotal">VirusTotal API</TabsTrigger>
            <TabsTrigger value="ml">Machine Learning Model</TabsTrigger>
          </TabsList>
          
          <TabsContent value="virustotal">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Strengths</h3>
                      <ul className="space-y-3">
                        {[
                          "Combines results from 70+ antivirus engines",
                          "Extensive database of known threats",
                          "Community-driven threat intelligence",
                          "Detailed file reputation data",
                          "Broad coverage of known malware families"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 text-threat-safe mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Limitations</h3>
                      <ul className="space-y-3">
                        {[
                          "May miss zero-day threats",
                          "Depends on external API availability",
                          "Limited to signature-based detection",
                          "Rate limits on API calls",
                          "Cannot detect novel attack patterns"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start">
                            <X className="h-5 w-5 text-threat-high mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg mt-6">
                    <h4 className="font-medium mb-2">Best For:</h4>
                    <p>Scanning known file types and verifying the safety of downloads against an extensive database of known threats.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ml">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Strengths</h3>
                      <ul className="space-y-3">
                        {[
                          "Detects previously unseen threats",
                          "Pattern recognition for novel attacks",
                          "No dependency on external services",
                          "Faster scanning for large files",
                          "Behavioral analysis capabilities"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 text-threat-safe mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Limitations</h3>
                      <ul className="space-y-3">
                        {[
                          "May produce false positives",
                          "Limited to training data exposure",
                          "Resource-intensive processing",
                          "Requires regular model updates",
                          "Less community validation"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start">
                            <X className="h-5 w-5 text-threat-high mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg mt-6">
                    <h4 className="font-medium mb-2">Best For:</h4>
                    <p>Detecting new and evolving threats based on behavioral patterns and code similarities to known malware.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ComparisonSection;
