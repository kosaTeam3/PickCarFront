import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-xl w-full shadow-sm">
        <h1 className="text-gray-900 mb-2">404</h1>
        <p className="text-gray-600 mb-6">
          없는 페이지야. 주소가 잘못됐거나 라우트가 안 잡힌 거지.
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            홈으로
          </Link>
          <Link
            to="/manager"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            관리자
          </Link>
        </div>
      </div>
    </div>
  );
}
