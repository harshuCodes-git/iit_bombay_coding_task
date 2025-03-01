import React, { useRef, useState } from "react";
import { Play, Pause, Download } from "lucide-react"; // Using lucide-react icons
import { Button } from "@/components/ui/button"; // Adjust this import based on your project structure

export const AudioPlayer = ({ audioFile }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadAudio = () => {
    const link = document.createElement("a");
    link.href = audioFile;
    link.download = "audio.mp3"; // You can change the file name here
    link.click();
  };

  return (
    <div className="flex items-center justify-center space-x-3">
      {!audioFile ? (
        <div>Not uploaded</div>
      ) : (
        <>
          <button
            onClick={togglePlay}
            className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => {
              const url = downloadAudio(); 
              if (url) {
                window.open(url, "_blank"); // Opens in a new tab
              }
            }}
            className="p-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition duration-300"
          >
            <Download size={24}/>
          </button>

          <audio
            ref={audioRef}
            src={audioFile}
            type="audio/mpeg"
            onEnded={() => setIsPlaying(false)}
          />
        </>
      )}
    </div>
  );
};
