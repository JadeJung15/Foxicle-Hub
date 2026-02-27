import { useState, useEffect } from 'react'
import { Target, Zap, Clock, PawPrint } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function PetTraining() {
    const { pets, playPetTraining } = useGameStore()
    const [selectedPet, setSelectedPet] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [timeLeft, setTimeLeft] = useState(10)
    const [score, setScore] = useState(0)
    const [targetPos, setTargetPos] = useState({ x: 50, y: 50 })
    const [resultExp, setResultExp] = useState(null)

    useEffect(() => {
        let timer
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (isPlaying && timeLeft === 0) {
            // 게임 종료 로직
            setIsPlaying(false)
            const earned = score * 2 // 1클릭당 2 경험치
            setResultExp(earned)
            playPetTraining(selectedPet, earned)
        }
        return () => clearInterval(timer)
    }, [isPlaying, timeLeft, score, selectedPet, playPetTraining])

    const handleStart = () => {
        if (!selectedPet) {
            alert('훈련할 동료를 선택해주세요.')
            return
        }
        setScore(0)
        setTimeLeft(10)
        setResultExp(null)
        setIsPlaying(true)
        moveTarget()
    }

    const moveTarget = () => {
        const x = Math.floor(Math.random() * 80) + 10 // 10% ~ 90%
        const y = Math.floor(Math.random() * 80) + 10
        setTargetPos({ x, y })
    }

    const handleTargetClick = () => {
        if (!isPlaying) return
        setScore(prev => prev + 1)
        moveTarget()
    }

    if (pets.length === 0) {
        return (
            <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Target size={40} style={{ margin: '0 auto 15px', color: '#ccc' }} />
                <h3>훈련 가능한 동료가 없습니다.</h3>
            </div>
        )
    }

    return (
        <div className="pet-training-container">
            <div className="setup-area glass" style={{ marginBottom: '20px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={20} color="#ff9500" /> 스파르타 집중 훈련
                        </h2>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '5px' }}>
                            10초 동안 과녁을 최대한 많이 클릭하여 경험치를 획득하세요!
                        </p>
                    </div>
                    {!isPlaying && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <select
                                className="pet-dropdown"
                                onChange={(e) => setSelectedPet(e.target.value)}
                                value={selectedPet || ''}
                            >
                                <option value="" disabled>훈련할 동료 선택</option>
                                {pets.map(pet => (
                                    <option key={pet.id} value={pet.id}>{pet.name} (Lv.{pet.level})</option>
                                ))}
                            </select>
                            <button className="btn btn-primary" onClick={handleStart} disabled={!selectedPet}>훈련 시작</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="game-area glass" style={{ position: 'relative', height: '400px', backgroundColor: '#fafafa', overflow: 'hidden' }}>
                {isPlaying ? (
                    <>
                        <div className="hud">
                            <div className="timer"><Clock size={16} /> {timeLeft}초</div>
                            <div className="score">타격수: {score}</div>
                        </div>
                        <div
                            className="target-btn"
                            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                            onMouseDown={handleTargetClick}
                        >
                            <PawPrint size={24} color="white" />
                        </div>
                    </>
                ) : (
                    <div className="idle-state">
                        {resultExp !== null ? (
                            <div className="result-view animate-fade">
                                <h3>훈련 종료!</h3>
                                <div className="result-stats">
                                    <p>총 타격수: {score}회</p>
                                    <p className="exp-gain">+{resultExp} EXP 획득!</p>
                                </div>
                                <button className="btn btn-primary" onClick={handleStart}>다시 훈련하기</button>
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-secondary)' }}>동료를 선택하고 훈련을 시작하세요.</div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .pet-dropdown {
                    padding: 8px 12px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    font-size: 14px;
                    outline: none;
                }
                .hud {
                    position: absolute;
                    top: 15px; left: 15px; right: 15px;
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    font-size: 18px;
                    pointer-events: none;
                }
                .timer { color: #ff3b30; display: flex; alignItems: center; gap: 5px; }
                .score { color: var(--accent-blue); }
                .target-btn {
                    position: absolute;
                    width: 50px; height: 50px;
                    background: #ff3b30;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: crosshair;
                    box-shadow: 0 4px 12px rgba(255,59,48,0.4);
                    transition: left 0.1s, top 0.1s;
                }
                .target-btn:active { transform: translate(-50%, -50%) scale(0.9); }
                .idle-state {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .result-view h3 { font-size: 28px; margin-bottom: 15px; }
                .result-stats { margin-bottom: 20px; font-size: 16px; }
                .exp-gain { color: #34c759; font-weight: 700; font-size: 20px; margin-top: 5px; }
            `}</style>
        </div>
    )
}

export default PetTraining
