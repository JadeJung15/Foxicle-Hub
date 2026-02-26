import React, { useState } from 'react'
import useGameStore from '../store/useGameStore'
import { Bomb, TrendingUp, Skull, ShieldCheck, Coins } from 'lucide-react'

const BombGame = () => {
    const { points, playBombGame } = useGameStore()
    const [betAmount, setBetAmount] = useState(100)
    const [riskLevel, setRiskLevel] = useState('low') // low | high
    const [gameState, setGameState] = useState('idle') // idle | playing | win | lose
    const [lastWin, setLastWin] = useState(0)

    const handlePlay = () => {
        if (points < betAmount) {
            alert('포인트가 부족합니다!')
            return
        }

        setGameState('playing')

        setTimeout(() => {
            const prevPoints = useGameStore.getState().points
            playBombGame(betAmount, riskLevel)
            const currentPoints = useGameStore.getState().points

            if (currentPoints > prevPoints) {
                setGameState('win')
                setLastWin(currentPoints - prevPoints)
            } else {
                setGameState('lose')
            }
        }, 1500)
    }

    return (
        <div className="bomb-game glass animate-fade" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div className="game-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'inline-flex', padding: '15px', borderRadius: '50%', background: 'rgba(255, 59, 48, 0.1)', marginBottom: '20px' }}>
                    <Bomb size={48} color="#ff3b30" className={gameState === 'playing' ? 'animate-pulse' : ''} />
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: '800' }}>위험한 폭탄 돌리기</h2>
                <p style={{ color: 'var(--text-secondary)' }}>터지기 전에 수익을 챙기세요. 하이리스크 하이리턴!</p>
            </div>

            <div className="betting-panel glass" style={{ padding: '30px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>베팅 포인트</label>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            className="glass"
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>위험 등급</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className={`btn ${riskLevel === 'low' ? 'btn-primary' : 'glass'}`}
                                onClick={() => setRiskLevel('low')}
                                style={{ flex: 1, padding: '10px' }}
                            >
                                <ShieldCheck size={16} /> 안전 (70%)
                            </button>
                            <button
                                className={`btn ${riskLevel === 'high' ? 'btn-primary' : 'glass'}`}
                                onClick={() => setRiskLevel('high')}
                                style={{ flex: 1, padding: '10px', background: riskLevel === 'high' ? '#ff3b30' : '' }}
                            >
                                <Skull size={16} /> 위험 (30%)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="screen glass" style={{
                    height: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#111',
                    borderRadius: '12px',
                    color: '#fff',
                    flexDirection: 'column'
                }}>
                    {gameState === 'idle' && <p style={{ color: '#666' }}>베팅을 시작해 주세요</p>}
                    {gameState === 'playing' && <p className="animate-pulse" style={{ fontSize: '24px', color: '#ffcc00' }}>폭탄 가동 중...</p>}
                    {gameState === 'win' && (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#34c759', fontSize: '20px', fontWeight: 'bold' }}>성공! 생존했습니다.</p>
                            <p style={{ fontSize: '32px', fontWeight: '800' }}>+{lastWin.toLocaleString()} FP</p>
                        </div>
                    )}
                    {gameState === 'lose' && (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#ff3b30', fontSize: '20px', fontWeight: 'bold' }}>콰광! 폭발했습니다.</p>
                            <p style={{ fontSize: '18px', color: '#888' }}>-{betAmount.toLocaleString()} FP 증발</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                className={`btn btn-primary ${gameState === 'playing' ? 'disabled' : ''}`}
                onClick={handlePlay}
                disabled={gameState === 'playing'}
                style={{ width: '100%', padding: '20px', fontSize: '20px', fontWeight: '800' }}
            >
                {gameState === 'playing' ? '결과 기다리는 중...' : '폭탄 돌리기 시작!'}
            </button>
        </div>
    )
}

export default BombGame
