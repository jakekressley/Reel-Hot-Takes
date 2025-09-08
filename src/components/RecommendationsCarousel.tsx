import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useCallback } from "react";
import { Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import "./RecommendationsCarousel.css";
import "./RecommendationsCarousel.custom.css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { RecCard } from "./Rec";

import type { Swiper as SwiperClass } from 'swiper/types';

type Rec = {
  title: string;
  year?: number;
  poster?: string;
  genres?: string[];
  score?: number;
  average?: number;
  votes?: number;
  because?: string;
};

export default function RecommendationsCarousel({ recs }: { recs: Rec[] }) {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();
  const handlePrevious = useCallback(() => {
    swiperRef?.slidePrev();
  }, [swiperRef]);

  const handleNext = useCallback(() => {
    swiperRef?.slideNext();
  }, [swiperRef]);

  if (!recs?.length) return null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={handlePrevious}
        style={{
          position: 'absolute',
          left: -70,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: '#14171C',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 54,
          height: 54,
          fontSize: 36,
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
        }}
        aria-label="Previous"
      >
        	&#60;
      </button>
      <Swiper
        modules={[Pagination, Scrollbar, A11y, Autoplay]}
        onSwiper={setSwiperRef}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
        }}
        style={{ padding: '40px 0', boxSizing: 'border-box' }}
      >
        {recs.map((r, idx) => (
          <SwiperSlide key={`${r.title}-${r.year ?? "y"}-${idx}`}>
            <RecCard r={r} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: -70,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: '#14171C',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 54,
          height: 54,
          fontSize: 36,
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
        }}
        aria-label="Next"
      >
        	&#62;
      </button>
    </div>
  );
}

