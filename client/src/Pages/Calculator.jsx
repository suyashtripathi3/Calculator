import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function Calculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [sciMode, setSciMode] = useState(false);

  const clickSound = useRef(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("calcHistory");
    const savedInput = localStorage.getItem("calcInput");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedInput) setInput(savedInput);

    clickSound.current = new Audio(
      "https://www.fesliyanstudios.com/play-mp3/387"
    );
    clickSound.current.volume = 0.3;
  }, []);

  useEffect(() => {
    localStorage.setItem("calcHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("calcInput", input);
  }, [input]);

  const playSound = () => {
    if (!clickSound.current) return;
    clickSound.current.currentTime = 0;
    clickSound.current.play().catch(() => {});
  };

  const handleClick = (value) => {
    playSound();
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    playSound();
    setInput("");
  };

  const handleDelete = () => {
    playSound();
    setInput(input.slice(0, -1));
  };

  const handleEvaluate = () => {
    playSound();
    try {
      let exp = input
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, Math.PI)
        .replace(/e/g, Math.E)
        .replace(/\^/g, "**")
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/log\(/g, "Math.log10(");

      const result = eval(exp);
      setHistory([
        { id: Date.now(), exp: input, res: result.toString() },
        ...history,
      ]);
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  };

  const handleClearHistory = () => {
    playSound();
    setHistory([]);
    localStorage.removeItem("calcHistory");
  };

  const normalButtons = [
    ["C", "DEL", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const sciButtons = [
    ["sin(", "cos(", "tan(", "√("],
    ["log(", "π", "e", "^"],
  ];

  return (
    <div className="relative flex justify-center items-center h-screen w-screen bg-gradient-to-br from-black via-green-950 to-black text-green-400 overflow-hidden">
      {/* Floating neon particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-70"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{ duration: Math.random() * 8 + 5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Calculator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative z-10 backdrop-blur-md bg-black/70 border border-green-400/40 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,255,0,0.5)] ${
          sciMode ? "w-[460px]" : "w-[400px]"
        }`}
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-center text-3xl font-mono mb-4 tracking-widest text-green-400 drop-shadow-lg"
        >
          Calculator_⚡
        </motion.h2>

        {/* Mode Toggle */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono">
            Mode: {sciMode ? "Scientific" : "Normal"}
          </span>
          <button
            onClick={() => {
              playSound();
              setSciMode(!sciMode);
            }}
            className="px-3 py-1 bg-green-600/70 hover:bg-green-500 rounded-lg font-mono text-sm"
          >
            Toggle
          </button>
        </div>

        {/* Input */}
        <motion.input
          type="text"
          value={input}
          readOnly
          className="w-full border border-green-400/40 rounded-lg px-3 py-3 text-right text-2xl font-mono bg-black/50 text-green-300 shadow-inner mb-4"
        />

        {/* Buttons */}
        <div
          className={`grid gap-3 mb-5 ${
            sciMode ? "grid-cols-5" : "grid-cols-4"
          }`}
        >
          {(sciMode
            ? sciButtons.flat().concat(normalButtons.flat())
            : normalButtons.flat()
          ).map((btn, index) => (
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 20px #00ff00",
                boxShadow: "0 0 20px rgba(0,255,0,0.7)",
              }}
              key={index}
              onClick={() => {
                if (btn === "C") handleClear();
                else if (btn === "DEL") handleDelete();
                else if (btn === "=") handleEvaluate();
                else handleClick(btn);
              }}
              className={`py-4 rounded-lg text-lg font-bold transition-all duration-200 border border-green-400/40 ${
                btn === "="
                  ? "col-span-2 bg-green-600/80 text-black hover:bg-green-500"
                  : btn === "C"
                  ? "bg-red-600/70 text-white hover:bg-red-500"
                  : btn === "DEL"
                  ? "bg-yellow-500/70 text-black hover:bg-yellow-400"
                  : "bg-green-800/50 text-green-300 hover:bg-green-700/60"
              }`}
            >
              {btn}
            </motion.button>
          ))}
        </div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black/40 border border-green-400/20 rounded-lg p-3 h-[140px] overflow-y-auto text-sm font-mono text-green-300
             scrollbar-thin scrollbar-thumb-green-400/80 scrollbar-track-black/50 hover:scrollbar-thumb-green-600/90"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-green-500 underline">History</p>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-2 py-1 bg-red-600/70 hover:bg-red-500 text-white rounded text-xs"
              >
                Clear All
              </button>
            )}
          </div>
          {history.length === 0 && (
            <p className="text-green-600">No calculations yet...</p>
          )}
          {history.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between border-b border-green-600/20 py-1"
            >
              <span className="overflow-x-auto">{item.exp}</span>
              <span className="font-bold ml-2">= {item.res}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Calculator;
