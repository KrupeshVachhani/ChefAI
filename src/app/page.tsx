"use client";
import { Suspense, useEffect, useState } from "react";
import "./DotAnimation.css";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import LoadingAnimation from "./loading/loading";

function TypewriterEffect({
  text,
  onComplete,
}: {
  text: string;
  onComplete: () => void;
}) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        onComplete();
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [currentIndex, text, onComplete]);

  return <span>{displayText}</span>;
}

TypewriterEffect.propTypes = {
  text: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
};

function Home() {
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const numDots = 300;
    const container = document.querySelector(".dot-container");
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.style.left = `${Math.random() * 100}vw`;
      dot.style.top = `${Math.random() * 100}vh`;
      const speed = Math.random() * 10 + 100;
      dot.style.animationDuration = `${speed}s`;
      if (container) {
        container.appendChild(dot);
      }
    }
  }, []);

  const handleStartClick = () => {
    router.push("/chat-chef");
  };

  return (
    <Suspense fallback={<LoadingAnimation />}>
      <div className="full-screen-container">
        <div className="home-container">
          <motion.div
            className="main-container"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inner-container">
              <motion.div
                className="main-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <TypewriterEffect
                  text="Welcome to Chef AI"
                  onComplete={() => {
                    setTimeout(() => setShowButton(true), 1000);
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            className="button-container"
            initial={{ opacity: 0, x: -100 }}
            animate={showButton ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            {showButton && (
              <div className="cta-container">
                <motion.button
                  className="cta-button"
                  whileTap={{ scale: 0.95 }}
                  animate={showButton ? { scale: [0, 1.1, 1] } : {}}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  onClick={handleStartClick}
                >
                  Let&rsquo;s Start
                </motion.button>
              </div>
            )}
          </motion.div>
          <div className="dot-container">
            {/* Dots will be dynamically created here */}
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default Home;
