import { useState, useEffect } from 'react'
import { Hash, Play, Timer, CheckCircle, XCircle, Trophy } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function MeetingBingo() {
    const { earnPoints, addExperience } = useGameStore()
    const [gameState, setGameState] = useState('IDLE')
    const [bingoBoard, setBingoBoard] = useState([])
    const [meetingTime, setMeetingTime] = useState(0)
    const [score, setScore] = useState(0)

    const buzzwords = [
        "시너지", "R&R", "팔로업", "피드백", "마일스톤",
        "워크사이드", "BM", "컨센서스", "KPI", "니즈",
        "내재화", "고도화", "최적화", "차별화", "플랫폼",
        "아젠다", "데스크톱", "모바일", "인사이트", "밸류",
        "프로세스", "네트워킹", "솔루션", "디지털", "트랜스"
    ]

    const initGame = () => {
        const shuffled = [...buzzwords].sort(() => Math.random() - 0.5)
        const board = shuffled.slice(0, 25).map((word, i) => ({
            id: i,
            text: word,
            checked: false
        }))
        setBingoBoard(board)
        setMeetingTime(0)
        setScore(0)
        setGameState('PLAYING')
    }

    const toggleCell = (id) => {
        if (gameState !== 'PLAYING') return
        setBingoBoard(prev => prev.map(cell =>
            cell.id === id ? { ...cell, checked: !cell.checked } : cell
        ))
    }

    useEffect(() => {
        let timer
        if (gameState === 'PLAYING') {
            timer = setInterval(() => {
                setMeetingTime(t => t + 1)

                // 가끔씩 단어가 선택됨 (현장감 유도)
                if (Math.random() < 0.05) {
                    const unchecked = bingoBoard.filter(c => !c.checked)
                    if (unchecked.length > 0) {
                        const target = unchecked[Math.floor(Math.random() * unchecked.length)]
                        // 자동 체크는 아니고, '상사가 이 말을 했습니다!'라는 알림 정도면 좋음
                    }
                }
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [gameState, bingoBoard])

    const calculateBingo = () => {
        // 빙고 줄 수 계산 로직 생략하고 간단하게 체크된 수 비례 보상
        const checkedCount = bingoBoard.filter(c => c.checked).length
        const totalReward = checkedCount * 50
        const expReward = checkedCount * 10

        earnPoints('game_win_small') // 기본 보상
        setScore(totalReward)
        setGameState('ENDED')

        // 실제 보상 추가 지급
        useGameStore.getState().setPoints(totalReward)
        addExperience(expReward)
    }

    return (
        <div className="bingo-container glass animate-fade">
            <div className="bingo-header">
                <h2>회의 시간 빌런 빙고</h2>
                <p>상사가 회의 중 자주 쓰는 단어를 체크하세요. 빙고가 많을수록 루팡 성공!</p>
            </div>

            <div className="bingo-stats">
                <div className="stat-item"><Timer size={16} /> {Math.floor(meetingTime / 60)}분 {meetingTime % 60}초</div>
                <div className="stat-item"><CheckCircle size={16} /> {bingoBoard.filter(c => c.checked).length}개 체크</div>
            </div>

            <div className="bingo-game-area">
                {gameState === 'IDLE' && (
                    <div className="bingo-overlay">
                        <button className="btn btn-primary btn-lg" onClick={initGame}>
                            <Play size={20} /> 회의 입장하기
                        </button>
                    </div>
                )}

                {gameState === 'PLAYING' && (
                    <div className="bingo-grid">
                        {bingoBoard.map(cell => (
                            <button
                                key={cell.id}
                                className={`bingo-cell ${cell.checked ? 'active' : ''}`}
                                onClick={() => toggleCell(cell.id)}
                            >
                                {cell.text}
                            </button>
                        ))}
                    </div>
                )}

                {gameState === 'ENDED' && (
                    <div className="bingo-overlay result">
                        <Trophy size={48} color="var(--accent-blue)" />
                        <h3>회의 종료 (탈출 성공!)</h3>
                        <p className="res-score">획득 보상: {score} FP</p>
                        <button className="btn btn-outline" onClick={initGame}>다음 회의 대기</button>
                    </div>
                )}
            </div>

            {gameState === 'PLAYING' && (
                <button className="btn btn-danger finish-btn" onClick={calculateBingo}>
                    회의록 제출 (보상 받기)
                </button>
            )}

            <style>{`
                .bingo-container { padding: 30px; text-align: center; }
                .bingo-header { margin-bottom: 25px; }
                .bingo-header h2 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
                .bingo-header p { font-size: 14px; color: var(--text-secondary); }

                .bingo-stats { display: flex; justify-content: center; gap: 20px; margin-bottom: 25px; }
                .stat-item { background: #f5f5f7; padding: 6px 15px; border-radius: 20px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px; }

                .bingo-game-area { position: relative; min-height: 400px; background: #fafafa; border-radius: 20px; border: 1px solid #eee; overflow: hidden; }
                .bingo-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.9); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
                
                .bingo-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; padding: 15px; height: 100%; }
                .bingo-cell { 
                    aspect-ratio: 1; border: none; background: white; border-radius: 12px; 
                    font-size: 12px; font-weight: 700; color: var(--text-primary); cursor: pointer;
                    transition: all 0.2s; border: 1px solid #eee; display: flex; align-items: center; justify-content: center;
                }
                .bingo-cell:hover { transform: scale(1.05); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
                .bingo-cell.active { background: var(--accent-blue); color: white; border-color: var(--accent-blue); }

                .finish-btn { width: 100%; margin-top: 20px; height: 50px; font-weight: 800; }
                .res-score { font-size: 24px; font-weight: 800; color: var(--accent-blue); margin-bottom: 10px; }
            `}</style>
        </div>
    )
}

export default MeetingBingo
