import { useEffect } from 'react'
import useGameStore from './store/useGameStore'
import GameCenter from './components/GameCenter'
import FoxicleLab from './components/FoxicleLab'
import ItemShop from './components/ItemShop'
import Investment from './components/Investment'
import CommunityLounge from './components/CommunityLounge'
import {
    Monitor,
    Briefcase,
    TrendingUp,
    PawPrint,
    MessageSquare,
    User,
    Zap,
    ShieldAlert,
    FileText,
    MessageCircle,
    Layout,
    Trophy,
    Medal,
    ShoppingBag,
    LineChart
} from 'lucide-react'

function App() {
    const {
        points,
        level,
        experience,
        isWorkMode,
        activeTab,
        workTemplate,
        username,
        officePosition,
        leaderboard,
        toggleWorkMode,
        setActiveTab,
        setWorkTemplate,
        earnPoints,
        autoEarnPoints
    } = useGameStore()

    // 자동 포인트 수익 타이머 (10초마다)
    useEffect(() => {
        const timer = setInterval(() => {
            autoEarnPoints()
        }, 10000)
        return () => clearInterval(timer)
    }, [autoEarnPoints])

    // ESC 키로 몰컴 모드 전환
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') toggleWorkMode()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [toggleWorkMode])

    if (isWorkMode) {
        if (workTemplate === 'ppt') return <PPTMockup />
        if (workTemplate === 'slack') return <SlackMockup />
        return <ExcelMockup />
    }

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar glass">
                <div className="brand">
                    <Zap size={24} style={{ color: '#0071e3' }} />
                    <span className="brand-name">Foxicle Hub</span>
                </div>

                <nav className="nav-menu">
                    <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Monitor size={20} />} label="대시보드" />
                    <NavItem active={activeTab === 'games'} onClick={() => setActiveTab('games')} icon={<TrendingUp size={20} />} label="포인트 거래소" />
                    <NavItem active={activeTab === 'pets'} onClick={() => setActiveTab('pets')} icon={<PawPrint size={20} />} label="폭시클 연구소" />
                    <NavItem active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<ShoppingBag size={20} />} label="포인트 상점" />
                    <NavItem active={activeTab === 'invest'} onClick={() => setActiveTab('invest')} icon={<LineChart size={20} />} label="루팡 재테크" />
                    <NavItem active={activeTab === 'community'} onClick={() => setActiveTab('community')} icon={<MessageSquare size={20} />} label="비밀 라운지" />
                </nav>

                <div className="user-profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <div className="user-info">
                        <p className="username">{username}</p>
                        <p className="position">{officePosition}</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <div className="status-item">
                        <span className="label">보뉴 포인트</span>
                        <span className="value">{points.toLocaleString()} FP</span>
                    </div>
                    <div className="status-item">
                        <span className="label">업무 효율 등급</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="level-badge">Lv.{level}</span>
                            <div className="exp-bar">
                                <div className="exp-fill" style={{ width: `${(experience / (level * 100)) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => earnPoints('checkin')}>
                        일일 출근 체크
                    </button>
                </header>

                <section className="content-view container" style={{ paddingTop: '40px' }}>
                    {activeTab === 'dashboard' && (
                        <div className="dashboard-layout">
                            <div className="dashboard-main">
                                <div className="hero-section" style={{ padding: '20px 0' }}>
                                    <h1 className="hero-title">비밀스럽고 완벽한 업무 파트너.</h1>
                                    <p className="hero-desc">한국 직장인들을 위한 프리미엄 월급루팡 플랫폼입니다.</p>
                                </div>

                                {/* Template Switcher */}
                                <div className="template-selector glass" style={{ padding: '24px', marginBottom: '30px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <Layout size={18} color="var(--accent-blue)" />
                                        <span style={{ fontWeight: '600' }}>위장 모드 템플릿 선택</span>
                                    </div>
                                    <div className="template-grid">
                                        <TemplateBtn
                                            active={workTemplate === 'excel'}
                                            onClick={() => setWorkTemplate('excel')}
                                            icon={<FileText size={18} color="#217346" />}
                                            label="Excel"
                                            desc="수치 중심 사무직용"
                                        />
                                        <TemplateBtn
                                            active={workTemplate === 'ppt'}
                                            onClick={() => setWorkTemplate('ppt')}
                                            icon={<Layout size={18} color="#D24726" />}
                                            label="PPT"
                                            desc="기획/보고 중심용"
                                        />
                                        <TemplateBtn
                                            active={workTemplate === 'slack'}
                                            onClick={() => setWorkTemplate('slack')}
                                            icon={<MessageCircle size={18} color="#4A154B" />}
                                            label="Slack"
                                            desc="IT/스타트업용"
                                        />
                                    </div>
                                    <p style={{ marginTop: '15px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        * <kbd>ESC</kbd> 키를 누르면 선택한 템플릿으로 화먼이 즉시 전환됩니다.
                                    </p>
                                </div>

                                <div className="dashboard-grid">
                                    <FeatureCard
                                        title="예측 분석 시스템"
                                        desc="주식 단타 스타일의 미니게임으로 자산을 운용하세요."
                                        icon={<TrendingUp size={32} color="#0071e3" />}
                                        status="활성"
                                    />
                                    <FeatureCard
                                        title="생체 보안 파트너"
                                        desc="보유한 펫의 레벨에 따라 10초마다 자동 수익이 발생합니다."
                                        icon={<PawPrint size={32} color="#34c759" />}
                                        status="자동수익 중"
                                    />
                                </div>
                            </div>

                            {/* Sidebar: Leaderboard */}
                            <aside className="dashboard-aside">
                                <div className="leaderboard-card glass">
                                    <div className="leaderboard-header">
                                        <Trophy size={18} color="#ff9500" />
                                        <h3>루팡 명예의 전당</h3>
                                    </div>
                                    <div className="leaderboard-list">
                                        {leaderboard.map((user, i) => (
                                            <div key={i} className="leaderboard-item">
                                                <div className="rank">
                                                    {i === 0 ? <Medal size={16} color="#ffcc00" /> : i + 1}
                                                </div>
                                                <div className="user-meta">
                                                    <div className="name">{user.name}</div>
                                                    <div className="title">{user.title}</div>
                                                </div>
                                                <div className="level">Lv.{user.level}</div>
                                            </div>
                                        ))}
                                        <div className="leaderboard-item self">
                                            <div className="rank">?</div>
                                            <div className="user-meta">
                                                <div className="name">{username} (나)</div>
                                                <div className="title">성장 중인 루팡</div>
                                            </div>
                                            <div className="level">Lv.{level}</div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}

                    {activeTab === 'games' && (
                        <div style={{ marginTop: '0' }}>
                            <GameCenter />
                        </div>
                    )}

                    {activeTab === 'pets' && (
                        <div style={{ marginTop: '0' }}>
                            <FoxicleLab />
                        </div>
                    )}

                    {activeTab === 'shop' && (
                        <div style={{ marginTop: '0' }}>
                            <ItemShop />
                        </div>
                    )}

                    {activeTab === 'invest' && (
                        <div style={{ marginTop: '0' }}>
                            <Investment />
                        </div>
                    )}

                    {activeTab === 'community' && (
                        <div style={{ marginTop: '0' }}>
                            <CommunityLounge />
                        </div>
                    )}
                </section>
            </main>

            <style>{`
        .app-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background-color: var(--bg-secondary);
        }

        .sidebar {
          width: 260px;
          display: flex;
          flex-direction: column;
          padding: 30px 20px;
          z-index: 100;
          height: 100%;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 50px;
          padding-left: 10px;
        }

        .brand-name {
          font-weight: 600;
          font-size: 19px;
          letter-spacing: -0.5px;
        }

        .nav-menu {
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          cursor: pointer;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
          margin-bottom: 4px;
        }

        .nav-item:hover, .nav-item.active {
          background: rgba(0, 113, 227, 0.08);
          color: var(--accent-blue);
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 30px;
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .template-btn {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid rgba(0,0,0,0.05);
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .template-btn:hover {
          border-color: var(--accent-blue);
        }

        .template-btn.active {
          border-color: var(--accent-blue);
          background: rgba(0, 113, 227, 0.05);
        }

        .leaderboard-card {
          padding: 24px;
          border-radius: var(--radius-lg);
          height: 100%;
          text-align: left;
        }

        .leaderboard-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .leaderboard-header h3 {
          font-size: 16px;
          font-weight: 700;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(0,0,0,0.02);
          border-radius: 10px;
        }

        .leaderboard-item.self {
          background: rgba(0, 113, 227, 0.05);
          border: 1px solid rgba(0, 113, 227, 0.1);
          margin-top: 10px;
        }

        .rank {
          width: 24px;
          text-align: center;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .user-meta {
          flex: 1;
        }

        .name {
          font-size: 13px;
          font-weight: 600;
        }

        .title {
          font-size: 10px;
          color: var(--text-secondary);
        }

        .level {
          font-weight: 700;
          color: var(--accent-blue);
          font-size: 13px;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: rgba(0,0,0,0.03);
          border-radius: var(--radius-md);
        }

        .avatar {
          width: 36px;
          height: 36px;
          background: #e1e1e3;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .username {
          font-weight: 600;
          font-size: 14px;
        }

        .position {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-primary);
          overflow-y: auto;
        }

        .top-bar {
          height: var(--navbar-height);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          padding: 0 40px;
          justify-content: flex-end;
          gap: 30px;
        }

        .status-item {
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 10px;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
        }

        .value {
          font-weight: 600;
          font-size: 15px;
        }

        .level-badge {
          font-weight: 700;
          color: var(--accent-blue);
          font-size: 14px;
        }

        .exp-bar {
          width: 80px;
          height: 4px;
          background: #eee;
          border-radius: 2px;
        }

        .exp-fill {
          height: 100%;
          background: var(--accent-blue);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .hero-section {
          text-align: left;
        }

        .hero-title {
          font-size: 44px;
          font-weight: 700;
          letter-spacing: -1.5px;
          line-height: 1.2;
          margin-bottom: 20px;
          word-break: keep-all;
        }

        .hero-desc {
          color: var(--text-secondary);
          font-size: 18px;
          max-width: 600px;
          word-break: keep-all;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          padding-bottom: 60px;
        }

        .feature-card {
          padding: 24px;
          border-radius: var(--radius-lg);
          background: var(--bg-secondary);
          transition: var(--transition-smooth);
          border: 1px solid transparent;
          text-align: left;
        }

        .feature-card:hover {
          background: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border-color: rgba(0,0,0,0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .card-status {
          font-size: 10px;
          padding: 4px 10px;
          background: white;
          border-radius: 10px;
          font-weight: 700;
          color: var(--accent-blue);
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .card-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        kbd {
          background-color: #eee;
          border-radius: 3px;
          border: 1px solid #b4b4b4;
          box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;
          color: #333;
          display: inline-block;
          font-size: .85em;
          font-weight: 700;
          line-height: 1;
          padding: 2px 4px;
          white-space: nowrap;
        }
      `}</style>
        </div>
    )
}

function NavItem({ active, onClick, icon, label }) {
    return (
        <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
            {icon}
            <span>{label}</span>
        </div>
    )
}

function TemplateBtn({ active, onClick, icon, label, desc }) {
    return (
        <button className={`template-btn ${active ? 'active' : ''}`} onClick={onClick}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon}
                <span style={{ fontWeight: '700', fontSize: '13px' }}>{label}</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{desc}</span>
        </button>
    )
}

function FeatureCard({ title, desc, icon, status }) {
    return (
        <div className="feature-card">
            <div className="card-header">
                {icon}
                <span className="card-status">{status}</span>
            </div>
            <h3 className="card-title">{title}</h3>
            <p className="card-desc">{desc}</p>
        </div>
    )
}

function ExcelMockup() {
    return (
        <div style={{
            backgroundColor: '#fff',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '"Malgun Gothic", "Apple SD Gothic Neo", sans-serif',
            color: '#000',
            textAlign: 'left'
        }}>
            <div style={{ backgroundColor: '#217346', color: 'white', padding: '10px 20px', display: 'flex', gap: '20px', fontSize: '14px' }}>
                <span style={{ fontWeight: 'bold' }}>파일</span>
                <span>홈</span>
                <span>삽입</span>
                <span>그리기</span>
                <span>페이지 레이아웃</span>
                <span>수식</span>
                <span>데이터</span>
            </div>

            <div style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', display: 'flex', gap: '15px', color: '#666', fontSize: '13px' }}>
                <Briefcase size={16} /> | <span style={{ color: '#000' }}>[A1]</span> v | [ fx ] <span style={{ background: '#f3f3f3', padding: '2px 10px', flex: 1 }}>=SUM(B2:B50)</span>
            </div>

            <div style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
                <div style={{ width: '40px', backgroundColor: '#f3f3f3', borderRight: '1px solid #ddd' }}>
                    {[...Array(50)].map((_, i) => (
                        <div key={i} style={{ height: '24px', textAlign: 'center', fontSize: '11px', lineHeight: '24px', borderBottom: '1px solid #ddd' }}>{i + 1}</div>
                    ))}
                </div>
                <div style={{ flex: 1 }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f3f3f3' }}>
                                {['A', 'B', 'C', 'D', 'E', 'F'].map(c => (
                                    <th key={c} style={{ border: '1px solid #ddd', width: '150px', height: '24px', fontWeight: 'normal' }}>{c}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ height: '24px' }}>
                                <td style={{ border: '1px solid #eee', padding: '0 5px', backgroundColor: '#e8f0fe' }}>2026년 상반기 예산 집행안</td>
                                <td style={{ border: '1px solid #eee', padding: '0 5px' }}></td>
                                <td style={{ border: '1px solid #eee', padding: '0 5px' }}></td>
                                <td style={{ border: '1px solid #eee', padding: '0 5px' }}></td>
                                <td style={{ border: '1px solid #eee', padding: '0 5px' }}></td>
                                <td style={{ border: '1px solid #eee', padding: '0 5px' }}></td>
                            </tr>
                            <tr style={{ height: '24px' }}>
                                <td style={{ border: '1px solid #eee', padding: '0 5px' }}>총 예상 매출액</td>
                                <td style={{ border: '1px solid #eee', padding: '0 5px', textAlign: 'right' }}>₩350,000,000</td>
                                <td style={{ border: '1px solid #eee', padding: '0 5px' }}></td>
                                <td style={{ border: '1px solid #eee', padding: '0 5px' }}></td>
                                <td style={{ border: '1px solid #eee', padding: '0 5px' }}></td>
                                <td style={{ border: '1px solid #eee', padding: '0 5px' }}></td>
                            </tr>
                            {[...Array(28)].map((_, r) => (
                                <tr key={r} style={{ height: '24px' }}>
                                    {[...Array(6)].map((_, c) => (
                                        <td key={c} style={{ border: '1px solid #eee', padding: '0 5px' }}></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ backgroundColor: '#217346', height: '24px', color: 'white', fontSize: '11px', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
                <span>준비</span>
                <span>ESC를 눌러 보안 해제 | + 100%</span>
            </div>
        </div>
    )
}

function PPTMockup() {
    return (
        <div style={{
            backgroundColor: '#f3f3f3',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '"Malgun Gothic", sans-serif',
            color: '#333'
        }}>
            <div style={{ backgroundColor: '#D24726', color: 'white', padding: '10px 20px', display: 'flex', gap: '20px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold' }}>파일</span>
                <span>홈</span>
                <span>삽입</span>
                <span>디자인</span>
                <span>전환</span>
                <span>애니메이션</span>
                <span>슬라이드 쇼</span>
            </div>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ width: '200px', backgroundColor: '#fff', borderRight: '1px solid #ddd', padding: '20px' }}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{ width: '160px', height: '90px', border: i === 0 ? '2px solid #D24726' : '1px solid #ddd', marginBottom: '15px', position: 'relative', background: '#fff' }}>
                            <span style={{ fontSize: '10px', position: 'absolute', left: '-15px' }}>{i + 1}</span>
                            {i === 0 && <div style={{ background: '#f5f5f5', height: '30%', margin: '15%' }}></div>}
                        </div>
                    ))}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '900px',
                        aspectRatio: '16/9',
                        backgroundColor: '#fff',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        padding: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#D24726', borderBottom: '2px solid #D24726', paddingBottom: '20px', marginBottom: '20px' }}>
                            신규 사업 기획 보고서
                        </h1>
                        <p style={{ fontSize: '24px', color: '#666' }}>2026 Strategy & Vision 컨설팅</p>
                        <div style={{ marginTop: 'auto', textAlign: 'right', color: '#999', fontSize: '18px' }}>
                            전략기획팀
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SlackMockup() {
    return (
        <div style={{
            backgroundColor: '#fff',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            fontFamily: '"Malgun Gothic", sans-serif',
            color: '#1d1c1d'
        }}>
            <div style={{ width: '260px', backgroundColor: '#4A154B', color: 'rgba(255,255,255,0.7)', padding: '20px' }}>
                <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px' }}>Workspace v</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '15px' }}>
                    <span># 일반 (general)</span>
                    <span style={{ color: 'white', background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px' }}># 필독-공지사항</span>
                    <span># 프로젝트-알파</span>
                    <span># 디자인-레퍼런스</span>
                    <span># 개발-로그</span>
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header style={{ height: '64px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px', fontWeight: 'bold' }}>
                    # 필독-공지사항
                </header>
                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
                    <SlackMsg author="인사팀 정과장" time="오전 09:30" content="[전사 공지] 올해 성과급 지급 일정 안내드립니다. 상세 내용은 사내 게시판을 확인해주세요." />
                    <SlackMsg author="IT지원팀" time="오전 10:15" content="금일 오후 2시부터 서버 점검이 예정되어 있습니다. 업무에 참고하시기 바랍니다." />
                    <SlackMsg author="개발1팀 이대리" time="오전 11:05" content="API 문서 업데이트 완료했습니다. @here 확인 부탁드려요." />
                </div>
                <div style={{ padding: '20px' }}>
                    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', color: '#999' }}>#필독-공지사항 에 메시지 보내기</div>
                </div>
            </div>
        </div>
    )
}

function SlackMsg({ author, time, content }) {
    return (
        <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ width: '36px', height: '36px', background: '#ddd', borderRadius: '4px' }}></div>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold' }}>{author}</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>{time}</span>
                </div>
                <div style={{ fontSize: '15px', lineHeight: '1.5' }}>{content}</div>
            </div>
        </div>
    )
}

export default App
