/* eslint-disable */

"use client";
import React, { useState } from 'react';
import Link from 'next/link';


const PlansPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'FREE',
      price: billingPeriod === 'monthly' ? 0 : 0,
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      popular: false,
      description: 'Perfect for individuals getting started',
      features: [
        { name: '1 User Account', included: true },
        { name: '10 Team Members', included: true },
        { name: 'Unlimited Emails Accounts', included: true },
        { name: 'Set And Manage Permissions', included: true },
        { name: 'API & extension support', included: false },
        { name: 'Developer support', included: false },
        { name: 'A/B Testing', included: false },
        { name: 'A/B Testing', included: false },
      ],
      buttonText: 'Get Started',
      buttonStyle: 'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md',
    },
    {
      name: 'PRO',
      price: billingPeriod === 'monthly' ? 49 : 490,
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      popular: true,
      description: 'Best for growing teams and businesses',
      features: [
        { name: '50 User Account', included: true },
        { name: '500 Team Members', included: true },
        { name: 'Unlimited Emails Accounts', included: true },
        { name: 'Set And Manage Permissions', included: true },
        { name: 'API & extension support', included: true },
        { name: 'Developer support', included: true },
        { name: 'A/B Testing', included: false },
      ],
      buttonText: 'Start Free Trial',
      buttonStyle: 'bg-gradient-to-r from-sky-400 to-sky-500 text-white hover:from-sky-500 hover:to-sky-600 shadow-lg hover:shadow-xl',
    },
    {
      name: 'ULTRA',
      price: billingPeriod === 'monthly' ? 99 : 990,
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      popular: false,
      description: 'Advanced features for large enterprises',
      features: [
        { name: 'Unlimited User Account', included: true },
        { name: 'Unlimited Team Members', included: true },
        { name: 'Unlimited Emails Accounts', included: true },
        { name: 'Set And Manage Permissions', included: true },
        { name: 'API & extension support', included: true },
        { name: 'Developer support', included: true },
        { name: 'A/B Testing', included: true },
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md',
    },
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-900 bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase">
              Pricing Plans
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-l text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Select the perfect plan that scales with your business needs. 
            All plans include our core features with premium support.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-16">
            <div className="relative bg-white p-1.5 rounded-2xl shadow-lg border border-slate-200">
              <div
                className={`absolute top-1.5 bottom-1.5 bg-slate-900 rounded-xl transition-all duration-300 ease-out ${
                  billingPeriod === 'monthly' ? 'left-1.5 right-1/2' : 'left-1/2 right-1.5'
                }`}
              />
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`relative z-10 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  billingPeriod === 'monthly'
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`relative z-10 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  billingPeriod === 'yearly'
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yearly
              </button>
            </div>
            {billingPeriod === 'yearly' && (
              <div className="ml-6 bg-gradient-to-r from-sky-400 to-sky-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg animate-pulse">
                🎉 Save 20%
              </div>
            )}
          </div>
        </div>

        {/* Plans Section */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full">
            <style jsx>{`
              @media (max-width: 1024px) {
                .plans-container {
                  display: flex;
                  overflow-x: auto;
                  gap: 2rem;
                  padding-bottom: 1.5rem;
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                .plans-container::-webkit-scrollbar {
                  display: none;
                }
                .plan-card {
                  min-width: 320px;
                  flex-shrink: 0;
                }
              }
            `}</style>
            
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`plan-card relative rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer group ${
                  plan.popular
                    ? 'bg-gradient-to-b from-gray-900 via-gray-500 to-gray-800 text-white shadow-2xl transform scale-105 ring-4 ring-gray-300'
                    : 'bg-white hover:bg-slate-50 shadow-xl hover:shadow-2xl border border-slate-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-xl border-4 border-white">
                      ⭐ MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="p-8 lg:p-10">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-6 ${plan.popular ? 'text-gray-100' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className={`text-lg font-semibold ${plan.popular ? 'text-gray-100' : 'text-slate-500'}`}>$</span>
                      <span className={`text-6xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                        {plan.price}
                      </span>
                      <span className={`text-lg ml-1 ${plan.popular ? 'text-gray-100' : 'text-slate-500'}`}>
                        {plan.period}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && plan.price > 0 && (
                      <p className={`text-sm ${plan.popular ? 'text-gray-200' : 'text-slate-400'}`}>
                        ${Math.round(plan.price / 12)}/month billed annually
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-10">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 mr-4 transition-all duration-300 ${
                          feature.included
                            ? plan.popular 
                              ? 'bg-white bg-opacity-20 group-hover:bg-opacity-30' 
                              : 'bg-sky-100 group-hover:bg-sky-200'
                            : plan.popular 
                              ? 'bg-white bg-opacity-10' 
                              : 'bg-slate-100'
                        }`}>
                          {feature.included ? (
                            <svg className={`w-4 h-4 ${plan.popular ? 'text-white' : 'text-sky-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className={`w-4 h-4 ${plan.popular ? 'text-white opacity-40' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium leading-relaxed ${
                          feature.included
                            ? plan.popular ? 'text-white' : 'text-slate-700'
                            : plan.popular ? 'text-white opacity-50 line-through' : 'text-slate-400 line-through'
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link href="/extra/demopage">

                  <button className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <p className="text-slate-500 mb-6">All plans include 24/7 support and a 30-day money-back guarantee</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              SSL Security
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              99.9% Uptime
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Cancel Anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;