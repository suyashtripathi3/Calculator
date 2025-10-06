import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

function Calculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [sciMode, setSciMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
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
    // Scientific functions + clear/delete
    ["C", "DEL", "sin(", "cos(", "tan(", "√("],
    ["log(", "ln(", "^", "e", "π", "EXP"],

    // Brackets + basic operators
    ["(", ")", "÷", "×"],

    // Numbers + operators
    ["7", "8", "9", "-", "+", "%", ".", "4", "5", "6"],

    // Equal button (span full row in grid)
    ["="],
    ["0", "1", "2", "3"],
  ];

  return (
    <div className="relative flex justify-center items-center h-screen w-screen bg-gradient-to-br from-black via-green-950 to-black text-green-400 overflow-hidden">
      {/* Floating particles */}
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
          sciMode ? "w-[450px] py-4" : "w-[400px] py-6"
        }`}
      >
        {/* Hamburger */}
        <button
          onClick={() => setShowHistory(true)}
          className="absolute top-4 right-4 text-green-400 hover:text-green-200 cursor-pointer"
        >
          <Menu size={26} />
        </button>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-center text-3xl font-mono mb-4 tracking-widest text-green-400 drop-shadow-lg"
        >
          Calculator⚡
        </motion.h2>

        {/* Mode Toggle */}
        <div className="flex justify-between items-center mb-5 mt-1">
          <span className="font-mono text-green-300 text-base tracking-wide">
            Mode: {sciMode ? "Scientific" : "Normal"}
          </span>
          <button
            onClick={() => {
              playSound();
              setSciMode(!sciMode);
            }}
            className="px-3 py-1.5 bg-green-600/70 hover:bg-green-500 rounded-lg font-mono text-sm cursor-pointer shadow-[0_0_8px_rgba(0,255,0,0.4)] transition-all"
          >
            Toggle
          </button>
        </div>

        {/* Input */}
        <motion.input
          type="text"
          value={input}
          readOnly
          className="w-full border border-green-400/40 rounded-lg px-3 py-2 text-right text-2xl font-mono bg-black/50 text-green-300 shadow-inner mb-4"
        />

        {/* Buttons */}
        <div
          className={`grid gap-2 mb-3 ${
            sciMode ? "grid-cols-7" : "grid-cols-4"
          }`}
        >
          {(sciMode ? sciButtons.flat() : normalButtons.flat()).map(
            (btn, index) => (
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
                className={`py-4 rounded-lg text-lg font-bold transition-all duration-200 border border-green-400/40 cursor-pointer ${
                  btn === "C"
                    ? sciMode
                      ? "bg-red-600/70 col-span-2 text-white hover:bg-red-500"
                      : "bg-red-600/70 text-white hover:bg-red-500"
                    : btn === "DEL"
                    ? sciMode
                      ? "bg-yellow-500/70 col-span-2 text-black hover:bg-yellow-400"
                      : "bg-yellow-500/70 text-black hover:bg-yellow-400"
                    : btn === "="
                    ? sciMode
                      ? "bg-green-600/80 col-span-3 text-black hover:bg-green-500"
                      : "bg-green-600/80 col-span-2 text-black hover:bg-green-500"
                    : "bg-green-800/50 text-green-300 hover:bg-green-700/60"
                }`}
              >
                {btn}
              </motion.button>
            )
          )}
        </div>
      </motion.div>

      {/* History Overlay */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-20"
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-black/70 border border-green-400/40 rounded-xl p-6 w-[550px] max-h-[70vh] overflow-y-auto shadow-[0_0_20px_rgba(0,255,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-mono text-green-400 underline">
                  History
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-green-400 hover:text-green-200 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="w-full mb-3 py-1 bg-red-600/70 hover:bg-red-500 rounded text-white font-mono text-sm cursor-pointer"
                >
                  Clear All
                </button>
              )}

              {history.length === 0 ? (
                <p className="text-green-500 font-mono">
                  No calculations yet...
                </p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b border-green-600/20 py-1 text-sm font-mono"
                  >
                    <span className="overflow-x-auto">{item.exp}</span>
                    <span className="font-bold ml-2">= {item.res}</span>
                  </div>
                ))
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Calculator;
