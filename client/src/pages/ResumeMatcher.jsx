import React, { useState } from "react";
import axios from "axios";

const ResumeMatcher = ({ resumeId }) => {
  const [file, setFile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!file) return alert("Please select a resume PDF to match");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("resumeId", resumeId); // optional if handled via POST body

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/match-resume", formData);
      setMatches(res.data.matches);
    } catch (err) {
      console.error("Matching error:", err);
      alert("Failed to match resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold">Match Resume to Jobs</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full border rounded p-2"
      />
      <button
        onClick={handleMatch}
        disabled={loading}
        className="bg-indigo-600 w-full text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        {loading ? "Matching..." : "Match Resume"}
      </button>

      {matches.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Top Job Matches:</h3>
          <ul className="space-y-2">
            {matches.map((match, idx) => (
              <li key={idx} className="border p-3 rounded bg-gray-50">
                <strong>{match.job.title}</strong> ({match.score * 100}% match)<br />
                {match.job.description.slice(0, 100)}...
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeMatcher;
