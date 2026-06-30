import { describe, it, expect } from "vitest";
import { searchProducts } from "@/lib/search";

// 검색은 동의어 확장과 오타 교정이 핵심이라, 데이터가 바뀌어도 흔들리지 않게
// "이런 입력이면 이렇게 동작해야 한다"는 규칙 단위로 못 박습니다.
describe("searchProducts", () => {
  it("빈 검색어는 빈 결과를 돌려준다", () => {
    expect(searchProducts("   ")).toEqual({ direct: [], related: [], suggestion: null });
  });

  it("상품명에 들어간 단어는 직접 결과로 잡힌다", () => {
    const { direct } = searchProducts("다이아몬드");
    expect(direct.length).toBeGreaterThan(0);
    expect(direct.some((p) => p.name.includes("다이아몬드"))).toBe(true);
  });

  it("동의어로 검색해도 같은 상품을 찾는다('다이아' → 다이아몬드)", () => {
    const { direct } = searchProducts("다이아");
    expect(direct.some((p) => p.name.includes("다이아몬드"))).toBe(true);
  });

  it("오타는 가까운 단어로 교정 제안을 준다('diamand' → 'diamond')", () => {
    const { direct, suggestion } = searchProducts("diamand");
    expect(direct).toHaveLength(0);
    expect(suggestion).toBe("diamond");
  });
});
