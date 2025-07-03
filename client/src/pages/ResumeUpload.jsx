// import { useState } from "react";
// import axios from "axios";

// export default function ResumeUpload() {
//   const [file, setFile] = useState(null);
//   const [parsed, setParsed] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setParsed(null);
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Please upload a resume");
//     const formData = new FormData();
//     formData.append("resume", file);

//     try {
//       setLoading(true);
//       const res = await axios.post("http://localhost:5000/api/upload-resume", formData);
//       setParsed(res.data);
//     } catch (err) {
//       alert("Failed to upload resume");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//       <div className="bg-white rounded-xl shadow p-8 max-w-lg w-full">
//         <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={handleFileChange}
//           className="mb-4"
//         />
//         <button
//           onClick={handleUpload}
//           className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg"
//         >
//           {loading ? "Parsing..." : "Upload & Parse"}
//         </button>

//         {parsed && (
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold mb-2">Parsed Resume Info:</h3>
//             <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
//               {JSON.stringify(parsed, null, 2)}
//             </pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// src/pages/ResumeUpload.jsx
import React, { useState } from "react";
import axios from "axios";

const ResumeUploader = ({ user }) => {
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5001/api/upload-resume", formData, {
        headers: {
          "x-user-id": user.uid,
        },
      });
      setParsed(res.data);
      setMatches([]); // Clear previous matches
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("resume", file);

    try {
      setMatching(true);
      const res = await axios.post("http://localhost:8000/match-resume", formData);
      setMatches(res.data);
    } catch (err) {
      alert("Matching failed");
      console.error(err);
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow w-full">
      <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <div className="flex gap-4">
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Uploading..." : "Upload & Parse"}
        </button>
        <button
          onClick={handleMatch}
          disabled={matching}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          {matching ? "Matching..." : "Match to Jobs"}
        </button>
      </div>

      {parsed && (
        <div className="mt-6">
          <h3 className="font-semibold">Parsed Info:</h3>
          <p><strong>Name:</strong> {parsed.name}</p>
          <p><strong>Email:</strong> {parsed.email}</p>
          <p><strong>Experience:</strong> {parsed.experience}</p>
          <p><strong>Skills:</strong> {parsed.skills.join(", ")}</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Top Matching Jobs:</h3>
          <ul className="list-disc list-inside">
            {matches.map((job, i) => (
              <li key={i}>
                <strong>{job.title}</strong> - {job.skills?.join(", ") || "No skills listed"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
