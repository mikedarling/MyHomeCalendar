"use client";
import React, { useEffect, useRef, useState } from "react";

export default function ScreensaverOverlay() {
  const [active, setActive] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Met Museum images
  useEffect(() => {
    async function fetchImages() {
      const res = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=painting");
      const data = await res.json();
      if (!data.objectIDs || data.objectIDs.length === 0) {
        return;
      }

      const ids = data.objectIDs
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
      
      const imgUrls: string[] = [];
      for (const id of ids) {
        const objRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
        const objData = await objRes.json();
        if (objData.primaryImage) {
          imgUrls.push(objData.primaryImage);
        }
      }
      setImages(imgUrls);
    }

    if (active && images.length === 0) {
      fetchImages();
    }
  }, [active, images.length]);

  // Cycle images every 10s with fade
  useEffect(() => {
    if (!active || images.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % images.length);
        setFade(true);
      }, 600); // fade out duration
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [active, images]);

  // Listen for user activity
  useEffect(() => {
    const resetTimer = () => {
      setActive(false);
      setCurrent(0);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setActive(true);
      }, 2 * 60 * 1000); // 2 minutes
    };

    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();
    
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!active || images.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black z-[9999] flex flex-col items-center justify-center cursor-none"
      onClick={() => setActive(false)}
    >
      <img
        src={images[current]}
        alt="Met Museum Art"
        className={`max-w-[80vw] max-h-screen rounded-lg shadow-2xl transition-opacity duration-600 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
