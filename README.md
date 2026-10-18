# Neon Drift Arcade

A static-export Next.js endless neon runner for the start.ng arcade.

## Build

```bash
npm install
npm run build
```

The static site is generated in `out/`. Commit the `out/` folder to a public GitHub repository for hosting. The game works as a guest without a start.ng connection; signed-in players can submit scores and view the shared leaderboard.

For arcade publishing, provide a 1600x1000 `cover.png` next to `index.html` in the final hosted output. The game supports signed-in score submission through the start.ng `/connect` bridge, with guest play available through `?guest=1`.
