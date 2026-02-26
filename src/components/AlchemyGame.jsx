import React, { useState } from 'react'
import useGameStore from '../store/useGameStore'
import { Beaker, Sparkles, Flame, AlertTriangle, ArrowRight } from 'lucide-react'

const AlchemyGame = () => {
    const { points, playAlchemy } = useGameStore()
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState(null) // 'success' | 'fail' | null

    const handleAlchemy = () => {
        if (points < 200) {
            alert('연금술을 위해 최소 200 FP가 필요합니다!')
            return
        }

        setIsProcessing(true)
        setResult(null)

        // 애니메이션 효과를 위한 지연
        setTimeout(() => {
            const prevPoints = useGameStore.getState().points
            playAlchemy()
            const currentPoints = useGameStore.getState().points

            if (currentPoints > prevPoints) {
                setResult('success')
            } else {
                setResult('fail')
            }
            setIsProcessing(false)
        }, 2000)
    }

    return (
        <div className="alchemy-container glass animate-fade" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div className="alchemy-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'inline-flex', padding: '15px', borderRadius: '50%', background: 'rgba(163, 106, 255, 0.1)', marginBottom: '20px' }}>
                    <Beaker size={48} color="#a366ff" className={isProcessing ? 'animate-bounce' : ''} />
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>신비한 연금술 솥단지</h2>
                <p style={{ color: 'var(--text-secondary)' }}>포인트를 정제하여 더 큰 행운을 연성하세요. (성공 확률 60%)</p>
            </div>

            <div className="alchemy-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
                <div className="slot-item glass" style={{ width: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>재료</span>
                    <div style={{ fontWeight: 'bold' }}>200 FP</div>
                </div>
                <ArrowRight size={24} color="#ddd" />
                <div className={`slot-result glass ${isProcessing ? 'shimmer' : ''}`} style={{
                    width: '160px',
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #ddd',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {isProcessing ? (
                        <Flame size={40} color="#ff9500" className="animate-pulse" />
                    ) : result === 'success' ? (
                        <div style={{ textAlign: 'center' }}>
                            <Sparkles size={40} color="#34c759" />
                            <p style={{ fontWeight: 'bold', color: '#34c759', marginTop: '10px' }}>연성 성공!</p>
                            <p style={{ fontSize: '18px', fontWeight: '800' }}>+1,000 FP</p>
                        </div>
                    ) : result === 'fail' ? (
                        <div style={{ textAlign: 'center' }}>
                            <AlertTriangle size={40} color="#ff3b30" />
                            <p style={{ fontWeight: 'bold', color: '#ff3b30', marginTop: '10px' }}>연성 실패..</p>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>증발함</p>
                        </div>
                    ) : (
                        <span style={{ color: '#ccc' }}>결과 대기 중</span>
                    )}
                </div>
            </div>

            <div style={{ textAlign: 'center' }}>
                <button
                    className={`btn btn-primary ${isProcessing ? 'disabled' : ''}`}
                    onClick={handleAlchemy}
                    disabled={isProcessing}
                    style={{
                        padding: '15px 40px',
                        fontSize: '18px',
                        background: 'linear-gradient(135deg, #a366ff 0%, #0071e3 100%)',
                        boxShadow: '0 10px 20px rgba(163, 106, 255, 0.3)'
                    }}
                >
                    {isProcessing ? '연성 중...' : '연성 시작 (200 FP)'}
                </button>
            </div>

            <style>{`
                .shimmer {
                    background: linear-gradient(90deg, transparent, rgba(163, 106, 255, 0.1), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    )
}

export default AlchemyGame
