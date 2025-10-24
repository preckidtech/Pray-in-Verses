import React from "react";
import { api } from "../api";

export default function Dashboard() {
  const [counts, setCounts] = React.useState(null);
  React.useEffect(() => {
    // light count fetch via admin list endpoints
    Promise.all([
      api.listCurated(undefined, "DRAFT", undefined, 1),
      api.listCurated(undefined, "REVIEW", undefined, 1),
      api.listCurated(undefined, "PUBLISHED", undefined, 1),
      api.listCurated(undefined, "ARCHIVED", undefined, 1),
    ]).then(([d,r,p,a]) => {
      setCounts({
        draft: (d?.data?.length ?? 0),
        review: (r?.data?.length ?? 0),
        published: (p?.data?.length ?? 0),
        archived: (a?.data?.length ?? 0),
      });
    });
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        {["draft","review","published","archived"].map((k) => (
          <div key={k} className="border rounded-lg p-4 bg-white">
            <div className="text-sm uppercase text-gray-500">{k}</div>
            <div className="text-2xl font-semibold">{counts?.[k] ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
