import { useState } from 'react'
import { TrendingUp, TrendingDown, RefreshCw, Zap, Info } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function DiceGame() {
    const { points, earnPoints, setPoints } = useGameStore()
    const [betAmount, setBetAmount] = useState(100)
    const [isRolling, setIsRolling] = useState(false)
    const [result, setResult] = useState(null)
    const [choice, setChoice] = useState('HIGH') // HIGH (홀/상승), LOW (짝/하락)

    const handlePlay = () => {
        if (points < betAmount) {
            alert('포인트가 부족합니다!')
            return
        }

        setIsRolling(true)
        setResult(null)

        // 1초 후 결과 발표 (딜레이로 긴장감 조성)
        setTimeout(() => {
            const winChance = 0.48 // 승률 48% (반하자 밸런스)
            const isWin = Math.random() < winChance
            const fee = 0.05 // 수수료 5%

            if (isWin) {
                const prize = Math.floor(betAmount * (2 - fee))
                setPoints(prize - betAmount)
                setResult({ type: 'WIN', amount: prize, msg: `축하합니다! ${prize.toLocaleString()} FP를 획득했습니다.` })
                earnPoints('game_win_small') // 경험치 추가 보상
            } else {
                setPoints(-betAmount)
                setResult({ type: 'LOSE', amount: betAmount, msg: '예측에 실패했습니다. 다음 기회를 노려보세요.' })
            }

            setIsRolling(false)
        }, 1000)
    }

    return (
        <div className="game-card glass">
            <div className="game-header">
                <div className="title-area">
                    <TrendingUp size={24} color="var(--accent-blue)" />
                    <h2 style={{ fontSize: '20px', fontWeight: '700' }}>포인트 단타 거래소</h2>
                </div>
                <div className="win-rate">예측 성공률: 48%</div>
            </div>

            <div className="game-screen">
                {isRolling ? (
                    <div className="rolling-state">
                        <RefreshCw className="spin-icon" size={48} />
                        <p>데이터 분석 중...</p>
                    </div>
                ) : result ? (
                    <div className={`result-state ${result.type.toLowerCase()}`}>
                        <h3>{result.type === 'WIN' ? 'SUCCESS' : 'FAILED'}</h3>
                        <p>{result.msg}</p>
                        <button className="btn btn-outline" onClick={() => setResult(null)}>다시 시도</button>
                    </div>
                ) : (
                    <div className="idle-state">
                        <p className="hint">포인트의 등락을 예측하여 자산을 증식하세요.</p>
                        <div className="choice-selector">
                            <button
                                className={`choice-btn high ${choice === 'HIGH' ? 'active' : ''}`}
                                onClick={() => setChoice('HIGH')}
                            >
                                <TrendingUp size={20} />
                                <span>홀 (상승)</span>
                            </button>
                            <button
                                className={`choice-btn low ${choice === 'LOW' ? 'active' : ''}`}
                                onClick={() => setChoice('LOW')}
                            >
                                <TrendingDown size={20} />
                                <span>짝 (하락)</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="betting-controls">
                <div className="bet-input-group">
                    <label>베팅 금액 설정</label>
                    <div className="input-row">
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
                            step="100"
                        />
                        <span className="unit">FP</span>
                    </div>
                </div>

                <button
                    className="btn btn-primary play-btn"
                    onClick={handlePlay}
                    disabled={isRolling}
                >
                    {isRolling ? '거래 요청 중...' : '예측 시작'}
                </button>
            </div>

            <div className="game-footer">
                <Info size={14} />
                <p>모든 거래에는 5%의 시스템 이용료(환전 수수료)가 부과됩니다.</p>
            </div>

            <style>{`
        .game-card {
          padding: 30px;
          border-radius: var(--radius-lg);
          text-align: left;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .title-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .win-rate {
          font-size: 11px;
          color: var(--text-secondary);
          background: #f5f5f7;
          padding: 4px 10px;
          border-radius: 12px;
          font-weight: 600;
        }

        .game-screen {
          background: var(--bg-secondary);
          height: 180px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          text-align: center;
        }

        .rolling-state {
          color: var(--accent-blue);
        }

        .spin-icon {
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        .result-state h3 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .result-state.win h3 { color: var(--status-success); }
        .result-state.lose h3 { color: var(--status-error); }

        .choice-selector {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .choice-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 15px;
          border-radius: 12px;
          border: 2px solid transparent;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .choice-btn.active.high {
          border-color: var(--status-success);
          background: rgba(52, 199, 89, 0.05);
        }

        .choice-btn.active.low {
          border-color: var(--status-error);
          background: rgba(255, 59, 48, 0.05);
        }

        .betting-controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .bet-input-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .input-row {
          display: flex;
          align-items: center;
          background: #F5F5F7;
          border-radius: 12px;
          padding: 0 15px;
        }

        .input-row input {
          flex: 1;
          background: transparent;
          border: none;
          height: 48px;
          font-size: 18px;
          font-weight: 600;
          outline: none;
        }

        .unit {
          font-weight: 700;
          color: var(--text-secondary);
        }

        .play-btn {
          height: 52px;
          font-size: 16px;
          font-weight: 700;
        }

        .game-footer {
          margin-top: 20px;
          display: flex;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 11px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}

export default DiceGame
