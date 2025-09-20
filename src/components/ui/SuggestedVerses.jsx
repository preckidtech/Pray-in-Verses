import React, { useEffect, useState, useRef } from "react";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import image1 from "../../assets/images/suggest/christian-woman-reading-bible-in-an-ancient-cathol-2023-05-04-23-20-42-utc.JPG";
import image2 from "../../assets/images/suggest/diverse-religious-shoot-2023-11-27-05-31-41-utc.jpg";
import image3 from "../../assets/images/suggest/cropped-shot-of-african-american-man-praying-with-2021-08-30-01-46-12-utc.jpg";
import image4 from "../../assets/images/suggest/diverse-religious-shoot-2023-11-27-05-31-41-utc.jpg";
import image5 from "../../assets/images/suggest/two-lovers-studying-the-bible-it-is-god-s-love-for-2022-06-18-20-18-08-utc.jpg";

const defaultList = [
  { reference: "Healing", text: "Fear not, for I am with you...", image: image1, progress: 40 },
  { reference: "Strength", text: "Come to me, all who labor...", image: image2, progress: 70 },
  { reference: "Family", text: "Peace I leave with you...", image: image3, progress: 20 },
  { reference: "Peace", text: "Be still and know...", image: image4, progress: 90 },
  { reference: "Nation", text: "All things work together...", image: image5, progress: 55 },
];

const SuggestedVerses = ({ items = [] }) => {
  const list = items.length ? items : defaultList;
  const [visibleCount, setVisibleCount] = useState(3);
  const [startIdx, setStartIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // adjust visible count based on screen size
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setVisibleCount(3);
      else if (window.innerWidth >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auto-scroll functionality with modern timing
  useEffect(() => {
    if (isAutoPlaying && list.length > visibleCount) {
      autoPlayRef.current = setInterval(() => {
        setIsTransitioning(true);
        setStartIdx((prev) => (prev + 1) % list.length);
        
        // Reset transition state after animation completes
        setTimeout(() => setIsTransitioning(false), 500);
      }, 4500); // 4.5s interval for better UX - not too fast, not too slow
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, list.length, visibleCount]);

  // navigation handlers
  const handleNext = () => {
    setIsTransitioning(true);
    setStartIdx((prev) => (prev + 1) % list.length);
    pauseAutoPlay();
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setStartIdx((prev) => (prev - 1 + list.length) % list.length);
    pauseAutoPlay();
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Pause auto-play temporarily when user interacts
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Resume auto-play after 6 seconds of no interaction
    hoverTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 6000);
  };

  // Handle mouse interactions for better UX
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Resume auto-play after a short delay when mouse leaves
    hoverTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 1000);
  };

  const handleSave = (v) => {
    alert(`Saved ${v.reference} to Journal`);
    pauseAutoPlay(); // Pause when user interacts with save
  };

  // compute visible slice with wrap-around
  const visible = [];
  for (let i = 0; i < visibleCount; i++) {
    visible.push(list[(startIdx + i) % list.length]);
  }

  return (
    <div 
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(0%)` }}
        >
          {visible.map((v, i) => (
            <div key={`${startIdx}-${i}`} className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4`}>
              <div className="bg-gray-50 shadow-md rounded-lg p-4 flex flex-col hover:shadow-lg transition-shadow duration-300">
                <div className="flex">
                  <img
                    src={v.image}
                    alt={v.reference}
                    className="w-20 h-20 object-cover rounded-md mr-4 transition-transform duration-300 hover:scale-105"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900">{v.reference}</h4>
                        <button 
                          onClick={() => handleSave(v)} 
                          aria-label="save"
                          className="group"
                        >
                          <Bookmark 
                            size={18} 
                            className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200" 
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{v.text}</p>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-700 ease-out" 
                          style={{ width: `${v.progress}%` }} 
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">{v.progress}% Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Enhanced with better UX */}
      <button
        onClick={handlePrev}
        disabled={isTransitioning}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 z-10 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
      </button>
      <button
        onClick={handleNext}
        disabled={isTransitioning}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 z-10 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
      </button>

      {/* Auto-play indicator (optional visual feedback) */}
      {isAutoPlaying && list.length > visibleCount && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            {Array.from({ length: list.length }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === startIdx ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedVerses;