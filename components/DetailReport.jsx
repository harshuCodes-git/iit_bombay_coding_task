import React from "react";

const DetailReport = ({ solution }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-4 max-w-full overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Report Details</h2>
      <table className="min-w-full border-collapse border border-gray-300 text-sm sm:text-base">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">
              Parameter
            </th>
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              File ID
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.file_id ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Audio Type
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.audio_type ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Decoded Text
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.decoded_text ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Number of Words
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.no_words ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Number of Deletions
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.no_del ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Number of Insertions
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.no_ins ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Number of Substitutions
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.no_subs ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Number of Miscues
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.no_miscue ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Number of Corrections
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.no_corr ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Words Correct Per Minute (WCPM)
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.wcpm ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Speech Rate
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.speech_rate ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Pronunciation Score
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.pron_score ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Comprehension Score
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.compr_score ?? "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Percent Attempt
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {solution.percent_attempt
                ? `${solution.percent_attempt}%`
                : "N/A"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DetailReport;
