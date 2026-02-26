import { useState, useEffect, useRef } from 'react'
import { FileText, ShieldAlert, Timer, Star } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function WorkSorting() {
    const { setPoints, earnPoints } = useGameStore()
    const [gameState, setGameState] = useState('IDLE') // IDLE, PLAYING, ENDED
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(30)
    const [currentItem, setCurrentItem] = useState(null)
    const [feedback, setFeedback] = useState(null) // PRECISE, WRONG

    const ITEMS = [
        { type: 'NORMAL', icon: <FileText size={40} color="#0071e3" />, label: '일반 서류' },
        { type: 'SECRET', icon: <ShieldAlert size={40} color="#ff3b30" />, label: '기밀 서류' }
    ]

    const nextTask = () => {
        setCurrentItem(ITEMS[Math.floor(Math.random() * ITEMS.length)])
    }

    const startGame = () => {
        setScore(0)
        setTimeLeft(30)
        setGameState('PLAYING')
        nextTask()
    }

    const handleSort = (type) => {
        if (gameState !== 'PLAYING') return

        if (currentItem.type === type) {
            setScore(s => s + 10)
            setFeedback('PRECISE')
        } else {
            setScore(s => Math.max(0, s - 5))
            setFeedback('WRONG')
        }

        setTimeout(() => setFeedback(null), 300)
        nextTask()
    }

    useEffect(() => {
        let timer
        if (gameState === 'PLAYING' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
        } else if (timeLeft === 0 && gameState === 'PLAYING') {
            setGameState('ENDED')
            const totalReward = Math.floor(score / 2)
            setPoints(totalReward)
            earnPoints('game_win_small')
        }
        return () => clearInterval(timer)
    }, [gameState, timeLeft, score, setPoints, earnPoints])

    return (
        <div className="sorting-game glass">
            <div className="game-header">
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>서류 분류 속도전</h2>
                <div className="game-stats">
                    <div className="stat"><Timer size={16} /> {timeLeft}s</div>
                    <div className="stat"><Star size={16} /> {score}</div>
                </div>
            </div>

            <div className="game-screen">
                {gameState === 'IDLE' && (
                    <div className="start-screen">
                        <p>서류를 왼쪽(일반) 또는 오른쪽(기밀)으로 <br />최대한 빠르게 분류하세요!</p>
                        <button className="btn btn-primary" onClick={startGame}>시작하기</button>
                    </div>
                )}

                {gameState === 'PLAYING' && (
                    <div className="playing-screen">
                        <div className={`task-item ${feedback === 'PRECISE' ? 'success' : feedback === 'WRONG' ? 'error' : ''}`}>
                            {currentItem?.icon}
                            <p style={{ marginTop: '10px', fontWeight: '600' }}>{currentItem?.label}</p>
                        </div>
                    </div>
                )}

                {gameState === 'ENDED' && (
                    <div className="end-screen">
                        <h3>업무 종료!</h3>
                        <p className="final-score">최종 점수: {score}</p>
                        <p className="reward">보상: +{Math.floor(score / 2)} FP</p>
                        <button className="btn btn-outline" onClick={startGame}>다시 하기</button>
                    </div>
                )}
            </div>

            {gameState === 'PLAYING' && (
                <div className="control-buttons">
                    <button className="sort-btn normal" onClick={() => handleSort('NORMAL')}>
                        <span className="key-hint">←</span> 일반
                    </button>
                    <button className="sort-btn secret" onClick={() => handleSort('SECRET')}>
                        기밀 <span className="key-hint">→</span>
                    </button>
                </div>
            )}

            <style>{`
        .sorting-game {
          padding: 30px;
          text-align: center;
          height: 450px;
          display: flex;
          flex-direction: column;
        }
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .game-stats {
          display: flex;
          gap: 20px;
        }
        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          background: #f5f5f7;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
        }
        .game-screen {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .task-item {
          padding: 30px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: transform 0.1s;
        }
        .task-item.success { transform: scale(1.1); border: 2px solid var(--status-success); }
        .task-item.error { transform: scale(0.95); border: 2px solid var(--status-error); }
        
        .control-buttons {
          display: flex;
          gap: 20px;
          margin-top: 30px;
        }
        .sort-btn {
          flex: 1;
          height: 60px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          font-size: 18px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .sort-btn.normal { background: rgba(0, 113, 227, 0.1); color: var(--accent-blue); }
        .sort-btn.secret { background: rgba(255, 59, 48, 0.1); color: var(--status-error); }
        
        .sort-btn:hover { filter: brightness(0.95); }
        .key-hint { opacity: 0.5; margin: 0 8px; font-size: 14px; }
        
        .final-score { font-size: 32px; font-weight: 800; margin: 10px 0; }
        .reward { color: var(--accent-blue); font-weight: 600; margin-bottom: 20px; }
      `}</style>
        </div>
    )
}

export default WorkSorting
