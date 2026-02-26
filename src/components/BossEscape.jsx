import { useState, useEffect, useRef } from 'react'
import { User, ShieldAlert, Zap, Timer, Star } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function BossEscape() {
    const { setPoints, earnPoints } = useGameStore()
    const [gameState, setGameState] = useState('IDLE')
    const [score, setScore] = useState(0)
    const [playerY, setPlayerY] = useState(0)
    const [isJumping, setIsJumping] = useState(false)
    const [obstacles, setObstacles] = useState([])
    const gameRef = useRef(null)

    const startGame = () => {
        setGameState('PLAYING')
        setScore(0)
        setPlayerY(0)
        setObstacles([])
    }

    const jump = () => {
        if (isJumping || gameState !== 'PLAYING') return
        setIsJumping(true)
        let height = 0
        let up = true
        const jumpInterval = setInterval(() => {
            if (up) {
                height += 5
                if (height >= 80) up = false
            } else {
                height -= 5
                if (height <= 0) {
                    height = 0
                    clearInterval(jumpInterval)
                    setIsJumping(false)
                }
            }
            setPlayerY(height)
        }, 20)
    }

    useEffect(() => {
        const handleKey = (e) => { if (e.code === 'Space') jump() }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [isJumping, gameState])

    useEffect(() => {
        if (gameState !== 'PLAYING') return
        const spawnTimer = setInterval(() => {
            setObstacles(prev => [...prev, { id: Date.now(), x: 100, type: Math.random() > 0.3 ? 'BOSS' : 'BOMB' }])
        }, 1500)
        return () => clearInterval(spawnTimer)
    }, [gameState])

    useEffect(() => {
        if (gameState !== 'PLAYING') return
        const gameLoop = setInterval(() => {
            setObstacles(prev => {
                const next = prev.map(o => ({ ...o, x: o.x - 2 })).filter(o => o.x > -10)

                // 충돌 체크
                const collision = next.find(o => o.x < 15 && o.x > 5 && playerY < 40)
                if (collision) {
                    setGameState('ENDED')
                    setPoints(Math.floor(score / 5))
                    earnPoints('game_win_small')
                    clearInterval(gameLoop)
                }
                return next
            })
            setScore(s => s + 1)
        }, 30)
        return () => clearInterval(gameLoop)
    }, [gameState, playerY, score, setPoints, earnPoints])

    return (
        <div className="boss-escape glass" onClick={jump}>
            <div className="game-header">
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>상사 피하기</h2>
                <div className="game-stats">
                    <div className="stat"><Star size={16} /> {score}</div>
                </div>
            </div>

            <div className="game-area">
                {gameState === 'IDLE' && (
                    <div className="overlay">
                        <p>상사와 보고서 폭탄을 점프로 피하세요!<br />(스페이스바 또는 클릭)</p>
                        <button className="btn btn-primary" onClick={startGame}>시작하기</button>
                    </div>
                )}

                {gameState === 'PLAYING' && (
                    <div className="world">
                        <div className={`player ${isJumping ? 'jumping' : ''}`} style={{ bottom: `${playerY}px` }}>
                            <User size={32} color="var(--accent-blue)" />
                        </div>
                        {obstacles.map(o => (
                            <div key={o.id} className="obstacle" style={{ left: `${o.x}%` }}>
                                {o.type === 'BOSS' ? <ShieldAlert size={32} color="#ff3b30" /> : <Zap size={24} color="#ffcc00" />}
                            </div>
                        ))}
                        <div className="floor"></div>
                    </div>
                )}

                {gameState === 'ENDED' && (
                    <div className="overlay">
                        <h3>상사에게 잡혔습니다!</h3>
                        <p className="final-score">생존 점수: {score}</p>
                        <p className="reward">보상: +{Math.floor(score / 5)} FP</p>
                        <button className="btn btn-outline" onClick={startGame}>다시 도전</button>
                    </div>
                )}
            </div>

            <style>{`
        .boss-escape {
          padding: 30px;
          height: 400px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .stat {
          background: #f5f5f7;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .game-area {
          flex: 1;
          position: relative;
          background: #fafafa;
          border-radius: 15px;
          border: 1px solid #eee;
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          text-align: center;
          gap: 20px;
        }
        .world {
          position: absolute;
          inset: 0;
        }
        .player {
          position: absolute;
          left: 10%;
          transition: bottom 0.05s;
        }
        .obstacle {
          position: absolute;
          bottom: 10px;
        }
        .floor {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 10px;
          background: #ddd;
        }
        .final-score { font-size: 32px; font-weight: 800; margin: 10px 0; }
        .reward { color: var(--accent-blue); font-weight: 600; margin-bottom: 20px; }
      `}</style>
        </div>
    )
}

export default BossEscape
