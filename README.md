# 🎥 Reel Hot Takes 🔥  

👉 **Live now at [reelhottakes.xyz](https://reelhottakes.xyz/)**  

## Overview  
Welcome to **Reel Hot Takes**! This web app uncovers the *spiciest* takes from any [Letterboxd](https://letterboxd.com/) account. Enter a username, and the app generates a ranked list of their most controversial ratings using a custom **“hotness” algorithm**.  

Data is pulled from Letterboxd and compared against **IMDb global averages** to determine how “hot” or controversial a user’s ratings are. The backend is powered by the [Reel Hot Takes API](https://github.com/jakekressley/Reel-Hot-Takes-API), which I also developed.  

![Demo](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzgyaHhwc3AxeXV4Nmh6ZjlhZWRlMjNrbmh6NzJndmNoZnJwM3F3eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KBUkyopLSLPKNQ7uqS/giphy.gif)  

---

## ✨ Features  
- **Letterboxd Integration** – Fetches ratings and reviews for any user.  
- **Hotness Algorithm** – Compares user ratings against IMDb averages, with popular movies weighted more heavily.  
- **Responsive UI** – Clean, intuitive interface for smooth user experience.  
- **Dark Mode** – Built-in option to toggle between light and dark themes.  

---

## 🛠️ Tech Stack  

**Frontend**  
- React + TypeScript  
- TailwindCSS  

**Backend**  
- Python (FastAPI)  
- BeautifulSoup (web scraping)  
- Mongo Database of ~50,00 movies

**Deployment**  
- **Docker** for containerization  
- **Google Cloud Artifact Registry**  
- **Google Cloud Run**  

---

## 🚀 Try It Out  
👉 Live site: [reelhottakes.xyz](https://reelhottakes.xyz/)  

You can test it with my Letterboxd username: **itsjake77**.  
