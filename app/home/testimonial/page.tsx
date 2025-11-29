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
      name: "Ranuka Ranjhan",
      role: "Payroll Admin",
      image: "/images/test/p-1.jpg",
      text: "Store Manager is an absolute game-changer for streamlining HR processes! The platform makes managing employees a breeze with its design.",
      rating: 4.5
    },
    {
      name: "Shantanu Gupta",
      role: "Chief Executive",
      image: "/images/test/p-2.jpg",
      text: "Super intuitive and efficient! Store Manager has simplified every aspect of HR management for our team, saving us so much time.",
      rating: 4.5
    },
    {
      name: "Anita Desai",
      role: "Product Manager",
      image: "/images/test/p-3.jpg",
      text: "Say goodbye to mundane spreadsheets and rigid systems. Store Manager makes managing HR tasks simple and enjoyable for everyone.",
      rating: 4
    },
    {
      name: "David Lee",
      role: "HR Manager",
      image: "/images/test/p-4.jpg",
      text: "Store Manager provides smarter and more efficient software with features designed to free you from administrative work completely.",
      rating: 4.5
    },
    {
      name: "Shubham Patel",
      role: "Operations Director",
      image: "/images/test/p-5.jpg",
      text: "Store Manager has transformed how we handle employee onboarding. What used to take days now takes hours. Absolutely phenomenal!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Talent Acquisition Lead",
      image: "/images/test/p-6.jpg",
      text: "The best HR software I've used in my 15-year career. Store Manager's clean interface, powerful features, and exceptional support.",
      rating: 4.5
    },
    {
      name: "Sophia Patel",
      role: "People Operations Manager",
      image: "/images/test/p-7.jpg",
      text: "Finally, an HR platform that actually understands what we need! Store Manager's automation features have saved us countless hours.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "HR Business Partner",
      image: "/images/test/p-8.jpg",
      text: "Store Manager seamlessly integrates with our existing tools. The reporting features give us insights we never had before today.",
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
    <div className="bg-white flex items-center justify-center p-8">
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
                index === (currentIndex % baseTestimonials.length) ? 'w-8 bg-[#4A70A9]' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}