
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import JobForm from "../components/JobForm";
import JobCard from "../components/JobCard";
import ResumeUploader from "../components/ResumeUploader";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/login");
      } else {
        setUser(u);
        try {
          const res = await axios.get("http://localhost:5001/api/jobs");
          setJobs(res.data);
        } catch (err) {
          console.error("Failed to fetch jobs", err);
        }
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const addJob = async (jobData) => {
    try {
      const res = await axios.post("http://localhost:5001/api/jobs", jobData, {
        headers: {
          "x-user-id": user.uid,
        },
      });
      setJobs([res.data, ...jobs]);
      setShowForm(false);
    } catch (err) {
      alert("Failed to post job");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Dashboard</h1>
        <button
  onClick={() => navigate("/resume-history")}
  className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-900"
>
  Resume History
</button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

      {/* Card Layout: Resume Upload & Post Job */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resume Upload Card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Upload Resume</h2>
          <ResumeUploader />
        </div>

        {/* Job Post Card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-indigo-600">Post a Job</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {showForm ? "Close" : "+ Post Job"}
            </button>
          </div>
          {showForm && <JobForm onSubmit={addJob} onCancel={() => setShowForm(false)} />}
        </div>
      </div>

      {/* Job Listings */}
      <div className="bg-white p-6 mt-8 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-indigo-600 mb-4">All Posted Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job, i) => (
              <JobCard key={i} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
