// React

import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  return (
    <main className="bg-primary text-tertiary ">
      <div className="max_padd_container max-w-[1600px] mx-auto px-4 lg:px-8">
        <Navbar />
        <Admin />
      </div>
    </main>
  )
}