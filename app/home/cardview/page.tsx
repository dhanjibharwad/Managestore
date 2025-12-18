import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  rotation: string; // Tailwind rotation class
  bgColor: string; // Background color for the card
}

const team: TeamMember[] = [
  {
    name: "Emily Wilson",
    role: "Handyman designer",
    image: "/images/test/p-1.jpg", // Replace with your actual paths
    rotation: "-rotate-3",
    bgColor: "bg-[#F3E5D8]",
  },
  {
    name: "Chris Martinez",
    role: "Handyman supervisor",
    image: "/images/test/p-2.jpg",
    rotation: "-rotate-1",
    bgColor: "bg-[#E6E8D2]",
  },
  {
    name: "Linda Garcia",
    role: "Handyman consultant",
    image: "/images/test/p-3.jpg",
    rotation: "rotate-2",
    bgColor: "bg-[#F3E5D8]",
  },
  {
    name: "David Brown",
    role: "Handyman apprentice",
    image: "/images/test/p-7.jpg",
    rotation: "rotate-3",
    bgColor: "bg-[#E6E8D2]",
  },
];

export default function TeamPage() {
  return (
    <main className="py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Header Section */}
        <p className="uppercase tracking-widest text-xs font-semibold text-gray-600 mb-4">
          Our Team
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-16">
          The experts behind the tools
        </h1>

        {/* Team Grid */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-2">
          {team.map((member, index) => (
            <div
              key={index}
              className={`relative w-full max-w-[280px] p-6 rounded-3xl shadow-sm transition-transform hover:scale-105 hover:z-10 ${member.bgColor} ${member.rotation} origin-bottom`}
            >
              <div className="text-left mb-6">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {member.role}
                </p>
              </div>

              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                {/* Note: Ensure you have these images in your public folder */}
                <div className="w-full h-full bg-gray-300 animate-pulse flex items-center justify-center text-gray-500">
                  {/* Placeholder for images */}
                  <span>Image</span>
                </div>
                Uncomment once you have images:
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                /> 
               
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}