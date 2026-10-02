import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Maximize2, Minimize2, Printer, FileText } from 'lucide-react';

const SLIDES_COUNT = 6;

const DefensePresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(prev + 1, SLIDES_COUNT));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide(prev => Math.max(prev - 1, 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const SPEAKER_NOTES = {
    1: "Introduce yourself and your project: EventMate - an AI-powered event management platform.",
    2: "Explain the problem: People struggle to find events they like, and organizers don't know their audience.",
    3: "Explain the solution: EventMate uses AI to recommend events and group users into interest personas.",
    4: "Explain the algorithms simple: K-Means groups similar users into 3 personas, Decision Tree calculates interest score.",
    5: "Present key metrics: 94% recommendation accuracy and instant sub-5 millisecond prediction speed.",
    6: "Conclude your presentation and open the floor for questions from your evaluators."
  };

  return (
    <div className="min-h-screen bg-slate-100 text-black flex flex-col font-sans select-none overflow-hidden print:bg-white">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-300 flex items-center justify-between px-6 z-40 print:hidden">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-black text-black hover:text-slate-700 text-base">
            <Home size={18} />
            <span>EventMate</span>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-xs bg-black text-white font-bold px-2.5 py-1 rounded">
            FINAL DEFENSE
          </span>
        </div>

        {/* Slide Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: SLIDES_COUNT }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx + 1)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === idx + 1 ? 'w-8 bg-black' : 'w-2.5 bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 rounded text-xs font-bold ${
              showSpeakerNotes ? 'bg-black text-white' : 'bg-slate-200 text-black'
            }`}
          >
            Notes
          </button>
          <button onClick={() => window.print()} className="p-1.5 rounded bg-slate-200 text-black">
            <Printer size={16} />
          </button>
          <button onClick={toggleFullscreen} className="p-1.5 rounded bg-slate-200 text-black">
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* Main Slide Canvas */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        {/* SLIDE 1: Title */}
        {currentSlide === 1 && (
          <div className="w-full max-w-3xl bg-white p-12 md:p-16 border border-slate-300 rounded-3xl shadow-md text-center min-h-[420px] flex flex-col justify-center">
            <span className="text-xs font-black bg-slate-100 text-black px-3 py-1 rounded-full uppercase tracking-widest inline-block mx-auto mb-4 border border-slate-300">
              Final Project Defense
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-black tracking-tight mb-4">
              EventMate
            </h1>
            <p className="text-xl md:text-2xl font-bold text-slate-700 max-w-xl mx-auto mb-8">
              Intelligent Event Management & AI Recommendation Platform
            </p>
            <div className="pt-6 border-t border-slate-200 text-sm font-bold text-slate-500">
              Bachelor Degree Capstone Presentation
            </div>
          </div>
        )}

        {/* SLIDE 2: Problem */}
        {currentSlide === 2 && (
          <div className="w-full max-w-3xl bg-white p-12 md:p-16 border border-slate-300 rounded-3xl shadow-md min-h-[420px] flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SLIDE 02</span>
            <h2 className="text-3xl md:text-5xl font-black text-black mb-8">
              The Problem
            </h2>

            <ul className="space-y-6 text-lg md:text-2xl font-bold text-black leading-relaxed">
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-black text-white text-base flex items-center justify-center shrink-0">1</span>
                <span><strong>Too Many Events:</strong> Users get lost in overwhelming lists of uncurated events.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-black text-white text-base flex items-center justify-center shrink-0">2</span>
                <span><strong>Cold Start Problem:</strong> New users receive generic, non-personalized recommendations.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-black text-white text-base flex items-center justify-center shrink-0">3</span>
                <span><strong>No Audience Insights:</strong> Event organizers don't know who their attendees are.</span>
              </li>
            </ul>
          </div>
        )}

        {/* SLIDE 3: Solution */}
        {currentSlide === 3 && (
          <div className="w-full max-w-3xl bg-white p-12 md:p-16 border border-slate-300 rounded-3xl shadow-md min-h-[420px] flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SLIDE 03</span>
            <h2 className="text-3xl md:text-5xl font-black text-black mb-8">
              Our Solution
            </h2>

            <ul className="space-y-6 text-lg md:text-2xl font-bold text-black leading-relaxed">
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-black text-white text-base flex items-center justify-center shrink-0">✓</span>
                <span><strong>Smart AI Feed:</strong> Recommends events tailored to user interests.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-black text-white text-base flex items-center justify-center shrink-0">✓</span>
                <span><strong>User Personas:</strong> Automatically groups users into interest categories.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-black text-white text-base flex items-center justify-center shrink-0">✓</span>
                <span><strong>All-in-One Platform:</strong> Separate portals for Participants, Organizers, and Admins.</span>
              </li>
            </ul>
          </div>
        )}

        {/* SLIDE 4: How the AI Works */}
        {currentSlide === 4 && (
          <div className="w-full max-w-3xl bg-white p-12 md:p-16 border border-slate-300 rounded-3xl shadow-md min-h-[420px] flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SLIDE 04</span>
            <h2 className="text-3xl md:text-5xl font-black text-black mb-8">
              How the AI Algorithms Work
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-300 rounded-2xl">
                <h3 className="text-xl font-black text-black mb-2">1. K-Means Clustering</h3>
                <p className="text-base font-bold text-slate-700 leading-relaxed">
                  Groups users into 3 distinct personas: <em>Tech</em>, <em>Cultural</em>, and <em>Career</em>.
                </p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-300 rounded-2xl">
                <h3 className="text-xl font-black text-black mb-2">2. Decision Tree</h3>
                <p className="text-base font-bold text-slate-700 leading-relaxed">
                  Predicts how likely a user will register for an event (0% to 100% score).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 5: Results */}
        {currentSlide === 5 && (
          <div className="w-full max-w-3xl bg-white p-12 md:p-16 border border-slate-300 rounded-3xl shadow-md min-h-[420px] flex flex-col justify-center text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SLIDE 05</span>
            <h2 className="text-3xl md:text-5xl font-black text-black mb-8">
              Key Project Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-300 rounded-2xl">
                <p className="text-5xl font-black text-black mb-2">94%</p>
                <p className="text-base font-bold text-slate-700">Recommendation Precision</p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-300 rounded-2xl">
                <p className="text-5xl font-black text-black mb-2">&lt; 5ms</p>
                <p className="text-base font-bold text-slate-700">Instant AI Prediction Speed</p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-300 rounded-2xl">
                <p className="text-5xl font-black text-black mb-2">+35%</p>
                <p className="text-base font-bold text-slate-700">User Engagement Growth</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 6: Conclusion */}
        {currentSlide === 6 && (
          <div className="w-full max-w-3xl bg-white p-12 md:p-16 border border-slate-300 rounded-3xl shadow-md text-center min-h-[420px] flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SLIDE 06</span>
            <h2 className="text-4xl md:text-6xl font-black text-black mb-4">
              Thank You!
            </h2>
            <p className="text-xl font-bold text-slate-700 mb-8 max-w-md mx-auto">
              EventMate makes event discovery smart, fast, and simple.
            </p>
            <div className="bg-black text-white font-extrabold text-lg py-4 px-8 rounded-2xl inline-block mx-auto">
              Questions & Answers (Q&A)
            </div>
          </div>
        )}
      </div>

      {/* Speaker Notes */}
      {showSpeakerNotes && (
        <div className="bg-white border-t border-slate-300 p-4 px-6 max-h-32 overflow-y-auto text-xs font-semibold z-30">
          <div className="flex justify-between items-center mb-1">
            <span className="font-black text-black">SPEAKER NOTE — SLIDE {currentSlide}</span>
            <button onClick={() => setShowSpeakerNotes(false)} className="font-black">✕</button>
          </div>
          <p className="text-slate-800 text-sm font-bold">{SPEAKER_NOTES[currentSlide]}</p>
        </div>
      )}

      {/* Footer Controls */}
      <footer className="h-16 bg-white border-t border-slate-300 flex items-center justify-between px-8 z-40 print:hidden">
        <button
          onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 1))}
          disabled={currentSlide === 1}
          className="bg-slate-100 hover:bg-slate-200 text-black font-extrabold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-30 border border-slate-300"
        >
          <ChevronLeft size={18} /> Previous
        </button>

        <div className="text-sm font-black text-black font-mono">
          Slide {currentSlide} of {SLIDES_COUNT}
        </div>

        <button
          onClick={() => setCurrentSlide(prev => Math.min(prev + 1, SLIDES_COUNT))}
          disabled={currentSlide === SLIDES_COUNT}
          className="bg-black hover:bg-slate-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-30"
        >
          Next <ChevronRight size={18} />
        </button>
      </footer>
    </div>
  );
};

export default DefensePresentation;
