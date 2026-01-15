import { Link } from "react-router-dom";

export function ClientHome() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-xl w-full shadow-sm">
        <h1 className="text-gray-900 mb-2">PickCar (Client)</h1>
        <p className="text-gray-600 mb-6">
          여긴 클라이언트 페이지 루트(/)야. 아직 화면 없으니까 기본 더미 페이지로
          붙여놨고, 실제 클라이언트 페이지는 여기서부터 라우트 추가하면 됨.
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/manager"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            관리자 페이지로 이동
          </Link>
          <span className="text-gray-400">/manager</span>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <div className="mb-1">예시:</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>/ (클라이언트 홈)</li>
            <li>/manager (관리자)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
