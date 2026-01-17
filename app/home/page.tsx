/* eslint-disable */
'use client'

import Image from 'next/image';
import CardDetail from './services/page';
// import WorkflowPage from './newsec/page';
import Link from "next/link";
import AppFeaturesPage from './support/page';
import WallOfLove from './testimonial/page';
import HeroSection from './hero/page';
import ScrollAnimatedSection from '@/components/ScrollAnimatedSection';
import ImageSectionPage from './imagesec/page';
import ServiceManager from './specialdiv/page';


export default function UserHomePage() {

  return (
    <div className="min-h-screen bg-white">

      <ScrollAnimatedSection>
        <HeroSection />
      </ScrollAnimatedSection>

      <ScrollAnimatedSection className="py-8 sm:py-12 lg:py-16 bg-white dark:bg-gray-900" delay={100}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Image */}
          <div className="relative w-full h-[300px] sm:h-[350px] lg:h-[450px] overflow-hidden group order-2 lg:order-1">
            <Image
              src="/images/dash.svg"
              alt="About Us Illustration"
              fill
              className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:-translate-y-2 group-hover:shadow-2xl"
            />
          </div>

          {/* Right Content */}
          <div className="text-left lg:pl-8 order-1 lg:order-2">
            <p className="text-blue-500 dark:text-blue-400 text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide">
              About Us
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-200">
              We&apos;re Best In Service Provider
            </h2>

            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Store Manager is a comprehensive multi-tenant service management platform designed specifically for repair shops and service businesses. We empower businesses with secure company-isolated environments, role-based access control, and complete job lifecycle management—from customer check-in to final billing and reporting.
            </p>

            <Link href="/home/about">
              <button className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-white bg-blue-500 shadow-lg hover:opacity-90 transition cursor-pointer text-sm sm:text-base">
                See About Us
              </button>
            </Link>
          </div>
        </div>
      </ScrollAnimatedSection>


      <ScrollAnimatedSection delay={200}>
        <ImageSectionPage />
      </ScrollAnimatedSection>

      <ScrollAnimatedSection className="py-8 sm:py-12 lg:py-16 bg-white dark:bg-gray-900" delay={200}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Image */}
          <div className="relative w-full h-[300px] sm:h-[350px] lg:h-[450px] overflow-hidden group">
            <Image
              src="/images/roc.svg"
              alt="About Us Illustration"
              fill
              className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:-translate-y-2 group-hover:shadow-2xl"
            />
          </div>

          {/* Right Content */}
          <div className="text-left lg:pl-8">
            <p className="text-blue-500 dark:text-blue-400 text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide">
              OUR MISSION
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-200">
              What our mission stands for
            </h2>

            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our mission is to simplify service management for repair shops and service centers worldwide. We provide a modular, scalable platform that grows with your business—enabling seamless job tracking, customer management, technician coordination, inventory control, and automated billing. Every feature is designed to reduce administrative burden and maximize operational efficiency.
            </p>
          </div>
        </div>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection className="py-8 sm:py-12 lg:py-16 bg-white dark:bg-gray-900" delay={200}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Image */}
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[650px] overflow-hidden group order-2 lg:order-1">
            <Image
              src="/images/pie.svg"
              alt="About Us Illustration"
              fill
              className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:-translate-y-2 group-hover:shadow-2xl"
            />
          </div>

          {/* Right Content */}
          <div className="text-left lg:pl-8 order-1 lg:order-2">
            <p className="text-blue-500 dark:text-blue-400 text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide">
              OUR DASHBOARD
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-200">
              Our system specifies in dashboard
            </h2>

            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our centralized dashboard provides real-time visibility into your entire operation. Monitor active jobs, track technician workload, view payment status, analyze customer history, and generate comprehensive reports—all filtered by company for complete data security. Make informed decisions with live metrics on job completion rates, revenue trends, inventory levels, and AMC renewals at your fingertips.
            </p>
          </div>
        </div>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection delay={300}>
        <CardDetail />
      </ScrollAnimatedSection>

      <ScrollAnimatedSection delay={300}>
        <AppFeaturesPage />
      </ScrollAnimatedSection>

      <ScrollAnimatedSection delay={400}>
        <ServiceManager />
      </ScrollAnimatedSection>

      <ScrollAnimatedSection delay={500}>
        <WallOfLove />
      </ScrollAnimatedSection>

    </div>
  );
}