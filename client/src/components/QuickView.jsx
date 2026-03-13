import { motion } from "framer-motion";

export default function QuickView({ item, onClose }) {

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="fixed inset-0 flex items-center justify-center p-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >

        <div className="bg-white dark:bg-charcoal rounded-2xl max-w-md w-full p-6">

          <img src={item.image} className="rounded-xl mb-4" />

          <h2 className="font-serif text-2xl mb-2">
            {item.name}
          </h2>

          <p className="mb-4">
            Delicious chef special made with premium ingredients.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-amberAccent py-3 rounded-xl"
          >
            Close
          </button>

        </div>

      </motion.div>
    </>
  );
}
