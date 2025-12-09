'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      '100 messages/month',
      '2-3 Basic Agents',
      'Local knowledge base',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    popular: true,
    features: [
      'Unlimited messages',
      '10 Specialized Agents',
      'Team collaboration',
      'Priority support',
      'Advanced analytics',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Self-hosted option',
      'Custom agents',
      'Dedicated support',
      'API access',
      'SLA guarantee',
    ],
  },
];

export default function PricePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`p-8 relative ${plan.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-1">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg text-gray-500">/mo</span>}
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" size="lg">← Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
