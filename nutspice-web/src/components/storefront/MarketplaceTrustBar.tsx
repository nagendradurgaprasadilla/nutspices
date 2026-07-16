import Link from "next/link";
import Image from "next/image";

export default function MarketplaceTrustBar() {
  const marketplaces = [
    {
      name: "Amazon",
      url: "#",
      logo: "/logos/amazon.svg",
      width: 100,
      height: 30,
    },
    {
      name: "Flipkart",
      url: "#",
      logo: "/logos/flipkart.svg",
      width: 110,
      height: 28,
    },
    {
      name: "Meesho",
      url: "#",
      logo: "/logos/meesho.svg",
      width: 104,
      height: 24,
    },
  ];

  return (
    <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-md border border-white/20 py-3 px-6 sm:px-8 rounded-2xl sm:rounded-full shadow-2xl mx-auto max-w-full">
      <h2 className="text-[10px] md:text-xs font-black tracking-[0.2em] text-white/90 uppercase font-sans text-center">
        WE ARE ALSO AVAILABLE ON
      </h2>
      <div className="hidden sm:block h-5 w-px bg-white/20" />
      <div className="flex items-center gap-4 sm:gap-6">
        {marketplaces.map((item) => (
          <Link
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center bg-white/90 hover:bg-white px-4 py-1.5 rounded-lg sm:rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
          >
            <Image
              src={item.logo}
              alt={`${item.name} Marketplace`}
              width={item.width}
              height={item.height}
              className="opacity-90 transition-opacity duration-300 group-hover:opacity-100 object-contain h-5 w-auto"
              priority
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
