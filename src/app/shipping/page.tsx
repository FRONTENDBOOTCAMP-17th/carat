import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "배송 안내",
    items: [
      { label: "배송사", value: "CJ대한통운 (일반 택배)" },
      { label: "출고 기준", value: "결제 확인 후 영업일 기준 2–3일 이내 출고" },
      { label: "배송 기간", value: "출고 후 1–2일 소요 (도서산간 지역 추가 1–2일)" },
      { label: "배송비", value: "50,000원 이상 구매 시 무료 / 미만 시 3,000원" },
      { label: "배송 불가 지역", value: "해외 배송 현재 미지원" },
    ],
  },
  {
    title: "반품 정책",
    items: [
      { label: "반품 신청 기간", value: "제품 수령 후 7일 이내" },
      { label: "반품 배송비", value: "고객 변심: 왕복 배송비 고객 부담 / 제품 하자: 전액 무료" },
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
      { label: "교환 가능 사유", value: "사이즈 불일치 / 제품 하자 / 오배송" },
      { label: "교환 배송비", value: "고객 변심: 왕복 배송비 고객 부담 / 제품 하자·오배송: 전액 무료" },
      { label: "재고 부족 시", value: "교환 재고 없을 경우 반품 처리 후 전액 환불" },
    ],
  },
  {
    title: "환불 안내",
    items: [
      { label: "환불 처리 기간", value: "반품 확인 후 영업일 기준 3–5일 이내" },
      { label: "환불 수단", value: "결제 수단과 동일한 방법으로 환불" },
      { label: "카드 취소", value: "카드사 정책에 따라 청구 취소까지 3–5 영업일 소요될 수 있음" },
    ],
  },
];

export default function ShippingPage() {
  return (
    <main id="main-content" className="min-h-screen bg-surface-darkest flex flex-col">
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="shipping-heading">
        <div className="max-w-container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
          <nav aria-label="메인으로 돌아가기">
            <Link
              href="/"
              className="text-2xs tracking-link text-content-subtle hover:text-content-primary transition-colors"
            >
              ← PRISME
            </Link>
          </nav>

          <header className="mt-10 mb-16">
            <p className="mb-3 text-2xs tracking-descriptor text-content-faint">
              SUPPORT
            </p>
            <h1
              id="shipping-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              SHIPPING &amp; RETURNS
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-muted">
              배송 및 반품 관련 정책을 안내합니다. 추가 문의는{" "}
              <Link href="/contact" className="underline underline-offset-2 hover:text-content-primary transition-colors">
                Contact
              </Link>
              {" "}페이지를 이용해 주세요.
            </p>
          </header>

          <div className="max-w-2xl space-y-14">
            {SECTIONS.map((sec) => (
              <section key={sec.title} aria-labelledby={`section-${sec.title}`}>
                <h2
                  id={`section-${sec.title}`}
                  className="mb-6 text-xs tracking-label text-content-primary border-b border-surface-elevated pb-4"
                >
                  {sec.title}
                </h2>
                <dl className="space-y-5">
                  {sec.items.map((item) => (
                    <div key={item.label} className="grid grid-cols-[120px_1fr] gap-6 sm:grid-cols-[160px_1fr]">
                      <dt className="text-2xs tracking-link text-content-subtle shrink-0">{item.label}</dt>
                      <dd className="text-xs leading-relaxed text-content-muted">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
