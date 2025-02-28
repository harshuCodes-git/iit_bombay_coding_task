import React from "react";

const ReadingReport = ({ solution}) => {
  if (!solution) return null;

  const reportSolution = solution.mainReport;

  const renderAudioOrPlaceholder = (audioFile) => {
    if (!audioFile) {
      return <div>Not uploaded</div>;
    }
    return (
      <div className="flex w-30">
        <audio controls>
          <source src={audioFile} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  };

  // Function to display decoded text with color coding
  const renderDecodedText = (decodedText, wordScores) => {
    const scoreMap = {};
    wordScores.forEach(([word, score]) => {
      scoreMap[word.toLowerCase()] = score;
    });

    const words = decodedText.split(" ");
    return words.map((word, index) => {
      const score = scoreMap[word.toLowerCase()] || 0;
      let className = "";

      if (score === 1) {
        className = "text-green-600";
      } else if (score >= 0.6) {
        className = "text-orange-500";
      } else {
        className = "text-gray-900 line-through";
      }

      return (
        <span key={index} className={`${className}  `}>
          {word}
        </span>
      );
    });
  };

  return (
    <>
      <div>
        <div className="max-w-4xl mx-auto w-full bg-white shadow-2xl rounded-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-8 text-purple-700">
            Amazon School of Languages
          </h1>
          <div className="flex justify-between text-black text-lg mb-6">
            <span className="">
              Student Name:{" "}
              <strong className="text-purple-600">
                {solution.StudentName}
              </strong>
            </span>
            <span>
              Story Name:{" "}
              <strong className="text-purple-600">{solution.Story}</strong>
            </span>
            <span>
              Report Time:{" "}
              <strong className="text-purple-600">
                {solution.apiCallTime}
              </strong>
            </span>
          </div>
          <p className="flex flex-wrap gap-1 leading-relaxed text-lg font-semibold">
            {renderDecodedText(
              reportSolution.decoded_text,
              reportSolution.word_scores
            )}
          </p>

          <button className="bg-purple-600 text-white py-3 px-6 rounded-lg shadow-lg mt-6 hover:bg-purple-700 transition text-lg">
            {renderAudioOrPlaceholder(solution.audioFile)}
          </button>
          <table className="mt-8 w-full text-center border-collapse text-lg">
            <thead>
              <tr>
                <th className="border border-gray-300 px-6 py-4">WCPM</th>
                <th className="border border-gray-300 px-6 py-4"> Speech Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-6 py-4">
                  {reportSolution.wcpm}
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  {reportSolution.speech_rate}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReadingReport;
