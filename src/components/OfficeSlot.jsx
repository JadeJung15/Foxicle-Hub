import { useState, useEffect } from 'react'
import { Coffee, MousePointer2, Monitor, Keyboard, RefreshCw } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function OfficeSlot() {
    const { points, setPoints } = useGameStore()
    const [isSpinning, setIsSpinning] = useState(false)
    const [reels, setReels] = useState([<Coffee />, <MousePointer2 />, <Monitor />])
    const [resultMsg, setResultMsg] = useState('')

    const icons = [
        { id: 'coffee', component: <Coffee />, value: 10 },
        { id: 'mouse', component: <MousePointer2 />, value: 20 },
        { id: 'monitor', component: <Monitor />, value: 50 },
        { id: 'keyboard', component: <Keyboard />, value: 200 } // 잭팟용
    ]

    const spin = () => {
        const cost = 50
        if (points < cost) {
            alert('포인트가 부족합니다! (필요: 50 FP)')
            return
        }

        setPoints(-cost)
        setIsSpinning(true)
        setResultMsg('')

        setTimeout(() => {
            const newReels = [
                icons[Math.floor(Math.random() * icons.length)],
                icons[Math.floor(Math.random() * icons.length)],
                icons[Math.floor(Math.random() * icons.length)]
            ]
            setReels(newReels.map(i => i.component))

            // 결과 체크
            if (newReels[0].id === newReels[1].id && newReels[1].id === newReels[2].id) {
                const prize = newReels[0].value * 10
                setPoints(prize)
                setResultMsg(`🎉 잭팟! ${prize.toLocaleString()} FP 획득!`)
            } else if (newReels[0].id === newReels[1].id || newReels[1].id === newReels[2].id || newReels[0].id === newReels[2].id) {
                const prize = 100
                setPoints(prize)
                setResultMsg(`👏 당첨! 100 FP 획득!`)
            } else {
                setResultMsg('아쉽네요. 다시 도전해보세요!')
            }

            setIsSpinning(false)
        }, 1500)
    }

    return (
        <div className="slot-machine glass">
            <h2 className="slot-title">오피스 슬롯 머신</h2>
            <div className="reels-container">
                {reels.map((icon, i) => (
                    <div key={i} className={`reel ${isSpinning ? 'spinning' : ''}`}>
                        <div className="icon-wrapper">{icon}</div>
                    </div>
                ))}
            </div>

            <div className="slot-info">
                <p className="msg">{resultMsg || '레버를 당겨 행운을 확인하세요!'}</p>
                <button className="spin-btn" onClick={spin} disabled={isSpinning}>
                    {isSpinning ? 'SPINNING...' : 'SPIN (50 FP)'}
                </button>
            </div>

            <div className="payout-table">
                <div className="table-title">배당표</div>
                <div className="table-grid">
                    <div className="table-item"><Coffee size={14} /> x3 = 100 FP</div>
                    <div className="table-item"><MousePointer2 size={14} /> x3 = 200 FP</div>
                    <div className="table-item"><Monitor size={14} /> x3 = 500 FP</div>
                    <div className="table-item"><Keyboard size={14} /> x3 = 2000 FP</div>
                </div>
            </div>

            <style>{`
        .slot-machine {
          padding: 40px;
          text-align: center;
          border-radius: var(--radius-lg);
        }
        .slot-title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 30px;
          color: var(--text-primary);
        }
        .reels-container {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
        }
        .reel {
          width: 100px;
          height: 120px;
          background: #f5f5f7;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #eee;
          overflow: hidden;
        }
        .icon-wrapper {
          font-size: 40px;
          color: var(--accent-blue);
        }
        .spinning .icon-wrapper {
          animation: reelSpin 0.1s linear infinite;
        }
        .slot-info {
          margin-bottom: 30px;
        }
        .msg {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 20px;
          height: 20px;
        }
        .spin-btn {
          width: 100%;
          height: 60px;
          background: var(--accent-blue);
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 20px rgba(0, 113, 227, 0.2);
        }
        .spin-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 113, 227, 0.3);
        }
        .spin-btn:disabled {
          background: #ccc;
          box-shadow: none;
          cursor: not-allowed;
        }
        .payout-table {
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: left;
        }
        .table-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .table-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .table-item {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }
        @keyframes reelSpin {
          0% { transform: translateY(-5px); opacity: 0.5; }
          100% { transform: translateY(5px); opacity: 1; }
        }
      `}</style>
        </div>
    )
}

export default OfficeSlot
