import { useState, useEffect } from 'react'
import { Flag, Trophy, Coins, PawPrint } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function PetRacing() {
    const { points, pets, playPetRacing } = useGameStore()
    const [selectedPet, setSelectedPet] = useState(null)
    const [betAmount, setBetAmount] = useState(100)
    const [isRacing, setIsRacing] = useState(false)
    const [result, setResult] = useState(null)
    const [raceProgress, setRaceProgress] = useState(0)

    const handleStartRace = () => {
        if (!selectedPet) {
            alert('출전할 동료를 선택해주세요.')
            return
        }
        if (points < betAmount) {
            alert('포인트가 부족합니다.')
            return
        }

        setIsRacing(true)
        setResult(null)
        setRaceProgress(0)

        // 레이싱 애니메이션 시뮬레이션
        let currentProgress = 0
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15
            setRaceProgress(Math.min(currentProgress, 100))

            if (currentProgress >= 100) {
                clearInterval(interval)
                // 승률 40%
                const isWin = Math.random() < 0.4
                playPetRacing(betAmount, isWin)
                setResult(isWin ? 'win' : 'lose')
                setIsRacing(false)
            }
        }, 300)
    }

    if (pets.length === 0) {
        return (
            <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Flag size={40} style={{ margin: '0 auto 15px', color: '#ccc' }} />
                <h3>출전 가능한 동료가 없습니다.</h3>
                <p>알을 부화시켜 동료를 먼저 획득해주세요.</p>
            </div>
        )
    }

    return (
        <div className="pet-racing-container">
            <div className="racing-setup glass">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Flag size={20} color="var(--accent-blue)" /> 루팡 펫 레이싱 그랑프리
                    </h2>
                    <div style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>
                        <Coins size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        보유: {points.toLocaleString()} FP
                    </div>
                </div>

                <div className="setup-grid">
                    <div>
                        <h4 style={{ marginBottom: '10px' }}>출전 동료 선택</h4>
                        <div className="pet-selector">
                            {pets.map(pet => (
                                <div
                                    key={pet.id}
                                    className={`pet-select-card ${selectedPet === pet.id ? 'selected' : ''}`}
                                    onClick={() => !isRacing && setSelectedPet(pet.id)}
                                >
                                    <div className="avatar" style={{ backgroundColor: `${pet.color}15`, marginBottom: '5px' }}>
                                        <PawPrint size={24} color={pet.color} />
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: '600' }}>{pet.name}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Lv.{pet.level}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '10px' }}>투자 포인트 (베팅)</h4>
                        <div className="bet-buttons">
                            {[100, 500, 1000].map(amount => (
                                <button
                                    key={amount}
                                    className={`btn ${betAmount === amount ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => !isRacing && setBetAmount(amount)}
                                >
                                    {amount} FP
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,113,227,0.05)', borderRadius: '10px' }}>
                            <p style={{ fontSize: '13px', marginBottom: '5px' }}>🏆 1등 우승 시: <strong style={{ color: 'var(--accent-blue)' }}>{betAmount * 2} FP</strong> 획득!</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>* 우승 확률은 약 40%로 고정되어 있습니다.</p>
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '20px', padding: '15px', fontSize: '16px' }}
                    onClick={handleStartRace}
                    disabled={isRacing || !selectedPet}
                >
                    {isRacing ? '레이싱 진행 중...' : '레이싱 시작! (투자금 차감)'}
                </button>
            </div>

            {/* Racing Track Area */}
            {(isRacing || result) && (
                <div className="track-area glass" style={{ marginTop: '20px', padding: '30px', position: 'relative', overflow: 'hidden' }}>
                    <div className="track">
                        <div className="finish-line">FINISH</div>
                        <div
                            className="racer"
                            style={{
                                left: `${raceProgress}%`,
                                transition: 'left 0.3s ease-out',
                                backgroundColor: pets.find(p => p.id === selectedPet)?.color || '#000'
                            }}
                        >
                            <PawPrint size={24} color="white" />
                        </div>
                    </div>

                    {result && (
                        <div className="result-overlay animate-fade">
                            {result === 'win' ? (
                                <div className="win-msg">
                                    <Trophy size={40} color="#ffcc00" />
                                    <h3>우승! +{betAmount * 2} FP</h3>
                                </div>
                            ) : (
                                <div className="lose-msg">
                                    <h3 style={{ color: 'var(--text-secondary)' }}>아쉽게도 등수에 들지 못했습니다...</h3>
                                    <p>-{betAmount} FP</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .pet-select-card {
                    padding: 10px;
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: inline-block;
                    margin-right: 10px;
                }
                .pet-select-card.selected {
                    border-color: var(--accent-blue);
                    background: rgba(0, 113, 227, 0.05);
                }
                .setup-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .bet-buttons {
                    display: flex;
                    gap: 10px;
                }
                .track {
                    height: 60px;
                    background: #e8f0fe;
                    border-radius: 30px;
                    position: relative;
                    margin: 40px 0;
                }
                .finish-line {
                    position: absolute;
                    right: 40px;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: repeating-linear-gradient(45deg, #000, #000 10px, #fff 10px, #fff 20px);
                    display: flex;
                    align-items: center;
                    font-weight: 900;
                    color: rgba(0,0,0,0.3);
                    padding-left: 10px;
                    letter-spacing: 2px;
                }
                .racer {
                    position: absolute;
                    top: 10px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    z-index: 10;
                }
                .result-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(255,255,255,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .win-msg h3 { color: #ff9500; font-size: 24px; margin-top: 10px; }
            `}</style>
        </div>
    )
}

export default PetRacing
