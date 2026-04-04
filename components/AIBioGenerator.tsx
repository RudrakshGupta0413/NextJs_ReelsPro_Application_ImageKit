"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Send, CheckCircle2, RefreshCw, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const COMMON_EMOJIS = ["✨", "🚀", "🔥", "🎨", "💻", "💼", "🎮", "📸", "🌍", "🍕", "🎭", "💡", "💪", "🌱", "🌈", "🕊️"];

interface AIBioGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bio: string) => void;
  currentBio?: string;
}

export default function AIBioGenerator({
  isOpen,
  onClose,
  onSelect,
  currentBio = "",
}: AIBioGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const generateBio = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setIsLoading(true);
    setSuggestions([]);
    setSelectedIdx(null);

    try {
      const res = await fetch("/api/ai/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to generate bios");

      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      toast.error("AI Generation failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = () => {
    if (selectedIdx !== null && suggestions[selectedIdx]) {
      onSelect(suggestions[selectedIdx]);
      onClose();
      // Reset state for next use
      setPrompt("");
      setSuggestions([]);
      setSelectedIdx(null);
    }
  };

  const addEmoji = (emoji: string) => {
    setPrompt(prev => prev + emoji);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden bg-white/95 backdrop-blur-xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
            AI Bio Generator
          </DialogTitle>
          <DialogDescription>
            Tell AI what kind of bio you want, and let the magic happen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Chat-style Input */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-15 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <Textarea
                placeholder="Ex: 'Professional developer who loves sci-fi and cat emojis...'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] border-none focus-visible:ring-0 resize-none rounded-none p-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    generateBio();
                  }
                }}
              />
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-white/80 backdrop-blur-md border-slate-200 shadow-xl rounded-xl">
                      <div className="grid grid-cols-4 gap-1">
                        {COMMON_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addEmoji(emoji)}
                            className="h-10 w-10 flex items-center justify-center hover:bg-blue-50 rounded-lg transition-colors text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Gemini AI Powered
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={generateBio}
                  disabled={isLoading || !prompt.trim()}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Suggestions Area */}
          <AnimatePresence mode="wait">
            {suggestions.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Choose your vibe
                  </h4>
                  <button
                    onClick={generateBio}
                    className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>
                {suggestions.map((suggestion, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <button
                      onClick={() => setSelectedIdx(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group ${
                        selectedIdx === idx
                          ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/20"
                          : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      <p className="text-sm leading-relaxed pr-6">{suggestion}</p>
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">
                          {suggestion.length}/200
                        </span>
                        {selectedIdx === idx && (
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </button>
                  </motion.div>
                ))}

                <Button
                  onClick={handleSelect}
                  disabled={selectedIdx === null}
                  className="w-full mt-4 bg-slate-900 hover:bg-black text-white font-semibold py-6 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  Apply this Bio
                </Button>
              </motion.div>
            ) : isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 italic">
                <div className="relative mb-4">
                   <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                   <Sparkles className="w-8 h-8 text-blue-500 animate-spin-slow" />
                </div>
                <p className="text-sm">Thinking of some creative options...</p>
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
