import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import "./RecommendationsCarousel.css";
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
  modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      spaceBetween={20}

      breakpoints={{
        0:   { slidesPerView: 2 },
        640: { slidesPerView: 3 },
        1024:{ slidesPerView: 4 },
      }}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
      }}
      style={{ padding: "2.5rem",  }}
    >
      {recs.map((r, idx) => (
        <SwiperSlide key={`${r.title}-${r.year ?? "y"}-${idx}`}>
          <RecCard r={r} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
