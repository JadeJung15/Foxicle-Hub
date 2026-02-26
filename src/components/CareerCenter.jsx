import { TrendingUp, Briefcase, Award, Star, ChevronRight, Zap } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function CareerCenter() {
    const { level, experience, officePosition, username } = useGameStore()

    const nextLevelThreshold = level * 100
    const progress = (experience / nextLevelThreshold) * 100

    const titles = [
        { lv: 0, name: '사원' },
        { lv: 10, name: '주임' },
        { lv: 20, name: '대리' },
        { lv: 30, name: '과장' },
        { lv: 40, name: '차장' },
        { lv: 50, name: '부장' },
        { lv: 60, name: '이사' },
        { lv: 70, name: '상무' },
        { lv: 80, name: '전무' },
        { lv: 90, name: '부사장' },
        { lv: 100, name: '사장' }
    ]

    const nextTitle = titles.find(t => t.lv > level) || { lv: 100, name: '정상' }

    return (
        <div className="career-container animate-fade">
            <header className="page-header">
                <h2>커리어 센터</h2>
                <p>루팡으로서의 명성, 당신의 직급이 증명합니다.</p>
            </header>

            <div className="career-main-card glass">
                <div className="profile-section">
                    <div className="profile-badge">
                        <Award size={40} color="var(--accent-blue)" />
                    </div>
                    <div className="profile-text">
                        <h3>{username}</h3>
                        <div className="current-pos">{officePosition}</div>
                    </div>
                    <div className="level-count">
                        LV.<span>{level}</span>
                    </div>
                </div>

                <div className="exp-section">
                    <div className="exp-header">
                        <span>현재 경험치</span>
                        <span>{experience.toLocaleString()} / {nextLevelThreshold.toLocaleString()} EXP</span>
                    </div>
                    <div className="exp-bar-container">
                        <div className="exp-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="next-goal">다음 승진({nextTitle.name})까지 <strong>{(nextLevelThreshold - experience).toLocaleString()} EXP</strong> 남았습니다.</p>
                </div>
            </div>

            <div className="career-path glass">
                <h3>커리어 로드맵</h3>
                <div className="path-list">
                    {titles.map((t, idx) => (
                        <div key={idx} className={`path-item ${level >= t.lv ? 'unlocked' : ''} ${officePosition === t.name ? 'current' : ''}`}>
                            <div className="level-marker">LV.{t.lv}</div>
                            <div className="rank-name">{t.name}</div>
                            {level >= t.lv ? <CheckCircleIcon /> : <Zap size={14} color="#ddd" />}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .career-container { text-align: left; max-width: 800px; margin: 0 auto; padding-bottom: 50px; }
                .page-header { margin-bottom: 40px; }
                .page-header h2 { font-size: 32px; font-weight: 800; margin-bottom: 10px; }

                .career-main-card { padding: 40px; margin-bottom: 30px; display: flex; flex-direction: column; gap: 30px; }
                .profile-section { display: flex; align-items: center; gap: 20px; position: relative; }
                .profile-badge { width: 80px; height: 80px; background: #e8f0fe; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
                .profile-text h3 { font-size: 24px; font-weight: 800; margin-bottom: 5px; }
                .current-pos { font-size: 16px; font-weight: 700; color: var(--accent-blue); background: #e8f0fe; padding: 4px 12px; border-radius: 20px; display: inline-block; }
                .level-count { position: absolute; right: 0; font-size: 14px; font-weight: 800; color: #86868b; }
                .level-count span { font-size: 32px; color: var(--text-primary); margin-left: 5px; }

                .exp-section { margin-top: 10px; }
                .exp-header { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: var(--text-secondary); margin-bottom: 15px; }
                .exp-bar-container { width: 100%; height: 12px; background: #f5f5f7; border-radius: 6px; overflow: hidden; margin-bottom: 15px; }
                .exp-bar { height: 100%; background: var(--accent-blue); border-radius: 6px; transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
                .next-goal { font-size: 14px; color: var(--text-secondary); }
                .next-goal strong { color: var(--text-primary); font-weight: 800; }

                .career-path { padding: 30px; }
                .career-path h3 { font-size: 18px; font-weight: 800; margin-bottom: 25px; }
                .path-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; }
                .path-item { 
                    padding: 15px; background: #f5f5f7; border-radius: 12px; text-align: center; 
                    display: flex; flex-direction: column; align-items: center; gap: 8px;
                    transition: all 0.2s; border: 2px solid transparent;
                }
                .path-item.unlocked { background: white; border-color: #eee; }
                .path-item.current { border-color: var(--accent-blue); background: rgba(0, 113, 227, 0.05); }
                .level-marker { font-size: 11px; font-weight: 800; color: #86868b; }
                .rank-name { font-size: 15px; font-weight: 800; }
            `}</style>
        </div>
    )
}

function CheckCircleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--status-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    )
}

export default CareerCenter
