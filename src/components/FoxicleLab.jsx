import { useState } from 'react'
import { PawPrint, ShoppingCart, Zap, Heart, Info, Star } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function FoxicleLab() {
    const { points, inventory, pets, buyEgg, hatchEgg, feedPet, trainPet } = useGameStore()
    const [isHatching, setIsHatching] = useState(false)

    const handleHatch = () => {
        if (inventory.eggs <= 0) return
        setIsHatching(true)

        // 부화 애니메이션 시뮬레이션
        setTimeout(() => {
            hatchEgg()
            setIsHatching(false)
        }, 2000)
    }

    return (
        <div className="lab-container">
            {/* 1. 상단: 알 상점 및 인벤토리 */}
            <div className="shop-section glass">
                <div className="section-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShoppingCart size={22} color="var(--accent-blue)" />
                        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>연구소 보관함</h2>
                    </div>
                    <div className="egg-counter">
                        <Zap size={14} />
                        <span>보유 중인 알: {inventory.eggs}개</span>
                    </div>
                </div>

                <div className="shop-actions">
                    <div className="egg-info">
                        <h3>프리미엄 폭시클 알</h3>
                        <p>생체 데이터가 포함된 무작위 폭시클 동료가 잠들어 있습니다.</p>
                        <div className="price-tag">500 FP</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-primary" onClick={buyEgg}>구매하기</button>
                        <button
                            className="btn btn-outline"
                            onClick={handleHatch}
                            disabled={isHatching || inventory.eggs <= 0}
                        >
                            {isHatching ? '부화 진행 중...' : '부화하기'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. 하단: 내 펫 목록 */}
            <div className="pets-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>내 동료 목록</h2>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-blue)' }}>
                            자동 수익: +{pets.reduce((sum, p) => sum + p.level, 0)} FP / 10초
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>총 {pets.length}마리</span>
                    </div>
                </div>

                {pets.length === 0 ? (
                    <div className="empty-pets glass">
                        <PawPrint size={48} color="#e1e1e3" />
                        <p>보유 중인 동료가 없습니다. 알을 구매하여 첫 동료를 만나보세요.</p>
                    </div>
                ) : (
                    <div className="pets-grid">
                        {pets.map(pet => (
                            <div key={pet.id} className="pet-card glass">
                                <div className="pet-rarity" style={{ color: pet.color }}>{pet.rarity}</div>
                                <div className="pet-avatar" style={{ backgroundColor: `${pet.color}15` }}>
                                    <PawPrint size={40} color={pet.color} />
                                </div>
                                <div className="pet-info">
                                    <h3 className="pet-name">{pet.name}</h3>
                                    <div className="pet-stats">
                                        <div className="stat">
                                            <Star size={12} color="#ffcc00" fill="#ffcc00" />
                                            <span>Lv.{pet.level}</span>
                                        </div>
                                        <div className="stat">
                                            <Heart size={12} color="#ff3b30" fill="#ff3b30" />
                                            <span>{pet.happiness}%</span>
                                        </div>
                                    </div>

                                    {/* EXP Bar */}
                                    <div className="pet-exp-container">
                                        <div className="pet-exp-bar">
                                            <div className="pet-exp-fill" style={{
                                                width: `${(pet.experience / (pet.level * 50)) * 100}%`,
                                                backgroundColor: pet.color
                                            }}></div>
                                        </div>
                                        <span className="exp-text">{pet.experience} / {pet.level * 50}</span>
                                    </div>

                                    <div className="pet-yield">
                                        수익: <span style={{ fontWeight: '700' }}>+{pet.level} FP</span>
                                    </div>
                                </div>
                                <div className="pet-actions">
                                    <button className="btn-small" onClick={() => feedPet(pet.id)}>
                                        먹이 (50)
                                    </button>
                                    <button className="btn-small" onClick={() => trainPet(pet.id)}>
                                        훈련 (100)
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .lab-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
          text-align: left;
        }

        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: var(--radius-lg);
        }

        .shop-section {
          padding: 30px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .egg-counter {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--accent-blue);
          background: rgba(0, 113, 227, 0.1);
          padding: 6px 14px;
          border-radius: 20px;
        }

        .shop-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-secondary);
          padding: 24px;
          border-radius: var(--radius-md);
        }

        .egg-info h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .egg-info p {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .price-tag {
          font-weight: 700;
          color: var(--accent-blue);
          font-size: 16px;
        }

        .pets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .pet-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: var(--transition-smooth);
        }

        .pet-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08);
        }

        .pet-rarity {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 15px;
          letter-spacing: 1px;
        }

        .pet-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .pet-name {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
          text-align: center;
        }

        .pet-stats {
          display: flex;
          gap: 15px;
          margin-bottom: 12px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .pet-exp-container {
          width: 100%;
          margin-bottom: 15px;
          text-align: center;
        }

        .pet-exp-bar {
          width: 100%;
          height: 6px;
          background: #eee;
          border-radius: 3px;
          margin-bottom: 4px;
          overflow: hidden;
        }

        .pet-exp-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .exp-text {
          font-size: 10px;
          color: var(--text-secondary);
        }

        .pet-yield {
          font-size: 12px;
          color: var(--accent-blue);
          margin-bottom: 15px;
        }

        .pet-actions {
          display: flex;
          gap: 8px;
          width: 100%;
        }

        .btn-small {
          flex: 1;
          background: white;
          border: 1px solid #e1e1e3;
          padding: 8px 4px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-small:hover {
          background: #f5f5f7;
          border-color: var(--accent-blue);
          color: var(--accent-blue);
        }

        .empty-pets {
          padding: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          color: var(--text-secondary);
          border: 1px dashed #e1e1e3;
        }
      `}</style>
        </div>
    )
}

export default FoxicleLab
