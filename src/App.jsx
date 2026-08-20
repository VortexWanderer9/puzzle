import { useEffect, useState } from 'react'
import './App.css'

const answer = 'BRAIN'
const rows = 6

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span> }

function App() {
  const [guesses, setGuesses] = useState([])
  const [current, setCurrent] = useState('')
  const [message, setMessage] = useState('')
  const [hint, setHint] = useState(false)
  const [seconds, setSeconds] = useState(142)
  const won = guesses.includes(answer)
  const gameOver = won || guesses.length === rows

  useEffect(() => {
    if (gameOver) return undefined
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [gameOver])

  const addLetter = (letter) => { if (!gameOver && current.length < 5) setCurrent((value) => value + letter.toUpperCase()) }
  const removeLetter = () => { if (!gameOver) setCurrent((value) => value.slice(0, -1)) }
  const submitGuess = () => {
    if (gameOver) return
    if (current.length !== 5) { setMessage('Five letters, please'); return }
    setGuesses((value) => [...value, current])
    setMessage(current === answer ? 'Brilliant! Puzzle solved.' : '')
    setCurrent('')
  }
  const reset = () => { setGuesses([]); setCurrent(''); setMessage('Fresh board, fresh start'); setHint(false); setSeconds(142) }
  const letterState = (letter, index, word) => !word ? '' : answer[index] === letter ? 'correct' : answer.includes(letter) ? 'present' : 'absent'
  const formatTime = (total) => `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
  const boardRows = Array.from({ length: rows }, (_, index) => guesses[index] || (index === guesses.length ? current : ''))

  useEffect(() => {
    const onKeyDown = (event) => {
      if (/^[a-zA-Z]$/.test(event.key)) addLetter(event.key)
      if (event.key === 'Backspace') removeLetter()
      if (event.key === 'Enter') submitGuess()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return <main className="app-shell">
    <section className="game-panel">
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="Mindful home"><span className="brand-mark">✦</span> MINDFUL</a>
        <div className="nav-actions"><button className="round-button" aria-label="View statistics"><Icon>▥</Icon></button><button className="round-button" aria-label="Settings"><Icon>⚙</Icon></button><button className="avatar" aria-label="Your profile">A</button></div>
      </nav>
      <header className="hero" id="top">
        <p className="eyebrow">DAILY BRAIN TEASER</p><h1>Mind <em>Twist</em></h1><p className="subtitle">Unscramble the word. One clever clue at a time.</p>
        <div className="challenge-meta"><span><Icon>⌁</Icon> Challenge #042</span><span className="dot">•</span><span><Icon>◴</Icon> {formatTime(seconds)}</span></div>
      </header>
      <div className="content-grid">
        <section className="puzzle-area" aria-label="Word puzzle">
          <div className="clue-card"><div className="clue-topline"><span>YOUR CLUE</span><span className="level"><i /> MEDIUM</span></div><p>“It’s what you use<br />to solve this.”</p><button className="hint-link" onClick={() => setHint((value) => !value)}><Icon>☼</Icon> {hint ? 'The first letter is B' : 'Need a hint?'}</button></div>
          <div className="board" aria-label="Your guesses">{boardRows.map((word, rowIndex) => <div className="word-row" key={rowIndex}>{Array.from({ length: 5 }, (_, letterIndex) => { const letter = word[letterIndex] || ''; const isSubmitted = rowIndex < guesses.length; return <span className={`tile ${isSubmitted ? letterState(letter, letterIndex, word) : ''} ${letter ? 'filled' : ''}`} key={letterIndex}>{letter}</span> })}</div>)}</div>
          <p className={`message ${message ? 'show' : ''}`}>{message || ' '}</p>
        </section>
        <aside className="side-panel">
          <div className="progress-card"><p className="tiny-label">TODAY’S PROGRESS</p><div className="progress-stat"><strong>{won ? '1' : '0'}</strong><span>of 1<br />solved</span><b>{won ? '✓' : '—'}</b></div><div className="progress-track"><span style={{ width: won ? '100%' : '35%' }} /></div></div>
          <div className="streak-card"><span className="fire">♨</span><div><p>3 day streak!</p><small>Keep it going</small></div><span className="chevron">›</span></div>
          <button className="new-puzzle" onClick={reset}><Icon>↻</Icon> New puzzle</button>
        </aside>
      </div>
      <div className="keyboard" aria-label="On-screen keyboard">{['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, index) => <div className="key-row" key={row}>{index === 2 && <button className="key special" onClick={submitGuess}>ENTER</button>}{[...row].map((letter) => <button key={letter} className="key" onClick={() => addLetter(letter)}>{letter}</button>)}{index === 2 && <button className="key special backspace" onClick={removeLetter}>⌫</button>}</div>)}</div>
    </section>
    <footer>© 2024 Mindful Games &nbsp;·&nbsp; Made for curious minds</footer>
  </main>
}

export default App
