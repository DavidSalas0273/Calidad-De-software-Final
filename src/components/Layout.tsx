import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
