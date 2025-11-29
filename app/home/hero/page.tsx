import { Users, Clock, Smartphone, Globe, Receipt } from 'lucide-react';

const features = [
    { icon: Users, title: 'Smart\nManagement' },
    { icon: Clock, title: 'Real-time' },
    { icon: Smartphone, title: 'Multi-device' },
    { icon: Globe, title: 'Access\nAnywhere' },
    { icon: Receipt, title: 'Easy Billing &\nReports', span: true }
];

export default function HeroSection() {
    return (
        <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-6">
            
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">

                        <h1 className="text-5xl sm:text-5xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">
                            All-in-one repair shop management <span className='text-[#4A70A9]'>software</span>
                        </h1>


                        <p className="text-lg text-gray-700 leading-relaxed">
                            Run your business smoothly with an all-in-one platform. Simple to use,
                            highly efficient, and designed to save you time and money.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <button className="cursor-pointer bg-[#4A70A9] text-white px-10 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl">
                                Start Now
                            </button>
                            {/* <button className="border-2 border-black text-black hover:bg-[#4A70A9] hover:text-white px-10 py-3.5 rounded-full font-semibold transition-all flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-current rounded-sm" />
                                Explore Now
                            </button> */}
                        </div>
                    </div>

                    {/* Right Features Grid */}
                    <div className="grid grid-cols-3 gap-5">
                        {features.map(({ icon: Icon, title, span }, i) => (
                            <div
                                key={i}
                                className={`bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition-all ${span ? 'col-span-3 md:col-span-1' : ''
                                    }`}
                            >
                                <div className="w-16 h-16 mb-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center">
                                    <Icon className="w-9 h-9 stroke-[1.5] text-[#4A70A9]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 whitespace-pre-line">
                                    {title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}