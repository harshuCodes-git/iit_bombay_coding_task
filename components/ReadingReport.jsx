import React from "react";

const ReadingReport = ({ solution, renderDecodedText }) => {
  if (!solution) return null;

  return (
    <>
      <div id="generated-report" className="mt-8">
        <h2>Reading Report</h2>
        <p>
          <strong>Decoded Text:</strong> {solution.decoded_text}
        </p>
        <p>
          <strong>Words Correct Per Minute (WCPM):</strong> {solution.wcpm}
        </p>
        <p>
          <strong>Pronunciation Score:</strong> {solution.pron_score}
        </p>
        <p>
          <strong>Speech Rate:</strong> {solution.speech_rate}
        </p>
        <p>
          <strong>Correct Words:</strong> {solution.no_corr}
        </p>
        <p>
          <strong>Miscues:</strong> {solution.no_miscue}
        </p>
        <p>
          <strong>Percent Attempted:</strong> {solution.percent_attempt}%
        </p>
        {renderDecodedText(solution.decoded_text, solution.word_scores)}
      </div>

      <div className="min-h-screen bg-white p-8">
        <div className="max-w-3xl mx-auto bg-gray-100 shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Amazon School of Languages
          </h1>
          <div className="flex justify-between text-purple-600 mb-4">
            <span>
              Student Name: <strong>Shahrukh</strong>
            </span>
            <span>
              Story Name: <strong>Dams</strong>
            </span>
            <span>
              Report Time: <strong>16-03-2024 14:20:43</strong>
            </span>
          </div>
          <p className="bg-white p-4 rounded-md shadow-md leading-6 text-gray-800">
            a dam is a <span className="text-orange-500">wall</span> across a
            river when it rains a lot <span className="text-red-500">lost</span>{" "}
            of water goes down the river and into the sea the dam to stops the
            water the water then{" "}
            <span className="text-orange-500">becomes</span> a big lake{" "}
            <span className="text-green-500">lake</span> be_in(
            <span className="text-orange-500">behind</span>) built the dam later
            this water is let out into the fields there it helps crops like rice
            to grow
          </p>
          <button className="bg-purple-400 text-white py-2 px-4 rounded-md shadow-md mt-4 hover:bg-purple-500 transition">
            Play Audio
          </button>
          <table className="mt-6 w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">WCPM</th>
                <th className="border border-gray-300 px-4 py-2">
                  Speech Rate
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">24</td>
                <td className="border border-gray-300 px-4 py-2">3.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReadingReport;
