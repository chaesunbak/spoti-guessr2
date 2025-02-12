# Spoti-Guessr

A fun and interactive game where players guess which song, artist, or album is more popular on Spotify. Test your knowledge of music trends and compete for high scores!

## Features

- 🎮 Multiple Game Modes

  - Artists: Compare artist popularity
  - Albums: Guess which album has more streams
  - Tracks: Pick the more popular song

- 🎵 Genre Variety

  - K-pop
  - K-pop Girl Groups
  - K-pop Boy Groups
  - Classic K-pop
  - Hip-hop
  - K-rap
  - Rock
  - Classic Rock
  - K-indie
  - Trot

- 🎯 Game Features
  - Score tracking
  - Streak system with bonus points
  - Life system with recovery mechanics
  - Audio preview for tracks
  - Beautiful UI with smooth animations

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI
- Spotify Web API
- Firebase

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/chaesunbak/spoti-guessr2.git
cd spoti-guessr2
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to start playing!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Spotify Web API for providing music data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- All contributors and users of Spoti-Guessr
