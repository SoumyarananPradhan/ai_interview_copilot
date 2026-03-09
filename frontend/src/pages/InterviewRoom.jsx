import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../api';

export default function InterviewRoom() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [generatingNext, setGeneratingNext] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [displayedFeedback, setDisplayedFeedback] = useState("");

  useEffect(() => {
    api.get(`sessions/${sessionId}/`)
      .then(res => {
        setSession(res.data);
        const questions = res.data.questions || [];
        if (questions.length > 0) {
          const lastIndex = questions.length - 1;
          setCurrentIndex(lastIndex);
          if (questions[lastIndex].response) {
            setFeedback({
              technical_score: questions[lastIndex].response.technical_score,
              communication_score: questions[lastIndex].response.communication_score,
              ai_feedback: questions[lastIndex].response.ai_feedback,
            });
            setAnswer(questions[lastIndex].response.user_answer);
          }
        }
      })
      .catch(err => console.error("Error fetching session:", err));
  }, [sessionId]);

  useEffect(() => {
    if (feedback && feedback.ai_feedback) {
      let i = 0;
      setDisplayedFeedback("");
      const typingInterval = setInterval(() => {
        setDisplayedFeedback(feedback.ai_feedback.slice(0, i));
        i++;
        if (i > feedback.ai_feedback.length) clearInterval(typingInterval);
      }, 10);
      return () => clearInterval(typingInterval);
    }
  }, [feedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEvaluating(true);
    const currentQuestionId = session.questions[currentIndex].id;

    try {
      const res = await api.post('responses/submit_and_evaluate/', {
        question_id: currentQuestionId,
        user_answer: answer
      });
      setFeedback(res.data);
    } catch (err) {
      console.error("Evaluation error:", err);
      alert("Failed to evaluate answer. Check console.");
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = async () => {
    setGeneratingNext(true);
    setFeedback(null);
    setAnswer('');
    
    try {
      const res = await api.post(`sessions/${sessionId}/next_question/`);
      setSession(prev => ({ ...prev, questions: [...prev.questions, res.data] }));
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert("System Error: Failed to generate the next sequence.");
    } finally {
      setGeneratingNext(false);
    }
  };

  if (!session) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-cyan-400 font-mono text-xl animate-pulse">Initializing Terminal...</div>;
  if (!session.questions || session.questions.length === 0 || generatingNext) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-fuchsia-400 font-mono text-xl animate-pulse">Generating Next Scenario...</div>;

  const currentQuestion = session.questions[currentIndex];

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-[0_0_15px_rgba(34,211,238,0.05)] border border-zinc-800 p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800/50">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              {session.target_role} // {session.difficulty}
            </span>
            <span className="text-zinc-500 font-mono text-sm">SYS.SESSION_{sessionId} // SEQUENCE_{currentIndex + 1}</span>
          </div>
          
          <h3 className="text-3xl font-extrabold text-zinc-100 mb-4 tracking-tight leading-tight">{currentQuestion.question_text}</h3>
          <span className="inline-block bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 text-xs px-2 py-1 rounded mb-6 font-mono uppercase">&lt; {currentQuestion.category} /&gt;</span>
          
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute top-3 left-4 flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <textarea className="w-full bg-zinc-950 text-zinc-300 font-mono border border-zinc-800 rounded-xl p-5 pt-10 mb-4 min-h-[200px] text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition resize-y" placeholder="> type your solution here..." value={answer} onChange={(e) => setAnswer(e.target.value)} disabled={evaluating} />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" disabled={evaluating || !answer.trim()} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:-translate-y-1 shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                {evaluating ? "Executing AI Evaluation..." : (feedback ? "Recompile & Resubmit" : "Submit Output")}
              </button>
              {feedback && (
                 <button type="button" onClick={handleNextQuestion} className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-fuchsia-500 hover:to-purple-500 transition-all transform hover:-translate-y-1 shadow-[0_0_15px_rgba(217,70,239,0.4)]">
                  Fetch Next Scenario &rarr;
                </button>
              )}
            </div>
          </form>
        </div>

        {feedback && (
          <div className="bg-zinc-900/80 rounded-2xl p-8 border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.1)] animate-fade-in">
            <h4 className="font-extrabold text-fuchsia-400 text-xl mb-6 flex items-center gap-3 font-mono">
              <span className="animate-pulse">●</span> AI_DIAGNOSTICS
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center flex flex-col justify-center">
                <span className="block text-xs text-zinc-500 font-mono uppercase tracking-widest mb-2">Technical_Score</span>
                <span className={`text-4xl font-black ${feedback.technical_score >= 7 ? 'text-cyan-400 shadow-cyan-400/50 drop-shadow-md' : 'text-yellow-400'}`}>{feedback.technical_score}<span className="text-xl text-zinc-700">/10</span></span>
              </div>
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center flex flex-col justify-center">
                <span className="block text-xs text-zinc-500 font-mono uppercase tracking-widest mb-2">Comm_Score</span>
                <span className={`text-4xl font-black ${feedback.communication_score >= 7 ? 'text-cyan-400 shadow-cyan-400/50 drop-shadow-md' : 'text-yellow-400'}`}>{feedback.communication_score}<span className="text-xl text-zinc-700">/10</span></span>
              </div>
            </div>
            <div className="prose prose-invert prose-zinc max-w-none bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-zinc-300 min-h-[150px]">
              <ReactMarkdown components={{ code({node, inline, className, children, ...props}) { const match = /language-(\w+)/.exec(className || ''); return !inline && match ? ( <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div" className="rounded-lg border border-zinc-700/50 !mt-4 !mb-4" {...props}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter> ) : ( <code className="bg-zinc-800 text-fuchsia-300 px-1.5 py-0.5 rounded-md font-mono text-sm" {...props}>{children}</code> ) } }}>
                {displayedFeedback}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}