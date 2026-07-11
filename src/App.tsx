import { useCallback, useEffect, useState } from 'react'
import Cursor from './components/Cursor'
import Craft from './components/Craft'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Kinetic from './components/Kinetic'
import Manifesto from './components/Manifesto'
import Navbar from './components/Navbar'
import Palette from './components/Palette'
import Preloader from './components/Preloader'
import Works from './components/Works'

export default function App() {
  const [ready, setReady] = useState(false)
  const onPreloaderDone = useCallback(() => setReady(true), [])

  // hold scroll until the preloader hands over
  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [ready])

  return (
    <>
      {!ready && <Preloader onDone={onPreloaderDone} />}
      <Cursor />
      <Navbar ready={ready} />
      <main>
        <Hero ready={ready} />
        <Craft />
        <Works />
        <Kinetic />
        <Manifesto />
        <Palette />
      </main>
      <Footer />
    </>
  )
}
