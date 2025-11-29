/* eslint-disable */

export default function ImageSectionPage() {
  return (
    <div className="max-w-7xl mx-auto px-10 py-16">
      <div className="grid md:grid-cols-2 gap-15 items-start">
        {/* Left Content */}
        <div className="mt-20">
          <p className="text-[#4A70A9] text-xs sm:text-sm md:text-base font-semibold mb-3 sm:mb-4 uppercase tracking-wide">
            What our work life is like
          </p>
          <h1 className="mt-2 text-3xl sm:text-3xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">
            Where creativity meets technology 
          </h1>
          <div className="text-gray-600 space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg">
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              Most people like some nothing they used a life doing something they don't care much about. But you were a hero, we really look cool. Then we can still have some exciting times.<br/>
               If we wanted to do something radical, like make a movie or whatever, we'd make it some exciting. It took a lot of the whole talk, something else would make it some exciting. It took a lot of creative work that would have been cool to try out.<br/>
              Anyway, we want the best for you, regardless of what your next level was like. It. We do focus on media talking about it, but we always try that can make it some even if not with us, even.

            </p>
          </div>
        </div>
        
        {/* Right Image Grid - Exact Masonry Layout */}
        <div className="relative">
          {/* Row 1 - Two images at top */}
          <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
            <img
              src="https://cdn.pixabay.com/photo/2018/01/17/06/21/electrician-3087536_640.jpg"
              alt="Team gathering"
              className="w-[53%] h-24 sm:h-32 md:h-42 object-cover rounded-lg"
            />
            <img
              src="https://cdn.pixabay.com/photo/2020/11/13/08/37/pc-5737958_640.jpg"
              alt="Office discussion"
              className="w-[40%] h-24 sm:h-32 md:h-42 object-cover rounded-lg"
            />
          </div>

          {/* Row 2 & 3 - Complex layout with left column and tall right image */}
          <div className="flex gap-2 sm:gap-3">
            {/* Left Column - Brick wall + bottom two images */}
            <div className="w-[53%] space-y-2 sm:space-y-3">
              {/* Large brick wall team photo */}
              <img
                src="https://cdn.pixabay.com/photo/2020/12/28/09/44/man-5866475_640.jpg"
                alt="Team meeting brick wall"
                className="w-full h-32 sm:h-40 md:h-52 object-cover rounded-lg"
              />

              {/* Bottom two images under brick wall */}
              <div className="flex gap-2 sm:gap-3">
                <img
                  src="https://cdn.pixabay.com/photo/2022/12/03/09/03/repair-7632287_640.jpg"
                  alt="Team member with keka shirt"
                  className="w-[47%] h-24 sm:h-32 md:h-44 object-cover rounded-lg"
                />
                <img
                  src="https://cdn.pixabay.com/photo/2021/03/22/15/22/construction-workers-6114988_640.jpg"
                  alt="Team celebration colorful"
                  className="w-[50%] h-24 sm:h-32 md:h-53 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Right Column - Tall dining image + celebration person below */}
            <div className="w-[40%] space-y-2 sm:space-y-3">
              <img
                src="https://cdn.pixabay.com/photo/2017/09/16/17/41/man-2756206_640.jpg"
                alt="Team dining celebration"
                className="w-full h-32 sm:h-44 md:h-60 object-cover rounded-lg"
              />

              <img
                src="https://cdn.pixabay.com/photo/2020/08/17/18/44/mother-board-5496178_640.jpg"
                alt="Celebration moment"
                className="w-full h-24 sm:h-32 md:h-54 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}