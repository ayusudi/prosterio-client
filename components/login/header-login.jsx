export default function HeaderLogin() {
  return (
    <div className="w-full p-2 max-w-sm flex items-center gap-4 text-center">
      <img
        src="https://prosterio.vercel.app/logo.png"
        alt="Logo"
        className="w-36 h-36 rounded-full " // Adjusted width and height
      />
      <div className="flex flex-col items-start justify-start">
        <h1 className="text-3xl font-bold text-gray-800">Prosterio</h1>
        <p className="text-lg text-gray-500 text-left">
          Streamline Tech Talent for Project Managers
        </p>
      </div>
    </div>
  );
}
