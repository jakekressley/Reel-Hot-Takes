// components/Recommendations.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { RecCard } from "./Rec";

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
  if (!recs?.length) return null;

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={20}
      // responsive slides per view
      breakpoints={{
        0:   { slidesPerView: 2 },
        640: { slidesPerView: 3 },
        1024:{ slidesPerView: 5 },
      }}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      loop={true}
      autoplay={{
                delay: 300,
                disableOnInteraction: true,
            }}
    >
      {recs.map((r, idx) => (
        <SwiperSlide key={`${r.title}-${r.year ?? "y"}-${idx}`}>
          <RecCard r={r} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
