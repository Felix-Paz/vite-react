import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Info } from "lucide-react";

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export default function ShowTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [episodeLength, setEpisodeLength] = useLocalStorage("wwif:episodeLength", 42);
  const [maxEpisodes, setMaxEpisodes] = useLocalStorage("wwif:maxEpisodes", 10);
  const [episodes, setEpisodes] = useLocalStorage("wwif:episodes", 1);
  const [finishMode, setFinishMode] = useLocalStorage("wwif:finishMode", "classic");
  const [finishResult, setFinishResult] = useState(null);
  const [availableTime, setAvailableTime] = useLocalStorage("wwif:availableTime", "");
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [sounds, setSounds] = useLocalStorage("wwif:sounds", true);
  const [volume, setVolume] = useLocalStorage("wwif:vol", 60);
  const [timeFormat, setTimeFormat] = useLocalStorage("wwif:timeFormat", "24");
  const dialRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Enter") { calculate(); playTone(500, 0.08); }
      if (e.key === "ArrowUp") { setEpisodes(v => Math.min(maxEpisodes, Math.max(1, Number(v) + 1))); playTone(600, 0.05); }
      if (e.key === "ArrowDown") { setEpisodes(v => Math.min(maxEpisodes, Math.max(1, Number(v) - 1))); playTone(400, 0.05); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [maxEpisodes]);

  function fmtTime(d) {
    const h = d.getHours();
    const m = d.getMinutes();
    if (timeFormat === "12") {
      const hh = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
    }
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function playTone(freq = 440, dur = 0.08) {
    if (!sounds) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.value = Math.max(0, Math.min(1, volume / 100));
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.stop(ctx.currentTime + dur);
    } catch (e) {}
  }

  function calculate() {
    if (finishMode === "classic") {
      const start = new Date(currentTime);
      const total = Number(episodes) * Number(episodeLength);
      const finish = new Date(start.getTime() + total * 60000);
      const dur = total >= 60 ? `${Math.floor(total / 60)}h ${total % 60}m` : `${total}m`;
      setFinishResult({ title: `You'll finish at ${fmtTime(finish)}`, subtitle: `In ${dur}` });
      playTone(880, 0.08);
      return;
    }
    if (!availableTime || !/^\d{1,2}:\d{2}$/.test(availableTime)) {
      setFinishResult({ title: "Invalid time", subtitle: "Enter a valid time (HH:MM)" });
      playTone(220, 0.12);
      return;
    }
    const [hhRaw, mmRaw] = availableTime.split(":");
    const hh = Number(hhRaw);
    const mm = Number(mmRaw);
    if (Number.isNaN(hh) || Number.isNaN(mm)) {
      setFinishResult({ title: "Invalid time", subtitle: "Enter a valid time (HH:MM)" });
      playTone(220, 0.12);
      return;
    }
    const finish = new Date(currentTime);
    finish.setHours(hh, mm, 0, 0);
    if (finish <= currentTime) finish.setDate(finish.getDate() + 1);
    const diff = Math.floor((finish - currentTime) / 60000);
    if (diff < Number(episodeLength)) {
      setFinishResult({ title: `Not enough time`, subtitle: `${diff}m left` });
      playTone(330, 0.12);
      return;
    }
    const possible = clamp(Math.floor(diff / Number(episodeLength)), 0, Number(maxEpisodes));
    setFinishResult({ title: `You can watch ${possible} ${possible === 1 ? "episode" : "episodes"}`, subtitle: `Ends at ${fmtTime(finish)}` });
    playTone(660, 0.08);
  }

  function onDialDrag(e, info) {
    const delta = -Math.round(info.delta.y / 20);
    if (delta === 0) return;
    setEpisodes(v => clamp(Number(v) + delta, 1, Number(maxEpisodes)));
    playTone(300 + ((Number(episodes) + delta) % 6) * 30, 0.03);
  }

  function onRangeChange(e) {
    const val = Number(e.target.value);
    setEpisodes(val);
    playTone(250 + (val % 6) * 40, 0.05);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg,#FFF6EF,#FFF1E6)" }}>
      <div className="w-full max-w-lg p-6">
        <div className="flex justify-end text-sm text-[#444] mb-4">{fmtTime(currentTime)}</div>
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6 bg-white rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="text-2xl font-semibold text-[#6B4A3C]">ShowTime</div>

              <div className="flex gap-3">
                <Button onClick={() => { setFinishMode("classic"); playTone(700, 0.06); }} className={`px-4 py-2 rounded-full ${finishMode === "classic" ? "bg-[#E07A5F] text-white" : "bg-[#FFF6F3] text-[#6B4A3C]"}`}>By Episodes</Button>
                <Button onClick={() => { setFinishMode("reverse"); playTone(700, 0.06); }} className={`px-4 py-2 rounded-full ${finishMode === "reverse" ? "bg-[#2A9D8F] text-white" : "bg-[#F3FFFB] text-[#2A9D8F]"}`}>By Time</Button>
              </div>

              <div className="w-full flex flex-col items-center gap-3">
                {finishMode === "classic" ? (
                  <>
                    <motion.div drag="y" dragConstraints={{ top: -100, bottom: 100 }} onDrag={onDialDrag} ref={dialRef} className="w-48 h-48 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FFF7F3] to-[#FFF0E8] shadow-inner">
                      <div className="text-6xl font-bold text-[#6B4A3C] tabular-nums">{episodes}</div>
                    </motion.div>
                    <input type="range" min={1} max={maxEpisodes} value={episodes} onChange={onRangeChange} className="w-full" />
                  </>
                ) : (
                  <div className="flex items-center gap-3 w-full justify-center">
                    <input type="time" value={availableTime} onChange={e => { setAvailableTime(e.target.value); playTone(500, 0.05); }} className="p-2 border rounded-lg" />
                  </div>
                )}

                <Button onClick={calculate} className="mt-2 px-6 py-3 rounded-2xl bg-[#F4A261] text-white">Calculate</Button>

                {finishResult && (
                  <div className="mt-4 text-center">
                    <div className="text-xl font-semibold text-[#444]">{finishResult.title}</div>
                    <div className="text-sm text-[#666]">{finishResult.subtitle}</div>
                  </div>
                )}

                <div className="w-full flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setShowSettings(true); playTone(550, 0.06); }} className="p-2 rounded-full bg-[#FFF6F3]"><Settings /></button>
                    <button onClick={() => { setShowInfo(true); playTone(550, 0.06); }} className="p-2 rounded-full bg-[#FFF6F3]"><Info /></button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {showSettings && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <Card className="w-80">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                  <label className="text-sm">Episode length (min)</label>
                  <input type="number" min={1} value={episodeLength} onChange={e => { setEpisodeLength(Number(e.target.value)); playTone(500, 0.05); }} className="p-2 border rounded-lg" />
                  <label className="text-sm">Max episodes</label>
                  <input type="number" min={1} value={maxEpisodes} onChange={e => { setMaxEpisodes(Number(e.target.value)); playTone(500, 0.05); }} className="p-2 border rounded-lg" />
                  <label className="text-sm">Time format</label>
                  <div className="flex gap-2">
                    <Button onClick={() => { setTimeFormat("24"); playTone(600, 0.05); }} className={`${timeFormat === "24" ? "bg-[#6B4A3C] text-white" : "bg-[#FFF6F3] text-[#6B4A3C]"} px-3 py-1 rounded`}>24h</Button>
                    <Button onClick={() => { setTimeFormat("12"); playTone(600, 0.05); }} className={`${timeFormat === "12" ? "bg-[#6B4A3C] text-white" : "bg-[#FFF6F3] text-[#6B4A3C]"} px-3 py-1 rounded`}>12h</Button>
                  </div>
                  <label className="text-sm">Sounds</label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={sounds} onChange={e => { setSounds(e.target.checked); playTone(400, 0.05); }} />
                    <input type="range" min={0} max={100} value={volume} onChange={e => { setVolume(Number(e.target.value)); playTone(400, 0.05); }} />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button onClick={() => { setShowSettings(false); playTone(550, 0.06); }} className="bg-[#2A9D8F] text-white">Close</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showInfo && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <Card className="w-80">
              <CardContent className="p-4">
                <div className="text-sm text-[#444]">Enter the number of episodes (or drag the dial) and press Calculate to know when you'll finish. In "By Time" mode, set the time limit and we'll tell you how many episodes fit.</div>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => { setShowInfo(false); playTone(550, 0.06); }} className="bg-[#E07A5F] text-white">Close</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function __tests__() {
  const start = new Date("2025-01-01T10:00:00Z");
  const total = 2 * 42 * 60000;
  const finish = new Date(start.getTime() + total);
  console.assert(finish.getTime() - start.getTime() === total, "t1");
  console.assert(clamp(5, 1, 10) === 5, "t2");
  console.assert(clamp(0, 1, 10) === 1, "t3");
  console.assert(clamp(11, 1, 10) === 10, "t4");
  const now = new Date("2025-01-01T10:00:00Z");
  const end = new Date("2025-01-01T11:00:00Z");
  const diff = Math.floor((end - now) / 60000);
  const possible = Math.floor(diff / 42);
  console.assert(possible === 1, "t5");
}

__tests__();



