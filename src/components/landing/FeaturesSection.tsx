
import React from 'react';
import { Shield, Database, Search, Bug, ShieldCheck, BarChart4 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Dual Engine Protection",
    description: "Leverage both VirusTotal's vast threat intelligence and our custom machine learning model for comprehensive protection."
  },
  {
    icon: <Database className="h-10 w-10 text-primary" />,
    title: "Extensive Threat Database",
    description: "Access data from over 70 antivirus engines and security vendors through the VirusTotal integration."
  },
  {
    icon: <Bug className="h-10 w-10 text-primary" />,
    title: "Advanced ML Detection",
    description: "Our proprietary machine learning models identify new and zero-day threats missed by traditional signature-based detection."
  },
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: "Deep File Analysis",
    description: "Detailed analysis of file behavior, structure, and potential malicious indicators."
  },
  {
    icon: <BarChart4 className="h-10 w-10 text-primary" />,
    title: "Comprehensive Dashboard",
    description: "Monitor scan history, threat statistics, and system security status all in one place."
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Real-time Protection",
    description: "Get instant alerts and detailed reports when potential threats are detected."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Security Features</h2>
          <p className="text-lg text-muted-foreground">
            ThreatGuardian combines industry-leading threat intelligence with artificial intelligence
            to provide unparalleled malware detection and analysis capabilities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="mb-4 p-3 rounded-lg inline-block bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
