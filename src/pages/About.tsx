import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const stats = [
    {
      id: 1,
      icon: Store,
      number: "10.5k",
      label: t('about.sellersActive'),
      isActive: false,
    },
    {
      id: 2,
      icon: DollarSign,
      number: "33k",
      label: t('about.monthlyProductSale'),
      isActive: false,
    },
    {
      id: 3,
      icon: ShoppingBag,
      number: "45.5k",
      label: t('about.customerActive'),
      isActive: false,
    },
    {
      id: 4,
      icon: Coins,
      number: "25k",
      label: t('about.annualGross'),
      isActive: false,
    },
  ];

  const team = [
    {
      id: 1,
      name: t('about.founder'),
      role: t('about.founderRole'),
      image: person1,
    },
    {
      id: 2,
      name: t('about.director'),
      role: t('about.directorRole'),
      image: person2,
    },
    {
      id: 3,
      name: t('about.designer'),
      role: t('about.designerRole'),
      image: person3,
    },
  ];

  return (
    <main className="max-w-300 m-auto px-4 lg:px-0 py-8 pb-24 lg:pb-12 flex flex-col gap-16 lg:gap-24">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <NavLink to="/" className="hover:text-black transition">
          {t('header.home')}
        </NavLink>
        <span>/</span>
        <span className="font-semibold text-black">{t('header.about')}</span>
      </div>

      {/* 2. Hero: Our Story */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex flex-col gap-6 lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
            {t('about.ourStory')}
          </h1>
          <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
            {t('about.ourStoryP1')}
          </p>
          <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
            {t('about.ourStoryP2')}
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
              className={`flex flex-col items-center justify-center p-8 rounded border transition-all duration-300 group cursor-pointer ${
                item.isActive
                  ? "bg-[#DB4444] text-white border-[#DB4444] shadow-lg shadow-red-200"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444]"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
                  item.isActive
                    ? "bg-white/30 text-white"
                    : "bg-gray-200 text-black group-hover:bg-white/30 group-hover:text-white"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    item.isActive
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
              <span className="text-sm text-center mt-2 font-medium opacity-90">
                {item.label}
              </span>
            </div>
          );
        })}
      </section>

      {/* 4. Team Members */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member) => (
          <div key={member.id} className="flex flex-col gap-4">
            <div className="bg-[#F5F5F5] rounded-sm flex items-end justify-center pt-8 px-6 overflow-hidden h-96">
              <img
                src={member.image}
                alt={member.name}
                className="object-contain max-h-full transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 5. Features / Guarantee */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-12">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-1">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {t('home.freeDelivery')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('home.freeDeliveryDesc')}
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-1">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {t('home.customerService')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('home.customerServiceDesc')}
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-1">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {t('home.moneyBack')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('home.moneyBackDesc')}
          </p>
        </div>
      </section>
    </main>
  );
}
