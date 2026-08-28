import { NavLink } from "react-router";
import {
  Coins,
  DollarSign,
  Headphones,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";

import storyImg from "../assets/main/portrait-two-african-females-holding-shopping-bags-while-reacting-something-their-smartphone 1.png";
import person1 from "../assets/main/people1.png";
import person2 from "../assets/main/people2.png";
import person3 from "../assets/main/people3.png";

export default function About() {
  const stats = [
    {
      id: 1,
      icon: Store,
      number: "10.5k",
      label: "Sallers active our site",
      isActive: false,
    },
    {
      id: 2,
      icon: DollarSign,
      number: "33k",
      label: "Mopnthly Produduct Sale",
      isActive: false,
    },
    {
      id: 3,
      icon: ShoppingBag,
      number: "45.5k",
      label: "Customer active in our site",
      isActive: false,
    },
    {
      id: 4,
      icon: Coins,
      number: "25k",
      label: "Anual gross sale in our site",
      isActive: false,
    },
  ];

  const team = [
    {
      id: 1,
      name: "Tom Cruise",
      role: "Founder & Chairman",
      image: person1,
    },
    {
      id: 2,
      name: "Emma Watson",
      role: "Managing Director",
      image: person2,
    },
    {
      id: 3,
      name: "Will Smith",
      role: "Product Designer",
      image: person3,
    },
  ];

  return (
    <main className="max-w-300 m-auto px-5 lg:px-0 py-8 flex flex-col gap-24">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <NavLink to="/" className="hover:text-black transition">
          Home
        </NavLink>
        <span>/</span>
        <span className="font-semibold text-black">About</span>
      </div>

      {/* 2. Hero: Our Story */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex flex-col gap-6 lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
            Our Story
          </h1>
          <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
            Launced in 2015, Exclusive is South Asia’s premier online shopping
            makterplace with an active presense in Bangladesh. Supported by wide
            range of tailored marketing, data and service solutions, Exclusive
            has 10,500 sallers and 300 brands and serves 3 millioons customers
            across the region.
          </p>
          <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
            Exclusive has more than 1 Million products to offer, growing at a
            very fast. Exclusive offers a diverse assotment in categories
            ranging from consumer.
          </p>
        </div>

        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src={storyImg}
            alt="Our Story"
            className="w-full max-w-[550px] object-cover rounded-md shadow-sm"
          />
        </div>
      </section>

      {/* 3. Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className={`flex flex-col items-center justify-center p-8 rounded border transition-all duration-300 group cursor-pointer ${item.isActive
                  ? "bg-[#DB4444] text-white border-[#DB4444] shadow-lg shadow-red-200"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444]"
                }`}
            >
              {/* Dual ring icon wrapper */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${item.isActive
                    ? "bg-white/30 text-white"
                    : "bg-gray-200 text-black group-hover:bg-white/30 group-hover:text-white"
                  }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300 ${item.isActive
                      ? "bg-white text-black"
                      : "bg-black text-white group-hover:bg-white group-hover:text-black"
                    }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>

              <span className="text-3xl font-bold tracking-tight">
                {item.number}
              </span>
              <p className="text-sm mt-2 text-center opacity-90">{item.label}</p>
            </div>
          );
        })}
      </section>

      {/* 4. Team Members Section */}
      <section className="flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.id} className="flex flex-col group">
              {/* Image box with soft gray background */}
              <div className="bg-[#F5F5F5] rounded-t-sm h-96 flex items-end justify-center overflow-hidden px-6 pt-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full object-contain object-bottom"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 pt-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {member.role}
                </p>

                {/* Social icons */}
                <div className="flex items-center gap-4 mt-3 text-gray-800">
                  <span className="hover:text-[#DB4444] transition cursor-pointer">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </span>
                  <span className="hover:text-[#DB4444] transition cursor-pointer">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </span>
                  <span className="hover:text-[#DB4444] transition cursor-pointer">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 cursor-pointer" />
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-[#DB4444] border-2 border-white ring-1 ring-[#DB4444] cursor-pointer" />
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 cursor-pointer" />
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 cursor-pointer" />
        </div>
      </section>

      {/* 5. Features / Services Guarantee */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mb-2">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>
          <h4 className="text-lg font-bold text-gray-900 uppercase">
            Free and Fast Delivery
          </h4>
          <p className="text-xs text-gray-600">
            Free delivery for all orders over $140
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mb-2">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
          </div>
          <h4 className="text-lg font-bold text-gray-900 uppercase">
            24/7 Customer Service
          </h4>
          <p className="text-xs text-gray-600">
            Friendly 24/7 customer support
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mb-2">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <h4 className="text-lg font-bold text-gray-900 uppercase">
            Money Back Guarantee
          </h4>
          <p className="text-xs text-gray-600">
            We return money within 30 days
          </p>
        </div>
      </section>
    </main>
  );
}
