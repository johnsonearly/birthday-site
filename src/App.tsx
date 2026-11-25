import { useEffect } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ExperienceProvider, useExperience } from './hooks/useExperience'
import { useAudio } from './hooks/useAudio'
import { useReducedMotion } from './hooks/useReducedMotion'
import { content } from './data/birthdayContent'
import { CHAPTERS } from './data/chapters'
import { ProgressIndicator } from './components/ProgressIndicator/ProgressIndicator'
import { ChapterNavigation } from './components/ChapterNavigation/ChapterNavigation'
import { SoundToggle } from './components/SoundToggle/SoundToggle'
import { IntroChapter } from './chapters/IntroChapter/IntroChapter'
import { GalleryChapter } from './chapters/GalleryChapter/GalleryChapter'
import { LetterChapter } from './chapters/LetterChapter/LetterChapter'
import { FriendsChapter } from './chapters/FriendsChapter/FriendsChapter'
import { FinaleChapter } from './chapters/FinaleChapter/FinaleChapter'

const VIEWS = [IntroChapter, GalleryChapter, LetterChapter, FriendsChapter, FinaleChapter]

function Experience() {
  const { index, direction, next, prev, introSeen } = useExperience()
  const reduced = useReducedMotion()
  const audio = useAudio(content.audio)
  const View = VIEWS[index]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { if (index > 0 || introSeen) next() }
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, introSeen, next, prev])

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-void">
      <AnimatePresence custom={direction}>
        <motion.div key={CHAPTERS[index].id} className="absolute inset-0"
          custom={direction}
          initial={{ opacity: 0, scale: reduced ? 1 : direction > 0 ? 1.06 : 0.94, filter: reduced ? 'none' : 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: reduced ? 1 : direction > 0 ? 0.94 : 1.06, filter: reduced ? 'none' : 'blur(10px)', transition: { duration: 0.6 } }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <View />
        </motion.div>
      </AnimatePresence>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <p className="hidden font-serif text-sm tracking-wide text-lavender/70 italic min-[440px]:block">{content.herName}&rsquo;s Universe</p>
        <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2"><ProgressIndicator /></div>
        <div className="pointer-events-auto ml-auto">{audio.available && <SoundToggle playing={audio.playing} onToggle={audio.toggle} />}</div>
      </header>
      <div className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-40 flex px-4 sm:px-6">
        <ChapterNavigation hideNext={index === 0} />
      </div>
    </main>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ExperienceProvider>
        <Experience />
      </ExperienceProvider>
    </MotionConfig>
  )
}
