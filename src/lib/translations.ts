export type Lang = "ko" | "en";

// ---------------------------------------------------------------------------
// Korean
// ---------------------------------------------------------------------------
const ko = {
  nav: {
    homeLabel: "PRISME 홈",
    search: "검색",
    account: "계정 메뉴",
    signIn: "로그인",
    menuOpen: "메뉴 열기",
    primaryNav: "주요 내비게이션",
  },
  drawer: {
    label: "내비게이션 메뉴",
    close: "메뉴 닫기",
    primaryNav: "주요 메뉴",
    secondaryNav: "탐색",
    links: {
      essential: "Iris",
      collections: "Collections",
      bestPieces: "Best Pieces",
      fwCollections: "FW Collections",
      materials: "소재",
      process: "제작 공정",
      archive: "아카이브",
      contact: "문의",
    },
    theme: {
      label: "테마",
      dark: "다크",
      light: "라이트",
    },
  },
  auth: {
    wishlist: "Wishlist",
    logout: "로그아웃",
    modalLogin: "로그인",
    modalSignup: "회원가입",
    modalClose: "닫기",
    login: "로그인",
    signup: "회원가입",
    loggingIn: "로그인 중...",
    signingUp: "회원가입 중...",
    noAccount: "계정이 없으신가요?",
    hasAccount: "이미 계정이 있으신가요?",
    signUpLink: "회원가입",
    loginLink: "로그인",
    confirmCloseBody: "입력 중인 내용이 사라져요.\n그래도 닫으시겠어요?",
    continueEditing: "계속 작성하기",
    close: "닫기",
    showPassword: "비밀번호 표시",
    hidePassword: "비밀번호 숨기기",
    showConfirmPassword: "비밀번호 확인 표시",
    hideConfirmPassword: "비밀번호 확인 숨기기",
    errors: {
      nameRequired: "성함을 입력해 주세요.",
      emailRequired: "이메일 주소를 입력해 주세요.",
      emailInvalid:
        "올바른 이메일 형식으로 입력해 주세요. (예: name@domain.com)",
      passwordRequired: "비밀번호를 입력해 주세요.",
      passwordTooShort: "비밀번호는 8자 이상으로 설정해 주세요.",
      confirmPasswordRequired: "비밀번호 확인을 입력해 주세요.",
      confirmPasswordMismatch:
        "비밀번호가 일치하지 않습니다. 다시 확인해 주세요.",
      loginFailed: "이메일 또는 비밀번호를 확인해 주세요.",
      emailInvalidSignup: "올바른 이메일 주소를 입력해 주세요.",
      passwordTooShortSignup: "비밀번호는 8자 이상으로 설정해 주세요.",
      nameRequiredSignup: "이름을 입력해 주세요.",
    },
    namePlaceholder: "성함",
  },
  search: {
    label: "상품 검색",
    placeholder: "작품명 또는 컬렉션 검색",
    submit: "검색",
    escHint: "ESC로 닫기",
  },
  wishlistBtn: {
    add: "위시리스트에 추가",
    remove: "위시리스트에서 제거",
  },
  productCard: {
    imageAlt: (name: string) => `${name} 상품 이미지`,
    collectionImageAlt: (name: string) => `${name} 컬렉션 이미지`,
    addToWishlist: "위시리스트에 추가",
    removeFromWishlist: "위시리스트에서 제거",
  },
  loading: {
    label: "로딩 중",
  },
  relatedScroll: {
    prev: "이전",
    next: "다음",
  },
  hero: {
    sectionLabel: "PRISME 메인 히어로",
    canvasLabel: "스크롤에 반응하는 반지 3D 애니메이션",
    tagline1: "현대 주얼리의 본질을 가장 순수한 형태와 완벽한 균형으로.",
    collectionLabel: "COLLECTION",
    essentialLine1: "ESSENTIAL",
    essentialLine2: "COLLECTION",
    essentialDesc:
      "절제와 정밀이 만나는 지점.\n가장 단순한 형태 안에 소재의 본질을 담았습니다.",
    cta: "컬렉션 살펴보기 →",
    scroll: "SCROLL",
  },
  bestPiecesSection: {
    sub: "가장 많은 사랑을 받은, PRISME의 시그니처 피스입니다.",
    listLabel: "베스트 상품 목록",
    viewAll: "전체 상품 보기 →",
  },
  collectionsSection: {
    sub: "현대적인 조형성과 정교한 소재가 만나는 곳, PRISME의 컬렉션을 만나보세요.",
    listLabel: "컬렉션 목록",
    viewAll: "전체 컬렉션 보기 →",
  },
  seasonalBanner: {
    sectionLabel: "2026 F/W 컬렉션 배너",
    imageAlt: "2026 F/W 시즌 컬렉션",
    desc: "깊어지는 계절, 차갑고 단단해지는 빛.\n2026 가을·겨울 컬렉션은 어둠 속에서 반짝이는 소재의 이면을 탐구합니다.",
    cta: "2026 F/W 컬렉션 살펴보기 →",
  },
  footer: {
    collections: "컬렉션",
    essentialRing: "Iris",
    bestPieces: "Best Pieces",
    allCollections: "All Collections",
    explore: "탐색",
    materials: "소재",
    process: "제작 공정",
    archive: "아카이브",
    support: "지원",
    faq: "FAQ",
    shippingReturns: "배송 & 반품",
    careGuide: "케어 가이드",
    contact: "문의",
    email: "이메일",
    instagram: "Instagram",
  },
  pages: {
    essential: {
      backNav: "이전 페이지로 돌아가기",
      sectionLabel: "ESSENTIAL COLLECTION",
      title: "IRIS",
      desc: "균형을 통해 형성되고 우아함으로 정의된 반지. PRISME의 시그니처 피스로, 현대적인 조형성과 정교한 소재가 만나는 가장 순수한 표현입니다.",
      materialSelect: "소재 선택",
      colorGroup: "색상 선택",
      material: "소재",
      dimensions: "규격",
      dimensionValue: "내경 16.5mm",
      originLabel: "ORIGIN",
      origin: "PRISME의 첫 실루엣이자, 지금까지 변하지 않은 기준.",
      viewAll: "전체 컬렉션 보기 →",
      colors: [
        {
          id: "silver" as const,
          label: "실버",
          sublabel: "Sterling Silver",
          material: "스털링 실버 / 다이아몬드",
        },
        {
          id: "gold" as const,
          label: "골드",
          sublabel: "18K Yellow Gold",
          material: "18K 옐로우 골드 / 다이아몬드",
        },
        {
          id: "rose-gold" as const,
          label: "로즈 골드",
          sublabel: "18K Rose Gold",
          material: "18K 로즈 골드 / 다이아몬드",
        },
      ],
      wishlistItemName: (colorLabel: string) => `Iris — ${colorLabel}`,
      viewerLabel: (colorLabel: string) =>
        `${colorLabel} Iris 3D 모델 — 드래그해서 회전, 자동으로도 천천히 회전합니다`,
    },
    bestPieces: {
      backNav: "메인으로 돌아가기",
      section: "SIGNATURE",
      title: "BEST PIECES",
      desc: "가장 많은 사랑을 받은 PRISME의 시그니처 피스를 만나보세요.",
    },
    collections: {
      backNav: "메인으로 돌아가기",
      section: "EXPLORE",
      title: "COLLECTIONS",
      desc: "현대적인 조형성과 정교한 소재가 만나는 곳,\nPRISME의 컬렉션을 만나보세요.",
    },
    fwCollections: {
      backNav: "메인으로 돌아가기",
      section: "2026 F/W",
      title: "COLLECTIONS",
      desc: "2026 가을·겨울 시즌의 새로운 컬렉션,\nPRISME에서 제안하는 계절의 정수를 만나보세요.",
    },
    archive: {
      backNav: "메인으로 돌아가기",
      section: "EXPLORE",
      title: "ARCHIVE",
      desc: "PRISME의 시즌별 컬렉션 기록입니다.",
      listLabel: "시즌 목록",
      viewCollection: "컬렉션 보기 →",
      closed: "종료된 컬렉션",
      now: "NOW",
      seasons: [
        {
          year: "2026",
          season: "F/W",
          name: "COLLECTIONS",
          desc: "현대적인 조형성과 정교한 소재가 만나는 PRISME의 2026 가을·겨울 컬렉션입니다. 계절의 깊이를 담아낸 시그니처 피스들을 선보입니다.",
          href: "/fw-collections",
          status: "current",
        },
        {
          year: "2026",
          season: "S/S",
          name: "FORME",
          desc: "빛과 형태의 관계를 탐구한 컬렉션. 기하학적 구조 위에 유기적인 선을 더해, 착용자의 움직임에 따라 변화하는 작품들을 선보였습니다.",
          href: null,
          status: "closed",
        },
        {
          year: "2025",
          season: "F/W",
          name: "LUMIÈRE",
          desc: "빛의 굴절과 산란에서 영감을 받아, 금속 표면의 마감 방식만으로 빛의 다양한 표정을 담아낸 시즌 컬렉션입니다.",
          href: null,
          status: "closed",
        },
        {
          year: "2025",
          season: "S/S",
          name: "ÉCLAT",
          desc: "여백의 미를 주제로, 최소한의 선과 면으로 구성된 데뷔 컬렉션. PRISME의 미학적 언어가 처음으로 제시된 시즌입니다.",
          href: null,
          status: "closed",
        },
      ],
    },
    careGuide: {
      backNav: "메인으로 돌아가기",
      section: "SUPPORT",
      title: "CARE GUIDE",
      desc: "PRISME 주얼리를 오래도록 아름답게 유지하기 위한 관리 방법을 안내합니다.",
      tips: [
        {
          category: "일상 관리",
          items: [
            "화장품, 향수, 헤어 제품을 바른 뒤 주얼리를 착용하세요. 화학 성분이 금속 표면을 손상시킬 수 있습니다.",
            "수영장, 온천, 사우나 등 강한 화학 물질이나 고온 환경에서는 반드시 제거하세요.",
            "운동 중 착용은 피하세요. 땀의 산성 성분과 충격이 금속과 세팅에 영향을 줍니다.",
            "취침 시에는 주얼리를 빼두세요. 침구와의 마찰이 표면을 긁을 수 있습니다.",
          ],
        },
        {
          category: "세척 방법",
          items: [
            "미온수에 중성 세제(주방 세제 가능)를 희석해 부드러운 솔로 살살 닦아주세요.",
            "세척 후에는 깨끗한 물로 헹구고, 보풀 없는 천으로 가볍게 두드려 말립니다.",
            "초음파 세척기는 다이아몬드 세팅 제품에 사용 가능하나, 컬러 원석이 세팅된 제품에는 사용하지 마세요.",
            "염소 계열 세정제나 아세톤이 포함된 제품은 절대 사용하지 마세요.",
          ],
        },
        {
          category: "보관 방법",
          items: [
            "각 제품을 개별 파우치나 케이스에 따로 보관하세요. 금속끼리 맞닿으면 서로 긁힐 수 있습니다.",
            "직사광선과 고온 다습한 환경을 피해 서늘하고 건조한 곳에 보관하세요.",
            "스털링 실버는 공기 중 산화가 빠르므로, 지퍼백에 넣어 밀봉 보관하면 산화 속도를 늦출 수 있습니다.",
            "PRISME 시그니처 박스는 보관용으로도 최적화되어 있습니다.",
          ],
        },
        {
          category: "로듐 도금 (화이트 골드)",
          items: [
            "18K 화이트 골드 제품은 로듐 도금 처리되어 있으며, 착용 빈도에 따라 도금이 마모될 수 있습니다.",
            "도금이 벗겨지면 노란빛이 돌 수 있으나, 이는 자연스러운 현상입니다.",
            "재도금은 당사 A/S 센터에서 유상으로 제공합니다. contact@prisme.co로 문의해 주세요.",
          ],
        },
      ],
    },
    contact: {
      backNav: "메인으로 돌아가기",
      section: "GET IN TOUCH",
      title: "CONTACT",
      desc: "PRISME에 관한 문의, 주문 관련 상담, 또는 맞춤 제작에 대해 언제든지 연락 주세요. 영업일 기준 2일 이내에 답변드립니다.",
      labelEmail: "EMAIL",
      labelLocation: "LOCATION",
      location: "서울특별시 강남구",
      labelHours: "HOURS",
      hours: "월–금 10:00 – 18:00\n토·일·공휴일 휴무",
      namePlaceholder: "성함",
      msgPlaceholder: "문의 내용을 입력해 주세요.",
      submit: "문의 보내기",
      sending: "전송 중...",
      thankYou: "THANK YOU",
      successMsg: "메시지가 전송되었습니다.\n빠른 시일 내에 답변드리겠습니다.",
      newInquiry: "새 문의 작성 →",
      errors: {
        nameRequired: "성함을 입력해 주세요.",
        emailRequired: "이메일 주소를 입력해 주세요.",
        emailInvalid:
          "올바른 이메일 형식으로 입력해 주세요. (예: name@domain.com)",
        messageRequired: "문의 내용을 입력해 주세요.",
      },
    },
    faq: {
      backNav: "메인으로 돌아가기",
      section: "SUPPORT",
      title: "FAQ",
      intro: "자주 묻는 질문을 모았습니다. 해결되지 않은 문의는",
      introLink: "Contact",
      introSuffix: "페이지를 이용해 주세요.",
      items: [
        {
          q: "배송 기간은 얼마나 걸리나요?",
          a: "결제 확인 후 영업일 기준 2–3일 이내에 출고됩니다. 도서산간 지역은 1–2일 추가될 수 있습니다. 맞춤 제작 주문은 상담 후 별도 안내 드립니다.",
        },
        {
          q: "반품 및 교환이 가능한가요?",
          a: "제품 수령 후 7일 이내에 반품 및 교환 신청이 가능합니다. 단, 고객 변심에 의한 반품 시 왕복 배송비는 고객 부담입니다. 제품 하자의 경우 전액 무료로 처리됩니다. 맞춤 제작 상품은 교환 및 반품이 제한될 수 있습니다.",
        },
        {
          q: "사이즈 측정은 어떻게 하나요?",
          a: "종이를 5mm 폭으로 길게 자른 뒤 손가락 첫째 마디를 감아 겹치는 지점을 표시하고, 그 길이(mm)를 확인하세요. 아침보다 저녁에 손가락이 약간 굵어지므로 저녁에 측정하는 것을 권장합니다. 정확한 측정이 어렵다면 contact@prisme.co로 문의해 주시면 안내드립니다.",
        },
        {
          q: "맞춤 제작이 가능한가요?",
          a: "네, 가능합니다. 각인, 소재 변경, 사이즈 특수 제작 등 다양한 옵션을 제공합니다. contact@prisme.co로 원하시는 사항을 말씀해 주시면 상담 일정을 안내드립니다. 맞춤 제작은 주문 확정 후 3–4주가 소요됩니다.",
        },
        {
          q: "A/S 및 수리는 어떻게 신청하나요?",
          a: "PRISME 제품은 구매일로부터 1년간 제조 결함에 대해 무상 수리를 제공합니다. 착용 중 파손, 크기 조정, 세팅 재작업 등은 유상으로 진행됩니다. contact@prisme.co로 제품 사진과 함께 문의해 주세요.",
        },
        {
          q: "선물 포장이 가능한가요?",
          a: "모든 제품은 PRISME 시그니처 박스에 담아 발송됩니다. 별도 요청 시 리본 포장과 손편지 서비스를 무료로 제공합니다. 주문 시 메모란에 '선물 포장' 및 메시지를 남겨 주세요.",
        },
      ],
    },
    materials: {
      backNav: "메인으로 돌아가기",
      section: "EXPLORE",
      title: "MATERIALS",
      desc: "PRISME은 소재 선택에서부터 완성까지, 모든 과정을 정직하게 다룹니다.\n사용하는 귀금속과 원석 하나하나가 작품의 품격을 결정한다고 믿기 때문입니다.",
      items: [
        {
          name: "18K 옐로우 골드",
          sub: "18K Yellow Gold",
          desc: "75% 순금에 구리·은을 합금해 제작됩니다. 따뜻한 황금빛이 오랜 시간이 지나도 변색 없이 유지되며, PRISME 시그니처 컬렉션 대부분에 사용됩니다.",
        },
        {
          name: "18K 화이트 골드",
          sub: "18K White Gold",
          desc: "순금에 팔라듐 또는 니켈을 합금하고 로듐 도금을 더해 차가운 실버 톤을 완성합니다. 다이아몬드와 함께했을 때 빛의 반사를 극대화합니다.",
        },
        {
          name: "18K 로즈 골드",
          sub: "18K Rose Gold",
          desc: "구리 함량을 높여 따뜻하고 은은한 핑크 빛을 냅니다. 피부 톤과 자연스럽게 어우러지는 색감으로 에센셜 라인에서 즐겨 사용됩니다.",
        },
        {
          name: "스털링 실버",
          sub: "Sterling Silver",
          desc: "은 함량 92.5%의 스털링 실버를 사용합니다. 섬세한 조형 표현에 적합하며, 시간이 지날수록 고유한 산화 패티나가 더해져 독특한 질감을 형성합니다.",
        },
        {
          name: "다이아몬드",
          sub: "Diamond",
          desc: "GIA 인증 기준에 따라 선별된 다이아몬드만을 사용합니다. 컷·컬러·클래리티·캐럿(4C)을 기준으로 엄격하게 심사하여, 최적의 광채를 발산하는 원석을 선택합니다.",
        },
        {
          name: "천연 원석",
          sub: "Precious Gemstones",
          desc: "에메랄드, 루비, 사파이어 등 천연 원석을 시즌 리미티드 컬렉션에 한정 적용합니다. 원석 특유의 내포물과 불균일성은 결함이 아닌 자연의 흔적입니다.",
        },
      ],
    },
    process: {
      backNav: "메인으로 돌아가기",
      section: "EXPLORE",
      title: "PROCESS",
      desc: "하나의 반지가 완성되기까지, PRISME의 아틀리에에서는 여섯 단계의 손길이 더해집니다. 어떤 단계도 기계로 대체하지 않습니다.",
      listLabel: "제작 공정",
      steps: [
        {
          step: "01",
          title: "디자인 스케치",
          sub: "DESIGN",
          desc: "모든 작품은 손으로 그린 스케치에서 시작됩니다. 조형적 균형, 착용감, 빛의 반사각을 고려한 설계도가 완성되기까지 수차례의 수정을 거칩니다.",
        },
        {
          step: "02",
          title: "왁스 조형",
          sub: "WAX MODELING",
          desc: "스케치를 바탕으로 왁스를 정밀 조각합니다. 0.1mm 단위의 세부 디테일까지 수공으로 다듬어, 실제 금속 주조 전 최종 형태를 확인합니다.",
        },
        {
          step: "03",
          title: "주조",
          sub: "CASTING",
          desc: "완성된 왁스 모형을 석고에 매립하고 고온으로 소성한 뒤, 용융 금속을 주입합니다. 주조 후에는 기포와 표면 결함을 전수 검사합니다.",
        },
        {
          step: "04",
          title: "세팅",
          sub: "SETTING",
          desc: "다이아몬드 또는 원석을 설정된 포지션에 정밀 세팅합니다. 프롱(Prong), 베젤(Bezel), 파베(Pavé) 등 작품 디자인에 최적화된 방식으로 고정합니다.",
        },
        {
          step: "05",
          title: "폴리싱",
          sub: "POLISHING",
          desc: "여러 단계의 연마 과정을 통해 표면을 완성합니다. 하이폴리시, 새틴, 헤어라인 등 각 작품에 지정된 마감 처리를 수작업으로 진행합니다.",
        },
        {
          step: "06",
          title: "품질 검수",
          sub: "QUALITY CHECK",
          desc: "출하 전 중량, 치수, 세팅 안정성, 표면 상태를 최종 점검합니다. 기준을 충족하지 못한 제품은 재작업하며, 합격 인증 후에만 포장됩니다.",
        },
      ],
    },
    product: {
      backNav: "이전 페이지로 돌아가기",
      material: "소재",
      dimensions: "규격",
      materialValue: "18K 옐로우 골드 / 다이아몬드",
      dimensionsValue: "내경 16.5mm",
      fromCollection: "같은 컬렉션의 다른 피스",
      materialsLink: "소재 안내",
      careLink: "케어 가이드",
    },
    search: {
      section: "SEARCH",
      resultCount: (n: number) => `${n}개의 상품을 찾았습니다.`,
      noResults: "검색 결과를 찾지 못했습니다.",
      suggestionPrefix: "혹시 ",
      suggestionSuffix: " 을/를 찾으셨나요?",
      sectionDirect: "검색 결과",
      sectionRelated: "연관 상품",
      sectionRelatedNoExact: "혹시 이걸 찾으셨나요?",
      emptyQuery: "검색어를 입력하면 관련 상품이 표시됩니다.",
      noMatch: (q: string) => `"${q}"에 대한 결과가 없습니다.`,
      tryOther: "다른 검색어를 시도해 보세요.",
      viewAll: "전체 컬렉션 보기 →",
    },
    shipping: {
      backNav: "메인으로 돌아가기",
      section: "SUPPORT",
      title: "SHIPPING & RETURNS",
      intro: "배송 및 반품 관련 정책을 안내합니다. 추가 문의는",
      introLink: "Contact",
      introSuffix: "페이지를 이용해 주세요.",
      sections: [
        {
          title: "배송 안내",
          items: [
            { label: "배송사", value: "CJ대한통운 (일반 택배)" },
            {
              label: "출고 기준",
              value: "결제 확인 후 영업일 기준 2–3일 이내 출고",
            },
            {
              label: "배송 기간",
              value: "출고 후 1–2일 소요 (도서산간 지역 추가 1–2일)",
            },
            {
              label: "배송비",
              value: "50,000원 이상 구매 시 무료 / 미만 시 3,000원",
            },
            { label: "배송 불가 지역", value: "해외 배송 현재 미지원" },
          ],
        },
        {
          title: "반품 정책",
          items: [
            { label: "반품 신청 기간", value: "제품 수령 후 7일 이내" },
            {
              label: "반품 배송비",
              value: "고객 변심: 왕복 배송비 고객 부담 / 제품 하자: 전액 무료",
            },
            {
              label: "반품 불가 사항",
              value:
                "착용 후 변형·손상된 제품 / 구성품 누락 또는 포장 훼손 / 맞춤 제작(각인 포함) 제품",
            },
          ],
        },
        {
          title: "교환 정책",
          items: [
            { label: "교환 신청 기간", value: "제품 수령 후 7일 이내" },
            {
              label: "교환 가능 사유",
              value: "사이즈 불일치 / 제품 하자 / 오배송",
            },
            {
              label: "교환 배송비",
              value:
                "고객 변심: 왕복 배송비 고객 부담 / 제품 하자·오배송: 전액 무료",
            },
            {
              label: "재고 부족 시",
              value: "교환 재고 없을 경우 반품 처리 후 전액 환불",
            },
          ],
        },
        {
          title: "환불 안내",
          items: [
            {
              label: "환불 처리 기간",
              value: "반품 확인 후 영업일 기준 3–5일 이내",
            },
            { label: "환불 수단", value: "결제 수단과 동일한 방법으로 환불" },
            {
              label: "카드 취소",
              value:
                "카드사 정책에 따라 청구 취소까지 3–5 영업일 소요될 수 있음",
            },
          ],
        },
      ],
    },
    wishlist: {
      title: "WISHLIST",
      desc: "마음에 드는 작품을 저장해두고 언제든지 다시 확인하세요.",
      emptyTitle: "위시리스트가 비어 있습니다.",
      emptySub: "마음에 드는 작품을 발견하면 추가해 보세요.",
      browseLink: "컬렉션 살펴보기 →",
      heartLabel: "하트 아이콘",
    },
    notFound: {
      tag: "PAGE NOT FOUND",
      title: "페이지를 찾을 수 없어요",
      desc: "주소가 잘못 입력되었거나, 페이지가 이동되었을 수 있어요.\n아래 링크에서 원하는 컬렉션을 찾아보세요.",
      home: "홈으로 돌아가기 →",
      collections: "컬렉션 살펴보기 →",
    },
    skipLink: "본문으로 바로가기",
  },
};

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------
const en: typeof ko = {
  nav: {
    homeLabel: "PRISME Home",
    search: "Search",
    account: "Account",
    signIn: "Sign in",
    menuOpen: "Open menu",
    primaryNav: "Primary navigation",
  },
  drawer: {
    label: "Navigation menu",
    close: "Close menu",
    primaryNav: "Main menu",
    secondaryNav: "Explore",
    links: {
      essential: "Iris",
      collections: "Collections",
      bestPieces: "Best Pieces",
      fwCollections: "FW Collections",
      materials: "Materials",
      process: "Process",
      archive: "Archive",
      contact: "CONTACT",
    },
    theme: {
      label: "Theme",
      dark: "Dark",
      light: "Light",
    },
  },
  auth: {
    wishlist: "Wishlist",
    logout: "Sign out",
    modalLogin: "Sign in",
    modalSignup: "Sign up",
    modalClose: "Close",
    login: "LOGIN",
    signup: "SIGN UP",
    loggingIn: "LOGGING IN...",
    signingUp: "SIGNING UP...",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signUpLink: "Sign up",
    loginLink: "Sign in",
    confirmCloseBody: "Your input will be lost.\nClose anyway?",
    continueEditing: "Keep editing",
    close: "Close",
    showPassword: "Show password",
    hidePassword: "Hide password",
    showConfirmPassword: "Show confirm password",
    hideConfirmPassword: "Hide confirm password",
    errors: {
      nameRequired: "Please enter your name.",
      emailRequired: "Please enter your email address.",
      emailInvalid:
        "Please enter a valid email address. (e.g., name@domain.com)",
      passwordRequired: "Please enter your password.",
      passwordTooShort:
        "Password must be at least 8 characters.",
      confirmPasswordRequired: "Please confirm your password.",
      confirmPasswordMismatch: "Passwords do not match. Please try again.",
      loginFailed: "Please check your email or password.",
      emailInvalidSignup: "Please enter a valid email address.",
      passwordTooShortSignup: "Password must be at least 8 characters.",
      nameRequiredSignup: "Please enter your name.",
    },
    namePlaceholder: "Full name",
  },
  search: {
    label: "Search products",
    placeholder: "Search pieces or collections",
    submit: "Search",
    escHint: "Press ESC to close",
  },
  wishlistBtn: {
    add: "Add to wishlist",
    remove: "Remove from wishlist",
  },
  productCard: {
    imageAlt: (name: string) => `${name} product image`,
    collectionImageAlt: (name: string) => `${name} collection image`,
    addToWishlist: "Add to wishlist",
    removeFromWishlist: "Remove from wishlist",
  },
  loading: {
    label: "Loading",
  },
  relatedScroll: {
    prev: "Previous",
    next: "Next",
  },
  hero: {
    sectionLabel: "PRISME hero section",
    canvasLabel: "3D ring animation responding to scroll",
    tagline1: "The essence of contemporary jewelry, in its purest form and perfect balance.",
    collectionLabel: "COLLECTION",
    essentialLine1: "ESSENTIAL",
    essentialLine2: "COLLECTION",
    essentialDesc:
      "Where restraint meets precision.\nThe essence of material, held within the simplest form.",
    cta: "Explore the collection →",
    scroll: "SCROLL",
  },
  bestPiecesSection: {
    sub: "Our most beloved pieces, signature works from PRISME.",
    listLabel: "Best pieces list",
    viewAll: "View all pieces →",
  },
  collectionsSection: {
    sub: "Where contemporary form meets refined material, discover the PRISME collection.",
    listLabel: "Collections list",
    viewAll: "View all collections →",
  },
  seasonalBanner: {
    sectionLabel: "2026 F/W Collection banner",
    imageAlt: "2026 F/W Season Collection",
    desc: "As the season deepens, light grows cold and sharp.\nThe 2026 F/W Collection explores the hidden face of materials that shimmer in the dark.",
    cta: "Explore 2026 F/W Collection →",
  },
  footer: {
    collections: "COLLECTIONS",
    essentialRing: "Iris",
    bestPieces: "Best Pieces",
    allCollections: "All Collections",
    explore: "EXPLORE",
    materials: "Materials",
    process: "Process",
    archive: "Archive",
    support: "SUPPORT",
    faq: "FAQ",
    shippingReturns: "Shipping & Returns",
    careGuide: "Care Guide",
    contact: "CONTACT",
    email: "E-mail",
    instagram: "Instagram",
  },
  pages: {
    essential: {
      backNav: "Back",
      sectionLabel: "ESSENTIAL COLLECTION",
      title: "IRIS",
      desc: "Shaped through balance, defined by elegance. PRISME's signature piece — the purest expression of where contemporary form meets refined material.",
      materialSelect: "Material",
      colorGroup: "Select color",
      material: "Material",
      dimensions: "Dimensions",
      dimensionValue: "Inner diameter 16.5mm",
      originLabel: "ORIGIN",
      origin: "PRISME's first silhouette. The standard, ever since.",
      viewAll: "View all collections →",
      colors: [
        {
          id: "silver" as const,
          label: "Silver",
          sublabel: "Sterling Silver",
          material: "Sterling Silver / Diamond",
        },
        {
          id: "gold" as const,
          label: "Gold",
          sublabel: "18K Yellow Gold",
          material: "18K Yellow Gold / Diamond",
        },
        {
          id: "rose-gold" as const,
          label: "Rose Gold",
          sublabel: "18K Rose Gold",
          material: "18K Rose Gold / Diamond",
        },
      ],
      wishlistItemName: (colorLabel: string) => `Iris — ${colorLabel}`,
      viewerLabel: (colorLabel: string) =>
        `${colorLabel} Iris 3D model — drag to rotate, rotates slowly on its own too`,
    },
    bestPieces: {
      backNav: "Back to home",
      section: "SIGNATURE",
      title: "BEST PIECES",
      desc: "Discover PRISME's most beloved signature pieces.",
    },
    collections: {
      backNav: "Back to home",
      section: "EXPLORE",
      title: "COLLECTIONS",
      desc: "Where contemporary form meets refined material —\ndiscover the PRISME collection.",
    },
    fwCollections: {
      backNav: "Back to home",
      section: "2026 F/W",
      title: "COLLECTIONS",
      desc: "The new season collection for Autumn/Winter 2026 —\nthe essence of the season, as envisioned by PRISME.",
    },
    archive: {
      backNav: "Back to home",
      section: "EXPLORE",
      title: "ARCHIVE",
      desc: "A record of PRISME's collections across seasons.",
      listLabel: "Season list",
      viewCollection: "View collection →",
      closed: "Closed season",
      now: "NOW",
      seasons: [
        {
          year: "2026",
          season: "F/W",
          name: "COLLECTIONS",
          desc: "PRISME's 2026 Autumn/Winter Collection — where contemporary form meets refined material. Signature pieces that capture the depth of the season.",
          href: "/fw-collections",
          status: "current",
        },
        {
          year: "2026",
          season: "S/S",
          name: "FORME",
          desc: "A collection exploring the relationship between light and form. Geometric structures layered with organic lines — pieces that transform with the wearer's movement.",
          href: null,
          status: "closed",
        },
        {
          year: "2025",
          season: "F/W",
          name: "LUMIÈRE",
          desc: "Inspired by the refraction and scattering of light, this collection captures the many expressions of light through metal surface finish alone.",
          href: null,
          status: "closed",
        },
        {
          year: "2025",
          season: "S/S",
          name: "ÉCLAT",
          desc: "On the beauty of negative space — a debut collection composed of minimal lines and planes. The first season in which PRISME's aesthetic language was proposed.",
          href: null,
          status: "closed",
        },
      ],
    },
    careGuide: {
      backNav: "Back to home",
      section: "SUPPORT",
      title: "CARE GUIDE",
      desc: "Guidance on how to keep your PRISME jewelry beautiful for years to come.",
      tips: [
        {
          category: "Daily Care",
          items: [
            "Apply cosmetics, perfume, and hair products before putting on your jewelry. Chemical ingredients can damage metal surfaces.",
            "Always remove jewelry in swimming pools, hot springs, saunas, or other environments with harsh chemicals or high heat.",
            "Avoid wearing jewelry during exercise. Sweat's acidity and physical impact can affect metal and settings.",
            "Remove jewelry before sleeping. Contact with bedding can scratch the surface.",
          ],
        },
        {
          category: "Cleaning",
          items: [
            "Dilute mild dish soap in lukewarm water and gently clean with a soft brush.",
            "After cleaning, rinse with clean water and pat dry with a lint-free cloth.",
            "Ultrasonic cleaners can be used on diamond-set pieces, but avoid them for colored gemstone settings.",
            "Never use chlorine-based cleaners or products containing acetone.",
          ],
        },
        {
          category: "Storage",
          items: [
            "Store each piece separately in its own pouch or case. Metal-on-metal contact can cause scratching.",
            "Avoid direct sunlight and humid environments. Store in a cool, dry place.",
            "Sterling silver oxidizes quickly in air — storing in a sealed zip bag will slow the oxidation process.",
            "PRISME signature boxes are also optimized for long-term storage.",
          ],
        },
        {
          category: "Rhodium Plating (White Gold)",
          items: [
            "18K white gold pieces are rhodium plated. The plating may wear over time depending on frequency of use.",
            "When the plating wears, a slight yellow tint may appear — this is a natural occurrence.",
            "Replating is available at our service center for a fee. Please contact contact@prisme.co.",
          ],
        },
      ],
    },
    contact: {
      backNav: "Back to home",
      section: "GET IN TOUCH",
      title: "CONTACT",
      desc: "For inquiries about PRISME, order consultations, or custom commissions, please get in touch. We will respond within two business days.",
      labelEmail: "EMAIL",
      labelLocation: "LOCATION",
      location: "Gangnam-gu, Seoul",
      labelHours: "HOURS",
      hours: "Mon–Fri 10:00–18:00\nClosed on weekends and public holidays",
      namePlaceholder: "Full name",
      msgPlaceholder: "How may we assist you?",
      submit: "SEND MESSAGE",
      sending: "SENDING...",
      thankYou: "THANK YOU",
      successMsg:
        "Your message has been sent.\nWe will get back to you shortly.",
      newInquiry: "Write a new inquiry →",
      errors: {
        nameRequired: "Please enter your name.",
        emailRequired: "Please enter your email address.",
        emailInvalid:
          "Please enter a valid email address. (e.g., name@domain.com)",
        messageRequired: "Please enter your message.",
      },
    },
    faq: {
      backNav: "Back to home",
      section: "SUPPORT",
      title: "FAQ",
      intro:
        "A collection of frequently asked questions. For anything else, please use our",
      introLink: "Contact",
      introSuffix: "page.",
      items: [
        {
          q: "How long does shipping take?",
          a: "Orders are dispatched within 2–3 business days after payment confirmation. An additional 1–2 days may apply for remote areas. Custom orders will be advised separately after consultation.",
        },
        {
          q: "Can I return or exchange my order?",
          a: "Returns and exchanges can be requested within 7 days of receiving the product. Return shipping costs for change-of-mind returns are the customer's responsibility. Defective products are handled free of charge. Custom-made items may have limited return and exchange eligibility.",
        },
        {
          q: "How do I find my ring size?",
          a: "Cut a strip of paper 5mm wide, wrap it around the base of your finger (below the knuckle), mark where it overlaps, and measure the length in millimeters. Fingers tend to be slightly larger in the evening, so we recommend measuring then. If you need assistance, contact us at contact@prisme.co.",
        },
        {
          q: "Can I order a custom piece?",
          a: "Yes. We offer engraving, material changes, special sizing, and more. Please reach out to contact@prisme.co with your requirements, and we will arrange a consultation. Custom orders typically take 3–4 weeks after confirmation.",
        },
        {
          q: "How do I request after-sales service or repairs?",
          a: "PRISME products are covered by a one-year warranty against manufacturing defects from the date of purchase. Damage from wear, resizing, and re-setting are available for a fee. Please contact us at contact@prisme.co with photos of the item.",
        },
        {
          q: "Is gift wrapping available?",
          a: "All products are shipped in the PRISME signature box. Upon request, ribbon wrapping and a handwritten note are provided free of charge. Please include 'Gift wrap' and your message in the order notes.",
        },
      ],
    },
    materials: {
      backNav: "Back to home",
      section: "EXPLORE",
      title: "MATERIALS",
      desc: "From material selection to the finished piece, PRISME handles every step with honesty.\nWe believe that each precious metal and gemstone determines the quality of the work.",
      items: [
        {
          name: "18K Yellow Gold",
          sub: "18K Yellow Gold",
          desc: "Crafted from 75% pure gold alloyed with copper and silver. The warm golden hue remains unchanged over time, and is used in the majority of PRISME's signature collections.",
        },
        {
          name: "18K White Gold",
          sub: "18K White Gold",
          desc: "Pure gold alloyed with palladium or nickel, finished with rhodium plating to achieve a cool silver tone. Maximizes the reflection of light when paired with diamonds.",
        },
        {
          name: "18K Rose Gold",
          sub: "18K Rose Gold",
          desc: "A higher copper content lends a warm, subtle pink hue. Its color blends naturally with the skin tone, and is a favored choice in the Essential line.",
        },
        {
          name: "Sterling Silver",
          sub: "Sterling Silver",
          desc: "We use sterling silver with 92.5% silver content. Ideal for delicate forms, it develops a unique oxidized patina over time, adding depth and texture.",
        },
        {
          name: "Diamond",
          sub: "Diamond",
          desc: "Only GIA-certified diamonds are used, rigorously assessed by Cut, Color, Clarity, and Carat (4C), to ensure each stone emits its optimal brilliance.",
        },
        {
          name: "Precious Gemstones",
          sub: "Precious Gemstones",
          desc: "Emeralds, rubies, sapphires, and other natural gemstones are applied exclusively to seasonal limited collections. The inclusions and irregularities of natural stones are not flaws — they are traces of nature.",
        },
      ],
    },
    process: {
      backNav: "Back to home",
      section: "EXPLORE",
      title: "PROCESS",
      desc: "Before a single ring is complete, six stages of craftsmanship take place in the PRISME atelier. No step is replaced by machine.",
      listLabel: "Crafting process",
      steps: [
        {
          step: "01",
          title: "DESIGN",
          sub: "디자인 스케치",
          desc: "Every piece begins with a hand-drawn sketch. The design goes through multiple revisions to account for structural balance, wearability, and the angle of light reflection.",
        },
        {
          step: "02",
          title: "WAX MODELING",
          sub: "왁스 조형",
          desc: "The sketch is translated into a precisely carved wax model. Details as fine as 0.1mm are refined by hand, confirming the final form before metal casting.",
        },
        {
          step: "03",
          title: "CASTING",
          sub: "주조",
          desc: "The completed wax model is embedded in plaster and fired at high temperature, then molten metal is poured in. Each cast piece is inspected for air bubbles and surface defects.",
        },
        {
          step: "04",
          title: "SETTING",
          sub: "세팅",
          desc: "Diamonds or gemstones are set precisely in their designated positions using the method best suited to each design — prong, bezel, pavé, and others.",
        },
        {
          step: "05",
          title: "POLISHING",
          sub: "폴리싱",
          desc: "The surface is refined through multiple stages of polishing. High polish, satin, and hairline finishes are each applied by hand according to the piece's specification.",
        },
        {
          step: "06",
          title: "QUALITY CHECK",
          sub: "품질 검수",
          desc: "Weight, dimensions, setting stability, and surface condition are all verified before shipment. Any piece that does not meet standards is returned for rework and certified before packaging.",
        },
      ],
    },
    product: {
      backNav: "Back",
      material: "Material",
      dimensions: "Dimensions",
      materialValue: "18K Yellow Gold / Diamond",
      dimensionsValue: "Inner diameter 16.5mm",
      fromCollection: "More from this collection",
      materialsLink: "Materials",
      careLink: "Care Guide",
    },
    search: {
      section: "SEARCH",
      resultCount: (n: number) => `${n} result${n === 1 ? "" : "s"} found.`,
      noResults: "No results found.",
      suggestionPrefix: 'Did you mean "',
      suggestionSuffix: '"?',
      sectionDirect: "Results",
      sectionRelated: "Related items",
      sectionRelatedNoExact: "Did you mean this?",
      emptyQuery: "Enter a search term to see related products.",
      noMatch: (q: string) => `No results for "${q}".`,
      tryOther: "Try a different search term.",
      viewAll: "Browse all collections →",
    },
    shipping: {
      backNav: "Back to home",
      section: "SUPPORT",
      title: "SHIPPING & RETURNS",
      intro:
        "Information on our shipping and returns policy. For further inquiries, please visit our",
      introLink: "Contact",
      introSuffix: "page.",
      sections: [
        {
          title: "Shipping",
          items: [
            { label: "Carrier", value: "CJ Logistics (Standard parcel)" },
            {
              label: "Dispatch",
              value: "Within 2–3 business days of payment confirmation",
            },
            {
              label: "Delivery",
              value:
                "1–2 days after dispatch (additional 1–2 days for remote areas)",
            },
            {
              label: "Shipping fee",
              value: "Free on orders ₩50,000 and above / ₩3,000 below",
            },
            {
              label: "International",
              value: "International shipping is not currently available",
            },
          ],
        },
        {
          title: "Returns",
          items: [
            {
              label: "Return window",
              value: "Within 7 days of receiving the product",
            },
            {
              label: "Return shipping",
              value:
                "Change of mind: round-trip shipping at customer's expense / Defective item: fully covered",
            },
            {
              label: "Non-returnable",
              value:
                "Items altered or damaged after use / Missing components or damaged packaging / Custom-made items (including engraving)",
            },
          ],
        },
        {
          title: "Exchanges",
          items: [
            {
              label: "Exchange window",
              value: "Within 7 days of receiving the product",
            },
            {
              label: "Eligible reasons",
              value: "Size mismatch / Defective item / Wrong item received",
            },
            {
              label: "Exchange shipping",
              value:
                "Change of mind: round-trip shipping at customer's expense / Defective or wrong item: fully covered",
            },
            {
              label: "Out of stock",
              value:
                "If exchange stock is unavailable, a full refund will be issued",
            },
          ],
        },
        {
          title: "Refunds",
          items: [
            {
              label: "Processing time",
              value: "Within 3–5 business days of return confirmation",
            },
            {
              label: "Refund method",
              value: "Refunded via the original payment method",
            },
            {
              label: "Card cancellation",
              value:
                "Card cancellation may take 3–5 business days depending on your card issuer",
            },
          ],
        },
      ],
    },
    wishlist: {
      title: "WISHLIST",
      desc: "Save pieces you love and revisit them anytime.",
      emptyTitle: "Your wishlist is empty.",
      emptySub: "When you find a piece you love, add it here.",
      browseLink: "Browse collections →",
      heartLabel: "Heart icon",
    },
    notFound: {
      tag: "PAGE NOT FOUND",
      title: "Page not found",
      desc: "The address may be incorrect, or the page may have moved.\nFind the collection you're looking for below.",
      home: "Return to home →",
      collections: "Browse collections →",
    },
    skipLink: "Skip to main content",
  },
};

export const translations = { ko, en } as const;
export type T = typeof ko;
