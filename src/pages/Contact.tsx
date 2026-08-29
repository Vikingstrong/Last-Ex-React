import { useState } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Mail, Phone } from "lucide-react";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('contact.writeDesc'));
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <main className="max-w-300 m-auto px-4 lg:px-0 py-8 pb-24 lg:pb-12 flex flex-col gap-12">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <NavLink to="/" className="hover:text-black transition">
          {t('header.home')}
        </NavLink>
        <span>/</span>
        <span className="font-semibold text-black">{t('header.contact')}</span>
      </div>

      {/* 2. Content Layout: Left Card (Info) + Right Card (Form) */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Info Card */}
        <div className="lg:w-1/3 bg-white shadow-sm border border-gray-100 rounded-sm p-8 flex flex-col gap-6">
          
          {/* Call To Us */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#DB4444] text-white flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {t('contact.callToUs')}
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              {t('contact.callDesc')}
            </p>
            <p className="text-sm text-gray-700 font-medium">
              {t('contact.phone')}
            </p>
          </div>

          <div className="border-b border-gray-200 my-2" />

          {/* Write To Us */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#DB4444] text-white flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {t('contact.writeToUs')}
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {t('contact.writeDesc')}
            </p>
            <p className="text-sm text-gray-700">
              {t('contact.emailSupport')}
            </p>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:w-2/3 bg-white shadow-sm border border-gray-100 rounded-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder={t('contact.yourName')}
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-[#F5F5F5] rounded px-4 py-3.5 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition"
              />
              <input
                type="email"
                placeholder={t('contact.yourEmail')}
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-[#F5F5F5] rounded px-4 py-3.5 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition"
              />
              <input
                type="tel"
                placeholder={t('contact.yourPhone')}
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-[#F5F5F5] rounded px-4 py-3.5 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition"
              />
            </div>

            <textarea
              rows={8}
              placeholder={t('contact.yourMessage')}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full bg-[#F5F5F5] rounded px-4 py-3.5 text-sm outline-none text-gray-800 focus:ring-1 focus:ring-[#DB4444] transition resize-none"
            />

            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="bg-[#DB4444] text-white px-10 py-3.5 rounded font-medium text-sm hover:bg-[#c0392b] transition cursor-pointer"
              >
                {t('contact.sendMessage')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
