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
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* <section className="relative h-[650px] flex items-center">
       
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/id21.png')", 
            filter: "brightness(0.8)",
          }}
        ></div>
      </section>  */}

      <ScrollAnimatedSection>
        <HeroSection />
      </ScrollAnimatedSection>

      <ScrollAnimatedSection className="py-16 bg-white dark:bg-gray-900" delay={100}>
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Image */}
          <div className="relative w-full h-[400px] lg:h-[450px] overflow-hidden group">
            <Image
              src="/images/dash.svg" // put your image in public/images/
              alt="About Us Illustration"
              fill
              className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:-translate-y-2 group-hover:shadow-2xl"
            />
          </div>

          {/* Right Content */}
          <div className="text-left lg:pl-8">
            <p className="text-blue-500 dark:text-blue-400 text-xs sm:text-sm md:text-base font-semibold mb-3 sm:mb-4 uppercase tracking-wide">
              About Us
            </p>
            {/* <h2 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-800 tracking-tight">
  We&apos;re Best In Service Provider
</h2> */}
            <h2 className="mt-2 text-3xl sm:text-3xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-200">
              We&apos;re Best In Service Provider
            </h2>

            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Their expertise lies in integrating technology, data, and strategy to improve customer satisfaction and
              loyalty while driving business growth. With the right CRM service provider, companies can gain deeper insights
              into customer behavior, automate workflows, and enhance collaboration across teams, ensuring that every customer
              interaction adds value and strengthens long-term partnerships.
            </p>

            <Link href="/home/about">
              <button className="mt-6 px-6 py-3 rounded-lg font-semibold text-white bg-blue-500 shadow-lg hover:opacity-90 transition cursor-pointer">
                See About Us
              </button>
            </Link>
          </div>
        </div>
      </ScrollAnimatedSection>


      <ScrollAnimatedSection delay={200}>
        <ImageSectionPage />
      </ScrollAnimatedSection>

      <ScrollAnimatedSection className="py-16 bg-white dark:bg-gray-900" delay={200}>
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Image */}
          <div className="relative w-full h-[400px] lg:h-[450px] overflow-hidden group">
            <Image
              src="/images/roc.svg"
              alt="About Us Illustration"
              fill
              className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:-translate-y-2 group-hover:shadow-2xl"
            />
          </div>


          {/* Right Content */}
          <div className="text-left lg:pl-8">
            <p className="text-blue-500 dark:text-blue-400 text-xs sm:text-sm md:text-base font-semibold mb-3 sm:mb-4 uppercase tracking-wide">
              OUR MISSION
            </p>
            {/* <h2 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-800 tracking-tight">
  We&apos;re Best In Service Provider
</h2> */}
            <h2 className="mt-2 text-3xl sm:text-3xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-200">
              What our mission stands for
            </h2>

            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Their expertise lies in integrating technology, data, and strategy to improve customer satisfaction and
              loyalty while driving business growth. With the right CRM service provider, companies can gain deeper insights
              into customer behavior, automate workflows, and enhance collaboration across teams, ensuring that every customer
              interaction adds value and strengthens long-term partnerships.
            </p>

            {/* <Link href="/user/about">
              <button className="mt-6 px-6 py-3 rounded-lg font-semibold text-white bg-blue-500 shadow-lg hover:opacity-90 transition cursor-pointer">
                Our Vision
              </button>
            </Link> */}
          </div>
        </div>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection className="py-16 bg-white dark:bg-gray-900" delay={200}>
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Image */}
          <div className="relative w-full h-[600px] lg:h-[650px] overflow-hidden group">
            <Image
              src="/images/pie.svg"
              alt="About Us Illustration"
              fill
              className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:-translate-y-2 group-hover:shadow-2xl"
            />
          </div>


          {/* Right Content */}
          <div className="text-left lg:pl-8">
            <p className="text-blue-500 dark:text-blue-400 text-xs sm:text-sm md:text-base font-semibold mb-3 sm:mb-4 uppercase tracking-wide">
              OUR DASHBOARD
            </p>
            {/* <h2 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-800 tracking-tight">
  We&apos;re Best In Service Provider
</h2> */}
            <h2 className="mt-2 text-3xl sm:text-3xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-200">
              Our system specifies in dashboard
            </h2>

            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Their expertise lies in integrating technology, data, and strategy to improve customer satisfaction and
              loyalty while driving business growth. With the right CRM service provider, companies can gain deeper insights
              into customer behavior, automate workflows, and enhance collaboration across teams, ensuring that every customer
              interaction adds value and strengthens long-term partnerships.
            </p>

            {/* <Link href="/user/about">
              <button className="mt-6 px-6 py-3 rounded-lg font-semibold text-white bg-blue-500 shadow-lg hover:opacity-90 transition cursor-pointer">
                Dashboard
              </button>
            </Link> */}
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