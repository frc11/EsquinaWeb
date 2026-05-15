"use client";

import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function ContactSuccess() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-off-white px-6 py-24 text-center text-off-black md:px-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE }}
        className="max-w-4xl"
      >
        <h1 className="font-display text-[40px] uppercase leading-[1.05]">
          YOUR INQUIRY WAS SENT
          <br />
          SUCCESSFULLY!
        </h1>

        <p className="mx-auto mt-8 max-w-3xl font-body text-[17px] uppercase leading-[1.45]">
          WE APPRECIATE YOU TAKING THE TIME TO SHARE YOUR VISION WITH US. OUR
          TEAM WILL REVIEW YOUR SUBMISSION AND GET BACK TO YOU AS SOON AS
          POSSIBLE.
        </p>
      </motion.div>
    </main>
  );
}
