/* eslint-disable */

export default function ImageSectionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 xl:gap-24 items-start">
        {/* Left Content */}
        <div className="md:mt-20">
          <p className="text-blue-500 text-xs sm:text-sm md:text-base font-semibold mb-3 sm:mb-4 uppercase tracking-wide">
            What our work life is like
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">
            Where service excellence meets innovation
          </h1>
          <div className="space-y-3 sm:space-y-4">
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              Store Manager transforms how repair shops and service centers operate. Our platform brings together job management, customer tracking, technician coordination, and real-time analytics in one seamless system.<br/>
              Built for businesses that value efficiency, we provide multi-tenant architecture ensuring complete data isolation, role-based access for teams, and guest check-in flows that delight customers. From the moment a device arrives to final billing, every step is tracked and optimized.<br/>
              Whether you're managing a single location or multiple franchises, Store Manager scales with your business. Our modular approach means you use only what you need—jobs, inventory, AMC contracts, billing, and comprehensive reporting—all designed to reduce administrative overhead and maximize your operational success.
            </p>
          </div>
        </div>
        
        {/* Right Image Grid - Exact Masonry Layout */}
        <div className="relative mt-8 md:mt-0">
          {/* Row 1 - Two images at top */}
          <div className="flex gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
            <img
              src="https://cdn.pixabay.com/photo/2018/01/17/06/21/electrician-3087536_640.jpg"
              alt="Team gathering"
              className="w-[53%] h-20 sm:h-28 md:h-36 lg:h-42 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
            <img
              src="https://cdn.pixabay.com/photo/2020/11/13/08/37/pc-5737958_640.jpg"
              alt="Office discussion"
              className="w-[40%] h-20 sm:h-28 md:h-36 lg:h-42 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
          </div>

          {/* Row 2 & 3 - Complex layout with left column and tall right image */}
          <div className="flex gap-2 sm:gap-3 lg:gap-4">
            {/* Left Column - Brick wall + bottom two images */}
            <div className="w-[53%] space-y-2 sm:space-y-3 lg:space-y-4">
              {/* Large brick wall team photo */}
              <img
                src="https://cdn.pixabay.com/photo/2020/12/28/09/44/man-5866475_640.jpg"
                alt="Team meeting brick wall"
                className="w-full h-28 sm:h-36 md:h-48 lg:h-52 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
              />

              {/* Bottom two images under brick wall */}
              <div className="flex gap-2 sm:gap-3 lg:gap-4">
                <img
                  src="https://cdn.pixabay.com/photo/2022/12/03/09/03/repair-7632287_640.jpg"
                  alt="Team member with keka shirt"
                  className="w-[47%] h-20 sm:h-28 md:h-36 lg:h-44 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                />
                <img
                  src="https://cdn.pixabay.com/photo/2021/03/22/15/22/construction-workers-6114988_640.jpg"
                  alt="Team celebration colorful"
                  className="w-[50%] h-20 sm:h-28 md:h-36 lg:h-44 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                />
              </div>
            </div>

            {/* Right Column - Tall dining image + celebration person below */}
            <div className="w-[40%] space-y-2 sm:space-y-3 lg:space-y-4">
              <img
                src="https://cdn.pixabay.com/photo/2017/09/16/17/41/man-2756206_640.jpg"
                alt="Team dining celebration"
                className="w-full h-28 sm:h-40 md:h-52 lg:h-60 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
              />

              <img
                src="https://cdn.pixabay.com/photo/2020/08/17/18/44/mother-board-5496178_640.jpg"
                alt="Celebration moment"
                className="w-full h-20 sm:h-28 md:h-40 lg:h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}