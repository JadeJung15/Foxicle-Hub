import { create } from 'zustand'

const useGameStore = create((set) => ({
    // Economy State
    points: 1000,
    level: 1,
    experience: 0,

    // Pet & Inventory State
    pets: [],
    inventory: {
        eggs: 0
    },

    // Community State
    posts: [
        { id: 1, author: '운영자_루팡', content: '비밀 라운지에 오신 것을 환영합니다. 오늘도 효율적인 근무 되세요!', likes: 12, createdAt: new Date().toISOString() },
        { id: 2, author: '김과장', content: '혹시 이번 분기 예산안 엑셀 양식 가진 분 있나요? "몰컴"용으로 부탁드려요.', likes: 5, createdAt: new Date().toISOString() }
    ],

    // UI State
    isWorkMode: false,
    activeTab: 'dashboard', // dashboard, games, shop, community
    workTemplate: 'excel', // excel, ppt, slack

    // Customization State (New from sunofox-test)
    equippedAura: null,
    equippedBorder: null,
    equippedBackground: null,
    alchemyInventory: [], // { id, name, rarity, amount }

    // User Profile
    username: '루팡_' + Math.floor(Math.random() * 1000),
    officePosition: '사원',
    achievements: [
        { id: 'lv_5', title: '루팡 꿈나무', desc: '레벨 5 달성하기', target: 5, progress: 0, reward: 500, completed: false, claimed: false },
        { id: 'rich_10k', title: '자산가', desc: '10,000 FP 보유하기', target: 10000, progress: 0, reward: 1000, completed: false, claimed: false },
        { id: 'trader', title: '실전 투자자', desc: '주식/코인 10회 매수하기', target: 10, progress: 0, reward: 800, completed: false, claimed: false },
        { id: 'pet_fan', title: '폭시클 아빠', desc: '펫 3마리 보유하기', target: 3, progress: 0, reward: 600, completed: false, claimed: false }
    ],
    marketNews: {
        text: '평화로운 루팡의 날입니다.',
        impact: 1, // 1은 중립, >1은 호재, <1은 악재
        targetId: null // 특정 종목 타겟 (null이면 전체)
    },
    leaderboard: [
        { name: '김부장(은퇴희망)', level: 42, title: '전설의 루팡' },
        { name: '재무팀 박대리', level: 35, title: '투명인간' },
        { name: '영업2팀 최과장', level: 28, title: '코인 중독' },
        { name: '인사팀 정사원', level: 12, title: '꿈나무' }
    ],
    shopItems: [
        { id: 'exp_boost', name: '경험치 비약', desc: '1시간 동안 펫 획득 경험치 2배', price: 500, type: 'buff' },
        { id: 'income_boost', name: '업무 자동화 툴', desc: '1시간 동안 자동 수익 1.5배', price: 1000, type: 'buff' },
        { id: 'esc_custom', name: '위장 테마 패키지', desc: '위장 모드 전용 다크 테마 잠금 해제', price: 2000, type: 'unlock' },
        // Customization Items
        { id: 'aura_blue', name: '푸른 오라', desc: '프로필 주변에 푸른 빛이 감돕니다.', price: 3000, type: 'aura' },
        { id: 'border_gold', name: '황금 테두리', desc: '아이콘에 화려한 황금 테두리를 적용합니다.', price: 5000, type: 'border' },
        { id: 'bg_pixel', name: '픽셀 배경', desc: '프로필 배경을 레트로 픽셀 아트룸으로 변경합니다.', price: 4000, type: 'background' }
    ],
    ownedUpgrades: [],
    stocks: [
        { id: 'fox_electronics', name: '폭시전자', price: 1500, trend: 0, history: [1400, 1450, 1500] },
        { id: 'banana_tech', name: '바나나테크', price: 800, trend: 0, history: [850, 820, 800] },
        { id: 'office_coin', name: '오피스코인', price: 100, trend: 0, history: [90, 110, 100] }
    ],
    portfolio: [], // { stockId: string, amount: number, avgPrice: number }
    dailyMissions: [
        { id: 'spin_5', title: '오피스 슬롯 5회 스핀하기', progress: 0, target: 5, rewardPoints: 100, rewardExp: 20, completed: false },
        { id: 'escape_100', title: '상사 피하기 100점 돌파', progress: 0, target: 100, rewardPoints: 200, rewardExp: 50, completed: false },
        { id: 'alchemy_1', title: '황금빛 연금술 1회 시도', progress: 0, target: 1, rewardPoints: 300, rewardExp: 50, completed: false },
        { id: 'bomb_3', title: '위험한 폭탄 돌리기 3회 참여', progress: 0, target: 3, rewardPoints: 500, rewardExp: 100, completed: false }
    ],

    // Actions
    setPoints: (amount) => set((state) => ({ points: state.points + amount })),

    // 펫 시스템 액션
    buyEgg: () => set((state) => {
        const eggPrice = 500 // 반하자 가격: 500 FP
        if (state.points < eggPrice) {
            alert('포인트가 부족합니다! (필요: 500 FP)')
            return {}
        }
        return {
            points: state.points - eggPrice,
            inventory: { ...state.inventory, eggs: state.inventory.eggs + 1 }
        }
    }),

    hatchEgg: () => set((state) => {
        if (state.inventory.eggs <= 0) return {}

        const rarities = [
            { name: '일반', chance: 0.70, color: '#86868b' },
            { name: '희귀', chance: 0.25, color: '#0071e3' },
            { name: '전설', chance: 0.05, color: '#ff9500' }
        ]

        // 확률 기반 부화 로직
        const rand = Math.random()
        let cumulative = 0
        let selectedRarity = rarities[0]

        for (const r of rarities) {
            cumulative += r.chance
            if (rand < cumulative) {
                selectedRarity = r
                break
            }
        }

        const petTypes = ['폭시클', '루팡냥이', '오피스독', '구름여우']
        const newPet = {
            id: Date.now(),
            name: `${selectedRarity.name} ${petTypes[Math.floor(Math.random() * petTypes.length)]}`,
            rarity: selectedRarity.name,
            color: selectedRarity.color,
            level: 1,
            experience: 0,
            happiness: 100,
            createdAt: new Date().toISOString()
        }

        const newPets = [...state.pets, newPet]

        // 업적 체크: 펫 보유
        const newAchievements = state.achievements.map(a => {
            if (a.id === 'pet_fan' && !a.completed) {
                const prog = newPets.length
                return { ...a, progress: prog, completed: prog >= a.target }
            }
            return a
        })

        return {
            inventory: { ...state.inventory, eggs: state.inventory.eggs - 1 },
            pets: newPets,
            achievements: newAchievements
        }
    }),

    feedPet: (id) => set((state) => {
        const foodPrice = 50 // 먹이 가격
        if (state.points < foodPrice) {
            alert('포인트가 부족합니다!')
            return {}
        }
        return {
            points: state.points - foodPrice,
            pets: state.pets.map(pet => {
                if (pet.id === id) {
                    const newExp = pet.experience + 20
                    const neededExp = pet.level * 50
                    if (newExp >= neededExp) {
                        return { ...pet, level: pet.level + 1, experience: newExp - neededExp, happiness: Math.min(100, pet.happiness + 10) }
                    }
                    return { ...pet, experience: newExp, happiness: Math.min(100, pet.happiness + 5) }
                }
                return pet
            })
        }
    }),

    trainPet: (id) => set((state) => {
        const trainPrice = 100 // 훈련 가격
        if (state.points < trainPrice) {
            alert('포인트가 부족합니다!')
            return {}
        }
        return {
            points: state.points - trainPrice,
            pets: state.pets.map(pet => {
                if (pet.id === id) {
                    return { ...pet, experience: pet.experience + 50, happiness: Math.max(0, pet.happiness - 10) }
                }
                return pet
            })
        }
    }),

    autoEarnPoints: () => set((state) => {
        if (state.pets.length === 0) return {}

        // 펫들의 레벨 합에 비례하여 포인트 생성 (반하자 밸런스: 레벨당 1 FP)
        const totalLevel = state.pets.reduce((sum, pet) => sum + pet.level, 0)

        // 상점 버프 적용: 업무 자동화 툴 (1.5배)
        const hasBoost = state.ownedUpgrades.includes('income_boost')
        const bonusPoints = Math.floor(totalLevel * (hasBoost ? 1.5 : 1))

        return {
            points: state.points + bonusPoints
        }
    }),

    buyItem: (itemId) => set((state) => {
        const item = state.shopItems.find(i => i.id === itemId)
        if (!item || state.points < item.price) {
            alert('구매할 수 없습니다! (포인트 부족 혹은 아이템 정보 없음)')
            return {}
        }

        // 이미 보유한 영구 해금 아이템인지 체크
        if (item.type === 'unlock' && state.ownedUpgrades.includes(itemId)) {
            alert('이미 보유하고 있는 아이템입니다.')
            return {}
        }

        return {
            points: state.points - item.price,
            ownedUpgrades: [...state.ownedUpgrades, itemId]
        }
    }),

    addPost: (content) => set((state) => {
        const newPost = {
            id: Date.now(),
            author: state.username,
            content,
            likes: 0,
            createdAt: new Date().toISOString()
        }
        // 게시글 작성 시 포인트 및 경험치 보상 (활동 유도)
        setTimeout(() => state.earnPoints('chat'), 0)
        return { posts: [newPost, ...state.posts] }
    }),

    likePost: (id) => set((state) => ({
        posts: state.posts.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post)
    })),

    addExperience: (exp) => set((state) => {
        const newExp = state.experience + exp
        const levelUpThreshold = state.level * 100
        let newLevel = state.level
        let finalizedExp = newExp

        if (newExp >= levelUpThreshold) {
            newLevel = state.level + 1
            finalizedExp = newExp - levelUpThreshold
        }

        // 직급 자동 업데이트 로직
        const getPosition = (lv) => {
            if (lv >= 100) return '사장 (루팡의 정점)'
            if (lv >= 90) return '부사장'
            if (lv >= 80) return '전무'
            if (lv >= 70) return '상무'
            if (lv >= 60) return '이사'
            if (lv >= 50) return '부장'
            if (lv >= 40) return '차장'
            if (lv >= 30) return '과장'
            if (lv >= 20) return '대리'
            if (lv >= 10) return '주임'
            return '사원'
        }

        // 업적 체크: 레벨업
        const newAchievements = state.achievements.map(a => {
            if (a.id === 'lv_5' && !a.completed) {
                const prog = Math.max(a.progress, newLevel)
                return { ...a, progress: prog, completed: prog >= a.target }
            }
            return a
        })

        return {
            level: newLevel,
            experience: finalizedExp,
            officePosition: getPosition(newLevel),
            achievements: newAchievements
        }
    }),

    toggleWorkMode: () => set((state) => ({ isWorkMode: !state.isWorkMode })),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setWorkTemplate: (template) => set({ workTemplate: template }),

    // Semi-Hard Economy Logic: 포인트 지급 함수 (난이도 조절 및 업적 체크)
    earnPoints: (type) => set((state) => {
        let baseAmount = 0
        let expGain = 0

        switch (type) {
            case 'checkin':
                baseAmount = 50
                expGain = 10
                break
            case 'chat':
                baseAmount = 5
                expGain = 2
                break
            case 'game_win_small':
                baseAmount = 20
                expGain = 5
                break
            default:
                baseAmount = 0
        }

        const newPoints = state.points + baseAmount
        const newExp = state.experience + expGain

        // 업적 체크: 자산가
        const newAchievements = state.achievements.map(a => {
            if (a.id === 'rich_10k' && !a.completed) {
                const prog = Math.max(a.progress, newPoints)
                return { ...a, progress: prog, completed: prog >= a.target }
            }
            return a
        })

        return {
            points: newPoints,
            experience: newExp,
            achievements: newAchievements
        }
    }),

    // 투자 시스템 액션: 뉴스 연동 고도화
    updateStockPrices: () => set((state) => {
        // 1. 뉴스 갱신 (10% 확률로 새로운 소식)
        let nextNews = state.marketNews
        if (Math.random() < 0.1) {
            const newsPool = [
                { text: '폭시전자, 신형 키보드 출시 임박! 시장의 기대감이 높습니다.', impact: 1.2, targetId: 'fox_electronics' },
                { text: '바나나테크, 서버실 화재 발생.. 복구에 난항이 예상됩니다.', impact: 0.7, targetId: 'banana_tech' },
                { text: '오피스코인, 정부 규제 소식에 투자 심리가 위축되었습니다.', impact: 0.5, targetId: 'office_coin' },
                { text: '전체 시장에 훈풍이 붑니다. 정부의 워라밸 지원금 발표!', impact: 1.1, targetId: null },
                { text: '루팡들의 대규모 퇴사 열풍? 노동 생산성 저하 우려.', impact: 0.9, targetId: null }
            ]
            nextNews = newsPool[Math.floor(Math.random() * newsPool.length)]
        }

        const nextStocks = state.stocks.map(s => {
            const isTarget = nextNews.targetId === s.id || nextNews.targetId === null
            const newsModifier = isTarget ? nextNews.impact : 1
            const randomVolatility = (Math.random() - 0.5) * (s.id === 'office_coin' ? 60 : 20)

            // 뉴스 영향력 반영 가격 변동
            const change = (randomVolatility * newsModifier) + (newsModifier > 1 ? 5 : newsModifier < 1 ? -5 : 0)
            const newPrice = Math.max(5, Math.floor(s.price + change))

            return {
                ...s,
                price: newPrice,
                trend: change,
                history: [...s.history.slice(-9), newPrice]
            }
        })

        return { stocks: nextStocks, marketNews: nextNews }
    }),

    buyStock: (stockId, amount) => set((state) => {
        const stock = state.stocks.find(s => s.id === stockId)
        const totalCost = stock.price * amount
        if (state.points < totalCost) {
            alert('포인트가 부족합니다!')
            return {}
        }

        const existing = state.portfolio.find(p => p.stockId === stockId)
        let newPortfolio
        if (existing) {
            const newAmount = existing.amount + amount
            const newAvgPrice = ((existing.avgPrice * existing.amount) + totalCost) / newAmount
            newPortfolio = state.portfolio.map(p => p.stockId === stockId ? { ...p, amount: newAmount, avgPrice: newAvgPrice } : p)
        } else {
            newPortfolio = [...state.portfolio, { stockId, amount, avgPrice: stock.price }]
        }

        // 업적 체크: 실전 투자자
        const newAchievements = state.achievements.map(a => {
            if (a.id === 'trader' && !a.completed) {
                const prog = a.progress + 1
                return { ...a, progress: prog, completed: prog >= a.target }
            }
            return a
        })

        return {
            points: state.points - totalCost,
            portfolio: newPortfolio,
            achievements: newAchievements
        }
    }),

    sellStock: (stockId, amount) => set((state) => {
        const pos = state.portfolio.find(p => p.stockId === stockId)
        if (!pos || pos.amount < amount) {
            alert('보유 수량이 부족합니다!')
            return {}
        }

        const stock = state.stocks.find(s => s.id === stockId)
        const totalReturn = stock.price * amount

        const newPortfolio = state.portfolio.map(p => {
            if (p.stockId === stockId) {
                return { ...p, amount: p.amount - amount }
            }
            return p
        }).filter(p => p.amount > 0)

        return {
            points: state.points + totalReturn,
            portfolio: newPortfolio
        }
    }),

    // 업적 보상 수령 Action
    claimAchievement: (id) => set((state) => {
        const achievement = state.achievements.find(a => a.id === id)
        if (!achievement || !achievement.completed || achievement.claimed) return {}

        return {
            points: state.points + achievement.reward,
            achievements: state.achievements.map(a => a.id === id ? { ...a, claimed: true } : a)
        }
    }),

    // 활동 트래킹 및 미션 로직
    trackActivity: (missionId, value = 1) => set((state) => {
        const nextMissions = state.dailyMissions.map(m => {
            if (m.id === missionId && !m.completed) {
                const newProgress = missionId === 'escape_100' ? Math.max(m.progress, value) : m.progress + value
                const isNowCompleted = newProgress >= m.target

                if (isNowCompleted && !m.completed) {
                    // 보상 즉시 지급
                    setTimeout(() => {
                        set((s) => ({
                            points: s.points + m.rewardPoints,
                            experience: s.experience + m.rewardExp
                        }))
                    }, 0)
                }

                return { ...m, progress: newProgress, completed: isNowCompleted }
            }
            return m
        })
        return { dailyMissions: nextMissions }
    }),

    // New Game Actions (Integrated from sunofox-test)
    playAlchemy: () => set((state) => {
        const successRate = 0.6
        const isSuccess = Math.random() < successRate

        if (!isSuccess) {
            setTimeout(() => state.trackActivity('alchemy_1'), 0)
            return { points: Math.max(0, state.points - 200) }
        }

        const resultExp = 300
        const resultPoints = 1000
        setTimeout(() => {
            state.addExperience(resultExp)
            state.trackActivity('alchemy_1')
        }, 0)
        return { points: state.points + resultPoints }
    }),

    playBombGame: (betAmount, riskLevel) => set((state) => {
        if (state.points < betAmount) {
            alert('포인트가 부족합니다!')
            return {}
        }

        setTimeout(() => state.trackActivity('bomb_3'), 0)
        const winChance = riskLevel === 'high' ? 0.3 : 0.7
        const multiplier = riskLevel === 'high' ? 3.5 : 1.4
        const isWin = Math.random() < winChance

        if (isWin) {
            return { points: state.points + Math.floor(betAmount * multiplier) }
        } else {
            return { points: state.points - betAmount }
        }
    }),

    applyCustom: (type, itemId) => set((state) => {
        if (type === 'aura') return { equippedAura: itemId }
        if (type === 'border') return { equippedBorder: itemId }
        if (type === 'background') return { equippedBackground: itemId }
        return {}
    })
}))

export default useGameStore
