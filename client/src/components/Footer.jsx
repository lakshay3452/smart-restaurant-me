import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20 border-t border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-2xl md:text-3xl font-serif text-amber-400 mb-4">
              LaCasa
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Experience fine dining crafted with passion and perfection.
            </p>

            <div className="flex gap-4 mt-6">
              <Social icon={<Facebook size={18} />} />
              <Social icon={<Instagram size={18} />} />
              <Social icon={<Twitter size={18} />} />
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm md:text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
              <li className="hover:text-amber-400 cursor-pointer">Home</li>
              <li className="hover:text-amber-400 cursor-pointer">Menu</li>
              <li className="hover:text-amber-400 cursor-pointer">Book Table</li>
              <li className="hover:text-amber-400 cursor-pointer">Tracking</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm md:text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
              <li>Dine-In</li>
              <li>Online Order</li>
              <li>Reservation</li>
              <li>Private Events</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm md:text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Refund Policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm md:text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-400 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>Connaught Place, Delhi</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>contact@lacasa.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/10 text-center text-gray-500 text-xs md:text-sm">
          © {new Date().getFullYear()} LaCasa. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

function Social({ icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full cursor-pointer hover:bg-amber-400/20 transition"
    >
      {icon}
    </motion.div>
  );
}
