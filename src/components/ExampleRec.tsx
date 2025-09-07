import { RecCard } from "./Rec";

const sampleRec = {
  title: "Neon Genesis Evangelion: The End of Evangelion",
  year: 1997,
  poster: "https://m.media-amazon.com/images/M/MV5BMGI2Y2RiYTctYWIwZi00NjA2LWFmYzYtZDhkNTk1ZGNmNDVmXkEyXkFqcGc@._V1_.jpg",
  genres: ["Animation", "Action", "Drama"],
  score: 81.39,
  average: 8.1,
  votes: 72579,
  because: "Akira"
};

export default function Example() {
  return (
    <div>
      <RecCard r={sampleRec} onSeen={() => alert("Seen!")} />
    </div>
  );
}