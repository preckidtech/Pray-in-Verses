import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [prayers, setPrayers] = useState([]);
  const [newPrayer, setNewPrayer] = useState({ title: "", content: "", category: "General", tags: [] });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("prayers")) || [];
    setPrayers(stored);
  }, []);

  const addPrayer = () => {
    const updated = [...prayers, { ...newPrayer, id: Date.now(), timeAgo: "Just now", likes: 0, saves: 0 }];
    setPrayers(updated);
    localStorage.setItem("prayers", JSON.stringify(updated));
    setNewPrayer({ title: "", content: "", category: "General", tags: [] });
  };

  const deletePrayer = (id) => {
    const updated = prayers.filter(p => p.id !== id);
    setPrayers(updated);
    localStorage.setItem("prayers", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <input
          type="text"
          placeholder="Prayer Title"
          value={newPrayer.title}
          onChange={e => setNewPrayer({ ...newPrayer, title: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Prayer Content"
          value={newPrayer.content}
          onChange={e => setNewPrayer({ ...newPrayer, content: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <button onClick={addPrayer} className="px-4 py-2 bg-blue-600 text-white rounded">Add Prayer</button>
      </div>

      <h2 className="text-xl font-semibold mb-4">All Prayers</h2>
      <ul>
        {prayers.map(p => (
          <li key={p.id} className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2">
            <span>{p.title}</span>
            <button onClick={() => deletePrayer(p.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
