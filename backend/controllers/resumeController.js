import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const resumeText = fs.readFileSync(filePath, "utf-8");

    // Google API endpoint
    const url = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";

    const response = await axios.post(
      url,
      {
        prompt: `Analyze this resume:\n${resumeText}`,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GOOGLE_AI_KEY}`,
        },
      }
    );

    // Google API returns output in response.data.candidates[0].output
    const analysis = response.data?.candidates?.[0]?.output || "No analysis returned";

    fs.unlinkSync(filePath); // delete file
    res.json({ analysis });
  } catch (error) {
    console.error("Resume analysis error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error analyzing resume", error: error.message });
  }
};
