# Her Universe — interactive birthday experience

React + TypeScript + Vite + Tailwind v4 + Framer Motion + React Three Fiber.

```
npm install
npm run dev      # develop
npm run build    # production build in dist/
```

## Make it yours
- **All text, names, captions, messages:** `src/data/birthdayContent.ts`
- **Photos:** drop files into `public/assets/{intro,gallery,friends}/` using the filenames listed in `public/assets/README.md` (or change the paths in the content file). Missing images show a purple placeholder.
- **Music (optional):** `public/assets/audio/soundtrack.mp3`. The sound button only appears when the file exists; it never autoplays.
- **Chapter order/labels:** `src/data/chapters.ts` and the `VIEWS` list in `src/App.tsx`.

Keyboard: ← / → move between chapters (and inside the gallery viewer / friends carousel); Esc closes a photo.
# birthday-site
