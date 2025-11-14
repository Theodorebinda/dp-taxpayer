"use client";

import DPGlobe from "./Globe";
import { motion } from "framer-motion";

export default function GlobeSection() {
  return (
    <section className="w-full bg-[#0a1b2a] text-white py-32 relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(4,137,150,0.4),transparent_70%)] blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-16 relative z-20">
        {/* LEFT: Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 space-y-6"
        >
          <h2 className="text-5xl font-bold leading-tight">
            Une vision globale,
            <br />
            <span className="text-[#21ff63]">pilotée par la donnée.</span>
          </h2>

          <p className="text-lg text-white/80 max-w-lg">
            DigiPublic connecte et synchronise les opérations fiscales à travers
            le pays, grâce à une infrastructure moderne basée sur des API et des
            visualisations en temps réel.
          </p>

          <div className="mt-8">
            <a
              href="/public/registration"
              className="px-6 py-3 bg-[#048996] font-semibold text-white rounded-lg hover:bg-[#17a9b6] transition"
            >
              Commencer
            </a>
          </div>
        </motion.div>

        {/* RIGHT: Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 h-[100%] md:h-[100%]"
        >
          <DPGlobe />
        </motion.div>
      </div>
    </section>
  );
}
