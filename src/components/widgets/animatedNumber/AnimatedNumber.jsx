"use client";

import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import "./AnimatedNumber.css";

const AnimatedNumber = ({ value, duration = 2, delay = 0 }) => {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const suffix = value.includes("+") ? "+" : value.includes("%") ? "%" : "";
  const digitsCount = value.replace(/[^0-9]/g, "").length;

  // Слушаем изменения MotionValue
  useMotionValueEvent(count, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Извлекаем числовое значение из строки (убираем символы +, %, и т.д.)
          const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
          
          setTimeout(() => {
            const controls = animate(count, numericValue, { 
              duration: duration,
              easing: [0.25, 0.46, 0.45, 0.94] // easeOutQuart
            });
            return () => controls.stop();
          }, delay * 1000);
          
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [count, value, duration, delay]);

  return (
    <span
      ref={elementRef}
      className="animated-number"
      style={{ minWidth: `${digitsCount + (suffix ? 1 : 0)}ch` }}
    >
      {displayValue}
      {suffix}
    </span>
  );
};

export default AnimatedNumber; 