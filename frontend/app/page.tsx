"use client";
import { useState } from "react";

export default function HomePage() {
  const [crop, setCrop] = useState("");
  const [yieldKg, setYieldKg] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crop,
        yield_kg: parseFloat(yieldKg),
        price_per_kg: parseFloat(price),
        disease_confidence: Math.random().toFixed(2)
      }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">🌾 CropXpert</h1>
      <p className="text-gray-600 mb-8">
        Get AI-powered crop insights, profit estimates, and weather forecasts.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Crop Name"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="border p-3 w-full rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Yield (in kg)"
          value={yieldKg}
          onChange={(e) => setYieldKg(e.target.value)}
          className="border p-3 w-full rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Market Price per kg"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-3 w-full rounded-lg"
          required
        />
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
          Estimate Profit
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-green-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold">💰 Estimated Profit</h2>
          <p>Profit: ₹{result.estimated_profit}</p>
          <p>Yield after loss: {result.expected_yield_after_loss} kg</p>
          <p>Loss Percentage: {result.loss_percentage}%</p>
        </div>
      )}
    </div>
  );
}
