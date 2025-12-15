import { Users, Clock, Smartphone, Globe, Receipt } from 'lucide-react';
import Link from 'next/link';

const features = [
    { title: 'Smart\nManagement' },
    { title: 'Real-time\nUpdates' },
    { title: 'Multi-device\nAccess' },
    { title: 'Access\nAnywhere' },
    { title: 'Easy Billing &\nReports' },
];


export default function HeroSection() {
    return (
        <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-20 px-6">

            <div className="max-w-7xl mx-auto mt-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-100">
                            End-to-End repair shop management <span className='text-blue-500 dark:text-blue-400'>software</span>
                        </h1>


                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            Run your business smoothly with an all-in-one platform. Simple to use,
                            highly efficient, and designed to save you time and money.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link href="/extra/demopage">
                            <button className="cursor-pointer bg-blue-500 text-white px-6 sm:px-10 py-3 sm:py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl text-sm sm:text-base">
                                Start Now
                            </button>
                            </Link>
                            {/* <button className="border-2 border-black text-black hover:bg-blue-500 hover:text-white px-10 py-3.5 rounded-full font-semibold transition-all flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-current rounded-sm" />
                                Explore Now
                            </button> */}
                        </div>
                    </div>

                    {/* Right Features Grid */}
                    {/* <div className="grid grid-cols-3 gap-5">
                        {features.map(({ icon: Icon, title, span }, i) => (
                            <div
                                key={i}
                                className={`bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition-all ${span ? 'col-span-3 md:col-span-1' : ''
                                    }`}
                            >
                                <div className="w-16 h-16 mb-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center">
                                    <Icon className="w-9 h-9 stroke-[1.5] text-blue-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 whitespace-pre-line">
                                    {title}
                                </h3>
                            </div>
                        ))}
                    </div> */}
                    <div className="w-full">
                        <img
                            src="/images/repair.svg"
                            alt="Hero Image"
                            className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 mt-16 text-center">
                    {features.map(({ title }, i) => (
                        <div key={i} className="flex flex-col items-center p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">

                            {/* ✅ SVG IMAGE ONLY */}
                            <img
                                src={`/images/icons/feature-${i + 1}.svg`}
                                alt={title}
                                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-42 lg:h-42 mb-3 object-contain"
                            />

                            {/* ✅ TITLE BELOW IMAGE */}
                            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 whitespace-pre-line mt-2">
                                {title}
                            </h3>

                        </div>
                    ))}
                </div>



            </div>
        </section>
    );
}