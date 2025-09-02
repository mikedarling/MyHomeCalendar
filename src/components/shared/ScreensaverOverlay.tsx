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
      if (data.objectIDs && data.objectIDs.length > 0) {
        const ids = data.objectIDs.sort(() => 0.5 - Math.random()).slice(0, 10);
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
    }
    if (active && images.length === 0) {
      fetchImages();
    }
  }, [active, images.length]);

  // Cycle images every 10s with fade
  useEffect(() => {
    if (!active || images.length === 0) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % images.length);
        setFade(true);
      }, 600); // fade out duration
    }, 10000);
    return () => clearInterval(interval);
  }, [active, images]);

  // Listen for user activity
  useEffect(() => {
    const resetTimer = () => {
      setActive(false);
      setCurrent(0);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setActive(true), 2 * 60 * 1000);
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!active || images.length === 0) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.95)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "none",
      }}
      onClick={() => setActive(false)}
    >
      <img
        src={images[current]}
        alt="Met Museum Art"
        style={{
          maxWidth: "80vw",
          maxHeight: "100vh",
          borderRadius: "8px",
          boxShadow: "0 0 32px #000",
          opacity: fade ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(.4,0,.2,1)",
        }}
      />
      <div style={{ color: "#fff", marginTop: 24, fontSize: 18 }}>
        Screensaver: Met Museum Art (click or move to exit)
      </div>
    </div>
  );
}
