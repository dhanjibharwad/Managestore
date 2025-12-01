// app/(technician)/job-report/page.tsx
"use client";

import { useState } from "react";

export default function JobReportPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/technician/job-report", {
      method: "POST",
      body: JSON.stringify({
        jobId: e.target.jobId.value,
        description: e.target.description.value,
        amount: e.target.amount.value,
      }),
    });

    setLoading(false);
    alert("Report Submitted!");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Submit Job Report</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl max-w-xl p-6 space-y-4"
      >
        <div>
          <label className="text-sm font-medium">Job ID</label>
          <input
            name="jobId"
            className="w-full border rounded-lg px-3 py-2 mt-1"
            placeholder="Enter Job ID"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Report Description</label>
          <textarea
            name="description"
            className="w-full border rounded-lg px-3 py-2 mt-1"
            rows={4}
            placeholder="Describe the work done"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Amount</label>
          <input
            name="amount"
            type="number"
            className="w-full border rounded-lg px-3 py-2 mt-1"
            placeholder="Charge Amount"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
