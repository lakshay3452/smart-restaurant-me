export default function BentoGrid() {
  return (
    <section className="p-10 grid md:grid-cols-3 gap-6">
      <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" className="w-full h-full object-cover" />
      </div>

      <div className="rounded-2xl bg-emeraldAccent p-6 text-black">
        Signature Dessert
      </div>

      <div className="rounded-2xl bg-amberAccent p-6 text-black">
        Chef Special
      </div>
    </section>
  );
}
