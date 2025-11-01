export const Navbar = () => (
  <nav className="bg-green-700 text-white py-4 shadow-md">
    <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
      <h1 className="text-xl font-bold">CropXpert</h1>
      <ul className="flex gap-4">
        <li><a href="/" className="hover:underline">Home</a></li>
        <li><a href="/weather" className="hover:underline">Weather</a></li>
        <li><a href="/market" className="hover:underline">Market</a></li>
      </ul>
    </div>
  </nav>
);
