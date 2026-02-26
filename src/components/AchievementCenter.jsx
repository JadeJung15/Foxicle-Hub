import { Trophy, CheckCircle, Gift, Award, Star } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function AchievementCenter() {
    const { achievements, claimAchievement } = useGameStore()

    return (
        <div className="achievement-container animate-fade">
            <header className="page-header">
                <h2>루팡 업적 센터</h2>
                <p>당신의 위대한 "몰컴" 기록들, 뱃지로 영원히 기록됩니다.</p>
            </header>

            <div className="achievement-grid">
                {achievements.map(a => (
                    <div key={a.id} className={`achievement-card glass ${a.completed ? 'completed' : ''} ${a.claimed ? 'claimed' : ''}`}>
                        <div className="achievement-icon">
                            {a.completed ? <Award size={32} color="var(--accent-blue)" /> : <Star size={32} color="#ddd" />}
                        </div>
                        <div className="achievement-info">
                            <h3>{a.title}</h3>
                            <p>{a.desc}</p>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${Math.min(100, (a.progress / a.target) * 100)}%` }}
                                ></div>
                            </div>
                            <div className="progress-text">
                                {a.progress.toLocaleString()} / {a.target.toLocaleString()}
                            </div>
                        </div>
                        <div className="achievement-action">
                            {a.completed && !a.claimed && (
                                <button className="claim-btn" onClick={() => claimAchievement(a.id)}>
                                    <Gift size={16} /> 보상 받기 ({a.reward} FP)
                                </button>
                            )}
                            {a.claimed && <span className="claimed-badge">수령 완료</span>}
                            {!a.completed && <span className="locked-badge">진행 중</span>}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .achievement-container { text-align: left; max-width: 900px; margin: 0 auto; padding-bottom: 50px; }
                .page-header { margin-bottom: 40px; }
                .page-header h2 { font-size: 32px; font-weight: 800; margin-bottom: 10px; }
                .page-header p { color: var(--text-secondary); font-size: 16px; }

                .achievement-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
                .achievement-card { 
                    padding: 24px; display: flex; flex-direction: column; gap: 15px; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .achievement-card.completed { border-color: var(--accent-blue); background: rgba(0, 113, 227, 0.02); }
                .achievement-card.claimed { opacity: 0.7; }
                .achievement-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }

                .achievement-icon { width: 60px; height: 60px; background: #f5f5f7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
                .achievement-info h3 { font-size: 18px; font-weight: 800; margin-bottom: 4px; }
                .achievement-info p { font-size: 13px; color: var(--text-secondary); margin-bottom: 15px; height: 32px; }

                .progress-bar-container { width: 100%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden; margin-bottom: 6px; }
                .progress-bar { height: 100%; background: var(--accent-blue); border-radius: 3px; transition: width 0.5s ease; }
                .progress-text { font-size: 11px; font-weight: 700; color: var(--text-secondary); text-align: right; }

                .achievement-action { margin-top: 10px; }
                .claim-btn { 
                    width: 100%; padding: 10px; background: var(--accent-blue); color: white; border: none; 
                    border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; 
                    align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
                }
                .claim-btn:hover { background: #005bb7; transform: scale(1.02); }
                .claimed-badge { display: block; text-align: center; color: var(--status-success); font-weight: 700; font-size: 13px; padding: 10px; background: #f0fff4; border-radius: 12px; }
                .locked-badge { display: block; text-align: center; color: var(--text-secondary); font-weight: 600; font-size: 13px; padding: 10px; background: #f5f5f7; border-radius: 12px; }
            `}</style>
        </div>
    )
}

export default AchievementCenter
