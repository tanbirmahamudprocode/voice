import { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

function Home() {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext);

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState('');
  const [aiText, setAiText] = useState('');

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate('/login');
    } catch (error) {
      setUserData(null);
    }
  };

  const startRecognition = () => {
    if (!isRecognizingRef.current && !isSpeakingRef.current) {
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (error) {
        if (error.message.includes('start')) {
          console.error('Error starting recognition:', error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText('');
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    const open = (url) => window.open(url, '_blank');
    const query = encodeURIComponent(userInput);

    const commands = {
      'google-search': () => open(`https://www.google.com/search?q=${query}`),
      'calculator-open': () => open('https://www.google.com/search?q=calculator'),
      'instagram-open': () => open('https://www.instagram.com/'),
      'facebook-open': () => open('https://www.facebook.com/'),
      'weather-show': () => open('https://www.google.com/search?q=weather'),
      'youtube-search': () => open(`https://www.youtube.com/search?q=${query}`),
      'youtube-play': () => open(`https://www.youtube.com/results?search_query=${query}`),
    };

    if (commands[type]) {
      commands[type]();
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.error('Recognition start error:', error);
          }
        }
      }
    };

    setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) safeRecognition();
        }, 1000);
      }
      setUserText('');
    };

    recognition.onerror = (event) => {
      console.warn('Recognition error:', event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== 'aborted' && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) safeRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes(userData?.user?.assistantName.toLowerCase())) {
        console.log(transcript);
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && isRecognizingRef.current) {
        safeRecognition();
      }
    }, 10000);

    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData?.user?.name}, what can I help you with?`
    );
    greeting.lang = 'en-US';
    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearInterval(fallback);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#080818] via-[#0f0f2d] to-[#171757] flex justify-center items-center flex-col relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#6c63ff] filter blur-[150px] opacity-20"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[250px] h-[250px] rounded-full bg-[#00d0ff] filter blur-[150px] opacity-20"></div>
      </div>

      {/* Header buttons */}
      <div className="absolute top-5 right-5 flex flex-col space-y-3 z-10">
        <button
          className="flex items-center space-x-2 text-white bg-[#ffffff10] backdrop-blur-md rounded-full py-2 px-4 hover:bg-[#ffffff20] transition-all duration-300 hover:shadow-lg hover:shadow-[#00d0ff30]"
          onClick={() => navigate('/coustomize')}
        >
          <svg className="h-5 w-5 text-[#00d0ff]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
          <span>Customize</span>
        </button>

        <button
          className="flex items-center space-x-2 text-white bg-[#ff5e8420] backdrop-blur-md rounded-full py-2 px-4 hover:bg-[#ff5e8440] transition-all duration-300 hover:shadow-lg hover:shadow-[#ff5e8430]"
          onClick={handleLogout}
        >
          <svg className="h-5 w-5 text-[#ff5e84]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      {/* Assistant avatar */}
      <div className="relative mb-8 z-10">
        <div className={`w-[300px] h-[400px] rounded-3xl overflow-hidden border-2 border-[#ffffff20]
          ${listening ? 'animate-pulse border-[#00d0ff]' : ''}
          ${aiText ? 'animate-glow' : ''}
          transition-all duration-300 shadow-2xl shadow-[#00d0ff40]`}>
          <img
            src={userData?.user?.assistantImage}
            alt="Assistant"
            className="h-full w-full object-cover"
          />
        </div>
        <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2
          bg-gradient-to-r ${listening ? 'from-[#00d0ff] to-[#6c63ff]' : aiText ? 'from-[#ff5e84] to-[#ff8f70]' : 'from-[#6c63ff] to-[#8f7fff]'}
          text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg`}>
          {listening ? 'Listening...' : aiText ? 'Speaking...' : 'Ready'}
        </div>
      </div>

      {/* Assistant name */}
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d0ff] to-[#6c63ff] mb-8 text-center">
        I'm {userData?.user?.assistantName}
      </h1>

      {/* Wave animation */}
      <div className="relative w-[200px] h-[100px] mb-6 flex items-center justify-center">
        {!aiText && !userText && (
          <div className="flex space-x-2 justify-center items-center">
            {[0, 0.2, 0.4, 0.6, 0.8].map((delay, i) => (
              <div key={i} className="w-3 h-3 bg-[#00d0ff] rounded-full animate-wave" style={{ animationDelay: `${delay}s` }}></div>
            ))}
          </div>
        )}
      </div>

      {/* User/AI Text */}
      <div className="min-h-[60px] w-full max-w-2xl">
        {(userText || aiText) && (
          <div className="bg-[#ffffff10] backdrop-blur-md rounded-2xl p-6 border border-[#ffffff20] animate-fade-in">
            <p className="text-white text-xl font-medium text-center">
              {userText || aiText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
