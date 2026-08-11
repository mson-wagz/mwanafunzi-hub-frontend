
import Navigation from "@/components/navigation";
import React from "react";
import professionals from "./data/professionals.json";

const getAvatarUrl = (id) => {
  const gender = id % 2 === 0 ? "men" : "women";
  const num = (id % 99) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${num}.jpg`;
};

export default function Professionals() {
  return (
    <section>
      <Navigation />
      <h2 className="text-2xl font-bold mb-4">Connect with Professionals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((pro) => (
          <div
            key={pro.id}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center"
          >
            <img
              src={getAvatarUrl(pro.id)}
              alt={pro.name}
              className="w-20 h-20 rounded-full shadow mb-4 object-cover"
            />
            <div className="text-lg font-semibold">{pro.name}</div>
            <div className="text-sm text-gray-500">{pro.role}</div>
            <div className="text-sm italic mb-2">{pro.tagline}</div>
            <a
              href={pro.contact}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Connect
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}