import { useEffect, useRef, useState } from "react";

function speechRecognitionCtor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"
      />
    </svg>
  );
}

export default function SearchBar({ label, placeholder, value, onChange }) {
  const inputRef = useRef(null);
  const composingRef = useRef(false);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const [supported] = useState(() => Boolean(speechRecognitionCtor()));
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (document.activeElement === input) return;
    if (input.value !== (value ?? "")) input.value = value ?? "";
  }, [value]);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* already stopped */
      }
      recognitionRef.current = null;
    };
  }, []);

  function clearTimer() {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function commit(next) {
    clearTimer();
    onChange(next);
  }

  function applyTranscript(transcript) {
    const next = String(transcript ?? "").trim();
    if (!next || composingRef.current) return;
    if (inputRef.current) inputRef.current.value = next;
    commit(next);
  }

  function stopVoice() {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* already stopped */
    }
  }

  function startVoice() {
    const Ctor = speechRecognitionCtor();
    if (!Ctor || composingRef.current) return;

    setVoiceNote("");
    const recognition = new Ctor();
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results?.[event.results.length - 1];
      applyTranscript(result?.[0]?.transcript ?? "");
    };

    recognition.onerror = (event) => {
      const error = event.error;
      if (error === "not-allowed" || error === "service-not-allowed") {
        setVoiceNote("マイクの使用が許可されていません");
      } else if (error === "audio-capture") {
        setVoiceNote("マイクを使えませんでした");
      } else if (error === "network") {
        setVoiceNote("音声認識に接続できませんでした");
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
      recognitionRef.current = null;
    }
  }

  function toggleVoice() {
    if (listening) {
      stopVoice();
      return;
    }
    startVoice();
  }

  return (
    <div className="search">
      <label className="search-field">
        <span className="sr-only">{label}</span>
        <input
          ref={inputRef}
          type="text"
          enterKeyHint="search"
          autoComplete="off"
          defaultValue={value}
          placeholder={placeholder}
          onCompositionStart={() => {
            composingRef.current = true;
            clearTimer();
          }}
          onCompositionUpdate={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={(event) => {
            composingRef.current = false;
            commit(event.currentTarget.value);
          }}
          onInput={(event) => {
            if (composingRef.current || event.nativeEvent.isComposing) return;
            const next = event.currentTarget.value;
            clearTimer();
            timerRef.current = setTimeout(() => {
              timerRef.current = null;
              if (composingRef.current) return;
              onChange(next);
            }, 400);
          }}
          onBlur={(event) => {
            composingRef.current = false;
            commit(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            composingRef.current = false;
            event.currentTarget.blur();
          }}
        />
      </label>
      {supported ? (
        <button
          type="button"
          className={listening ? "search-voice is-listening" : "search-voice"}
          aria-label="音声で検索"
          aria-pressed={listening}
          title="音声で検索"
          onClick={toggleVoice}
        >
          <MicIcon />
        </button>
      ) : (
        <p className="search-voice-fallback">このブラウザでは音声入力を使えません</p>
      )}
      {listening ? (
        <p className="search-voice-status" aria-live="polite">
          聞き取り中…
        </p>
      ) : voiceNote ? (
        <p className="search-voice-status" role="status">
          {voiceNote}
        </p>
      ) : null}
    </div>
  );
}
