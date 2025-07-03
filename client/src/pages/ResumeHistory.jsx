// pages/ResumeHistory.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState({});
  const [loadingMatch, setLoadingMatch] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const res = await axios.get("http://localhost:5001/api/my-resumes", {
            headers: { "x-user-id": u.uid },
          });
          setResumes(res.data);
        } catch (err) {
          console.error("Error fetching resumes", err);
        }
      }
    });
  }, []);

  const handleMatch = async (resumeId) => {
    const resume = resumes.find((r) => r.id === resumeId);
    if (!resume) return;

    try {
      setLoadingMatch(resumeId);

      // Create a mock PDF from skills + description (for now)
      const fakePDF = new Blob(
        [
          `Name: ${resume.name}\nEmail: ${resume.email}\nSkills: ${resume.skills.join(
            ", "
          )}\nExperience: ${resume.experience}`,
        ],
        { type: "application/pdf" }
      );

      const formData = new FormData();
      formData.append("file", fakePDF, "resume.pdf");

      const res = await axios.post("http://localhost:8000/match-resume", formData);
      setMatches((prev) => ({ ...prev, [resumeId]: res.data.matches }));
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setLoadingMatch(null);
    }
    const handleDelete = async (resumeId) => {
  if (!window.confirm("Are you sure you want to delete this resume?")) return;

  try {
    await axios.delete(`http://localhost:5001/api/resume/${resumeId}`, {
      headers: { "x-user-id": user.uid },
    });
    setResumes(resumes.filter((r) => r.id !== resumeId));
  } catch (err) {
    console.error("Failed to delete resume", err);
    alert("Error deleting resume");
  }
};

  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Resume History & Matches</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {resumes.map((resume) => (
          <div key={resume.id} className="bg-white p-4 rounded shadow">
            <p><strong>Name:</strong> {resume.name}</p>
            <p><strong>Email:</strong> {resume.email}</p>
            <p><strong>Skills:</strong> {resume.skills.join(", ")}</p>
            <p><strong>Experience:</strong> {resume.experience}</p>

            <button
              onClick={() => handleMatch(resume.id)}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              {loadingMatch === resume.id ? "Matching..." : "Match Jobs"}
            </button>
            <button
  onClick={() => handleDelete(resume.id)}
  className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
>
  Delete
</button>


            {matches[resume.id] && (
              <div className="mt-4">
                <h4 className="font-semibold">Top Matches:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {matches[resume.id].map((m, i) => (
                    <li key={i}>
                      <strong>{m.job.title}</strong> ({m.score * 100}% match)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
