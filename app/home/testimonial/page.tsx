'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WallOfLove() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1200) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getTransformValue = () => {
    switch (screenSize) {
      case 'mobile': return 100;
      case 'tablet': return 33.333;
      case 'desktop': return 25;
      default: return 25;
    }
  };

  const baseTestimonials = [
    {
      name: "Roshni Patel",
      role: "Mobile Repair Shop Owner",
      image: "/images/test/p-1.jpg",
      text: "Store Manager transformed our repair shop operations. Job tracking is seamless, and our customers love the self check-in feature. Revenue increased by 35% in 3 months!",
      rating: 5
    },
    {
      name: "Sarah Mitchell",
      role: "Service Center Manager",
      image: "/images/test/p-2.jpg",
      text: "Finally, a platform built for service businesses! The multi-tenant setup keeps our data secure, and technicians can update job status on the go. Game changer!",
      rating: 4.5
    },
    {
      name: "Payal Sharma",
      role: "Electronics Repair Business",
      image: "/images/test/p-3.jpg",
      text: "Managing 3 locations was a nightmare before Store Manager. Now I monitor everything from one dashboard. AMC tracking and inventory management are brilliant!",
      rating: 5
    },
    {
      name: "Vishnu Das",
      role: "Computer Service Center",
      image: "/images/test/p-4.jpg",
      text: "The role-based access is perfect for our team. Technicians see their tasks, customers track their devices, and I get real-time reports. Worth every penny!",
      rating: 4.5
    },
    {
      name: "Vikram Patel",
      role: "Appliance Repair Shop",
      image: "/images/test/p-5.jpg",
      text: "Billing and invoicing used to take hours. Now it's automated! The guest check-in feature reduced front desk workload by 60%. Highly recommend!",
      rating: 5
    },
    {
      name: "Shankar Rodriguez",
      role: "Multi-Brand Service Center",
      image: "/images/test/p-6.jpg",
      text: "We handle 200+ jobs monthly. Store Manager's job lifecycle tracking ensures nothing falls through the cracks. Customer satisfaction improved dramatically!",
      rating: 4.5
    },
    {
      name: "Anegha Reddy",
      role: "Laptop & Mobile Repairs",
      image: "/images/test/p-7.jpg",
      text: "The modular approach is genius! We started with basic job management and added inventory and AMC modules as we grew. Scales perfectly with our business.",
      rating: 5
    },
    {
      name: "Mark Anderson",
      role: "Tech Repair Franchise Owner",
      image: "/images/test/p-8.jpg",
      text: "Managing 5 franchise locations is effortless now. Each location has its own subdomain, and I oversee everything from the super-admin panel. Brilliant solution!",
      rating: 4.5
    }
  ];

  const testimonials = [...baseTestimonials, ...baseTestimonials];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= baseTestimonials.length) {
          setTimeout(() => {
            setIsTransitioning(false);
            setCurrentIndex(0);
            setTimeout(() => setIsTransitioning(true), 50);
          }, 700);
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [baseTestimonials.length]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-7 h-7 fill-gray-800" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-7 h-7" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="#424242" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-7 h-7 fill-gray-200" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-7xl w-full">

        <div className="relative overflow-hidden">
          <div 
            className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{ 
              transform: `translateX(-${currentIndex * getTransformValue()}%)` 
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full md:w-1/3 xl:w-1/4 flex-shrink-0 px-3">
                <div className="bg-white rounded-2xl p-6 shadow-sm h-full max-w-md mx-auto md:max-w-none flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="relative w-14 h-14 mr-3">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="rounded-full bg-gray-200 object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{testimonial.name}</h3>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {testimonial.text}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: baseTestimonials.length }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === (currentIndex % baseTestimonials.length) ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}