import { useState, useEffect } from 'react'
import { Mail, Trash2, User, AlertCircle, Timer, Star } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function EmailClean() {
    const { setPoints, earnPoints } = useGameStore()
    const [gameState, setGameState] = useState('IDLE')
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(25)
    const [emails, setEmails] = useState([])

    const startGame = () => {
        setScore(0)
        setTimeLeft(25)
        setEmails([])
        setGameState('PLAYING')
    }

    useEffect(() => {
        if (gameState !== 'PLAYING') return
        const spawnTimer = setInterval(() => {
            const isSpam = Math.random() > 0.3
            const id = Date.now()
            setEmails(prev => [...prev, {
                id,
                type: isSpam ? 'SPAM' : 'BOSS',
                x: Math.random() * 80 + 10,
                y: Math.random() * 60 + 20,
                age: 0
            }])
        }, 800)
        return () => clearInterval(spawnTimer)
    }, [gameState])

    useEffect(() => {
        if (gameState !== 'PLAYING') return
        const loop = setInterval(() => {
            setEmails(prev => prev.map(e => ({ ...e, age: e.age + 1 })).filter(e => e.age < 30))
        }, 100)
        return () => clearInterval(loop)
    }, [gameState])

    useEffect(() => {
        let timer
        if (gameState === 'PLAYING' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
        } else if (timeLeft === 0 && gameState === 'PLAYING') {
            setGameState('ENDED')
            setPoints(score)
            earnPoints('game_win_small')
        }
        return () => clearInterval(timer)
    }, [gameState, timeLeft, score, setPoints, earnPoints])

    const handleClick = (id, type) => {
        if (type === 'SPAM') {
            setScore(s => s + 20)
        } else {
            setScore(s => Math.max(0, s - 50))
        }
        setEmails(prev => prev.filter(e => e.id !== id))
    }

    return (
        <div className="email-clean glass">
            <div className="game-header">
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>스팸 메일 청소</h2>
                <div className="game-stats">
                    <div className="stat"><Timer size={16} /> {timeLeft}s</div>
                    <div className="stat"><Star size={16} /> {score}</div>
                </div>
            </div>

            <div className="game-canvas">
                {gameState === 'IDLE' && (
                    <div className="overlay">
                        <p>'스팸(파란색)'만 골져 지우세요!<br />'상사 메일(빨간색)'을 지우면 대폭 감점!</p>
                        <button className="btn btn-primary" onClick={startGame}>업무 시작</button>
                    </div>
                )}

                {gameState === 'PLAYING' && emails.map(email => (
                    <div
                        key={email.id}
                        className={`email-item ${email.type === 'SPAM' ? 'spam' : 'boss'}`}
                        style={{ left: `${email.x}%`, top: `${email.y}%`, opacity: (30 - email.age) / 30 }}
                        onClick={() => handleClick(email.id, email.type)}
                    >
                        {email.type === 'SPAM' ? <Mail size={24} /> : <User size={24} />}
                        <span className="tooltip">{email.type === 'SPAM' ? 'SPAM!' : 'BOSS!'}</span>
                    </div>
                ))}

                {gameState === 'ENDED' && (
                    <div className="overlay">
                        <h3>메일함 정리 완료!</h3>
                        <p className="final-score">클린 점수: {score}</p>
                        <p className="reward">보상: +{score} FP</p>
                        <button className="btn btn-outline" onClick={startGame}>다시 하기</button>
                    </div>
                )}
            </div>

            <style>{`
        .email-clean {
          padding: 30px;
          height: 450px;
          display: flex;
          flex-direction: column;
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
        .game-canvas {
          flex: 1;
          position: relative;
          background: #fff;
          border-radius: 15px;
          border: 1px solid #eee;
          overflow: hidden;
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 20;
          gap: 20px;
          text-align: center;
        }
        .email-item {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.1s;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .email-item:hover { transform: scale(1.1); }
        .email-item.spam { background: #e8f0fe; color: #0071e3; border: 1px solid #0071e3; }
        .email-item.boss { background: #ffebeb; color: #ff3b30; border: 1px solid #ff3b30; }
        .tooltip {
          position: absolute;
          bottom: -20px;
          font-size: 10px;
          font-weight: 700;
        }
        .final-score { font-size: 32px; font-weight: 800; margin: 10px 0; }
        .reward { color: var(--accent-blue); font-weight: 600; margin-bottom: 20px; }
      `}</style>
        </div>
    )
}

export default EmailClean
