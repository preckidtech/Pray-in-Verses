import React from "react";
import { usePrayerStore } from "../store";
import Button from "../components/ui/Button";
import PrayerStreakCard from "../components/ui/PrayerStreakCard";

const GuidedPrayer = () => {
  const { step, nextStep, prevStep } = usePrayerStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Guided Prayer</h2>
        <PrayerStreakCard />
      </div>

      <div className="bg-white p-6 rounded shadow-sm text-center">
        <p className="mb-4">Step {step} of 3</p>
        {step === 1 && <p className="mb-4">Be still, and know that I am God (Psalm 46:10)</p>}
        {step === 2 && <ul className="list-disc list-inside text-left mx-auto max-w-md"><li>Pray for peace</li><li>Pray for strength</li></ul>}
        {step === 3 && <p className="italic">I declare I am strong in the Lord.</p>}

        <div className="flex justify-between mt-6 max-w-md mx-auto">
          <Button variant="secondary" onClick={prevStep}>Back</Button>
          <Button onClick={nextStep}>Next</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Morning Prayer","Evening Prayer","Gratitude Prayer","Healing Prayer"].map((p,i)=>(
          <div key={i} className="bg-white p-4 rounded shadow-sm">
            <h4 className="font-semibold">{p}</h4>
            <p className="text-sm text-gray-600 mt-2">Short description.</p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">Start Prayer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuidedPrayer;
