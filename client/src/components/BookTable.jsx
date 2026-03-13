import { motion } from "framer-motion";
import { useState } from "react";

const timeSlots = [
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

export default function BookTable() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!time) {
      alert("Please select a time slot");
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setName("");
      setGuests(2);
      setDate("");
      setTime("");
    }, 3000);
  };

  return (
    <section
      id="book-table"
      className="py-24 px-6 bg-gradient-to-br from-black via-gray-900 to-black text-white"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif">
          Reserve Your Table
        </h2>
        <p className="text-gray-400 mt-4">
          Choose your preferred time & enjoy luxury dining.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        {/* FORM SIDE */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl space-y-6"
        >
          {/* Name */}
          <div>
            <label className="text-sm text-gray-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-amber-400 outline-none"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="text-sm text-gray-300">Guests</label>
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={() => guests > 1 && setGuests(guests - 1)}
                className="px-4 py-2 bg-white/10 rounded-xl"
              >
                -
              </button>
              <span className="text-lg">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests(guests + 1)}
                className="px-4 py-2 bg-white/10 rounded-xl"
              >
                +
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm text-gray-300">Select Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-amber-400 outline-none"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="text-sm text-gray-300">Select Time</label>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`py-2 rounded-xl border transition
                    ${
                      time === slot
                        ? "bg-amber-400 text-black border-amber-400"
                        : "bg-white/10 border-white/20"
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-amber-400 text-black rounded-full font-semibold hover:scale-105 transition shadow-lg shadow-amber-400/30"
          >
            Confirm Reservation
          </button>

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-emerald-400 text-center mt-4"
            >
              🎉 Reservation Confirmed!
            </motion.div>
          )}
        </motion.form>

        {/* SUMMARY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl"
        >
          <h3 className="text-2xl font-serif mb-6">
            Reservation Summary
          </h3>

          <div className="space-y-4 text-gray-300">
            <p>
              <span className="text-white font-medium">Name:</span>{" "}
              {name || "—"}
            </p>

            <p>
              <span className="text-white font-medium">Guests:</span>{" "}
              {guests}
            </p>

            <p>
              <span className="text-white font-medium">Date:</span>{" "}
              {date || "—"}
            </p>

            <p>
              <span className="text-white font-medium">Time:</span>{" "}
              {time || "—"}
            </p>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            Please arrive 10 minutes before your reserved time.
          </div>
        </motion.div>

      </div>
    </section>
  );
}
