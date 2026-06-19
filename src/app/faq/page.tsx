import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQS = [
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
];

export default function FaqPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-surface-darkest flex flex-col"
    >
      <Navbar />

      <section className="flex-1 w-full" aria-labelledby="faq-heading">
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
              id="faq-heading"
              className="mb-6 text-4xl sm:text-5xl text-content-primary font-light"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              FAQ
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-content-muted">
              자주 묻는 질문을 모았습니다. 해결되지 않은 문의는{" "}
              <Link
                href="/contact"
                className="underline underline-offset-2 hover:text-content-primary transition-colors"
              >
                Contact
              </Link>{" "}
              페이지를 이용해 주세요.
            </p>
          </header>

          <div className="max-w-2xl divide-y divide-surface-elevated">
            {FAQS.map((faq, i) => (
              <details key={i} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                  <span className="text-sm text-content-primary">{faq.q}</span>
                  <span
                    className="shrink-0 flex items-center justify-center size-11 text-lg leading-none text-content-faint transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-xs leading-relaxed text-content-muted">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
