import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowUpRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] text-white mt-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-serif text-amber-400 mb-3">
              LaCasa
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Experience fine dining crafted with passion and perfection. From farm-fresh ingredients to your table.
            </p>

            <div className="flex gap-3 mt-5">
              <Social icon={<Instagram size={16} />} />
              <Social icon={<Facebook size={16} />} />
              <Social icon={<Twitter size={16} />} />
              <Social icon={<Mail size={16} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2.5">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/menu" label="Menu" />
              <FooterLink to="/cart" label="Cart" />
              <FooterLink to="/orders" label="My Orders" />
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2.5 text-white/40 text-sm">
              <li>Dine-In</li>
              <li>Online Order</li>
              <li>Table Reservation</li>
              <li>Private Events</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Contact</h3>
            <div className="space-y-3 text-white/40 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-amber-400/60 mt-0.5 shrink-0" />
                <span>Connaught Place,<br />New Delhi 110001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-amber-400/60 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-amber-400/60 shrink-0" />
                <span>hello@lacasa.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs sm:text-sm">
            © {new Date().getFullYear()} LaCasa. All rights reserved.
          </p>
          <p className="text-white/20 text-xs flex items-center gap-1">
            Made with <Heart size={10} fill="currentColor" className="text-red-400" /> in India
          </p>
        </div>

      </div>
    </footer>
  );
}

function Social({ icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      className="w-9 h-9 flex items-center justify-center bg-white/[0.05] border border-white/[0.06] rounded-xl cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400 transition text-white/40"
    >
      {icon}
    </motion.div>
  );
}

function FooterLink({ to, label }) {
  return (
    <li>
      <Link
        to={to}
        className="text-white/40 text-sm hover:text-amber-400 transition flex items-center gap-1 group"
      >
        {label}
        <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition" />
      </Link>
    </li>
  );
}
