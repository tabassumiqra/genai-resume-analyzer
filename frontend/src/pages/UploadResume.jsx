import React, { useState } from "react";
import axios from "axios";

const ResumeUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please upload a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const token = localStorage.getItem("token"); // user’s JWT
      const res = await axios.post("http://localhost:5000/api/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setResult(res.data.analysis);
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">Upload Your Resume</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="border p-2 w-full mb-4 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Analyze Resume
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded text-gray-800">
            <h2 className="text-lg font-medium mb-2">Analysis Result:</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadPage;
