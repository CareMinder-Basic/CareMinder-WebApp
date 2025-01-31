import { EventSourcePolyfill, MessageEvent } from "event-source-polyfill";
import { SEVER_URL } from "@constants/baseUrl"; // Fixed typo in SERVER_URL

export const openSSE = async ({ checkType }: { checkType: string }): Promise<() => void> => {
  try {
    // ✅ 토큰 가져오기
    const tokens = await window.tokenAPI.getTokens();
    const token = tokens.accessToken;

    if (!token) {
      console.error("🚨 토큰이 없습니다. SSE 연결 중단.");
      return () => {}; // 빈 cleanup 함수 반환
    }

    console.log("🟢 SSE 연결 시도 중...");

    // ✅ SSE 연결
    const eventSource = new EventSourcePolyfill(`${SEVER_URL}/sse/open`, {
      headers: {
        Authorization: `Bearer ${token}`, // 🔹 헤더에 토큰 추가
        Accept: "text/event-stream", // 🔹 Swagger 요청의 Accept 헤더 추가
      },
      withCredentials: true, // 🔹 인증 필요 시 추가
    });

    eventSource.onopen = () => {
      console.log("✅ SSE 연결이 성공적으로 열렸습니다!");
    };

    // ✅ `message` 이벤트 리스너 추가 (일반 이벤트 수신)
    eventSource.addEventListener(`${checkType}`, (event: MessageEvent) => {
      const jsonData = JSON.parse(event.data);
      console.log("📩 SSE 'notification' 이벤트 발생:", jsonData);
      console.log(jsonData);
      window.api.send("sse-message", jsonData);
    });

    // ✅ `onmessage` 로깅 추가
    eventSource.onmessage = (event: MessageEvent) => {
      console.log("📩 SSE 메시지 수신:", event.data);
      // ✅ JSON 데이터 파싱
      try {
        const jsonData = JSON.parse(event.data);
        console.log("📦 Parsed Data:", jsonData);
      } catch (error) {
        console.warn("⚠️ JSON 파싱 실패:", event.data);
      }
    };

    // ✅ `error` 핸들링
    eventSource.onerror = error => {
      console.error("🚨 SSE 연결 오류:", error);
      eventSource.close();
    };

    // ✅ 컴포넌트 언마운트 시 연결 닫기
    return () => {
      console.log("🛑 SSE 연결 종료");
      eventSource.close();
    };
  } catch (error) {
    console.error("🔥 SSE 연결 중 에러 발생:", error);
    return () => {}; // 에러 발생 시에도 cleanup 함수 반환
  }
};
