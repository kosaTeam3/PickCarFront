import {useEffect, useMemo, useState} from "react";
import {Calendar, Car, DollarSign, FileText, IdCard, User, Wrench, X} from "lucide-react";
import {getMaintenanceDetail} from "@/api/maintenance";

const STATUS_LABEL = {
    SCHEDULE: "예정",
    ONGOING: "진행중",
    COMPLETED: "완료",
};

const STATUS_STYLE = {
    완료: "bg-green-100 text-green-700",
    진행중: "bg-blue-100 text-blue-700",
    예정: "bg-yellow-100 text-yellow-700",
};

const formatCost = (cost) => {
    if (!cost || cost <= 0) return "미정";
    return `₩${Number(cost).toLocaleString()}`;
};

function InfoRow({icon: Icon, label, children}) {
    return (
        <div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Icon className="w-4 h-4"/>
                <span>{label}</span>
            </div>
            <div className="text-gray-900">{children}</div>
        </div>
    );
}

export function MaintenanceDetailModal({maintenanceId, vehicle, onClose}) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!maintenanceId) return;

        let ignore = false;

        const fetchDetail = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await getMaintenanceDetail(maintenanceId);

                // 네 api()가 뭘 리턴하는지 케이스가 여러 개라 안전하게 처리
                const data = res?.data ?? res;

                if (!ignore) {
                    setDetail(data);
                }
            } catch (e) {
                if (!ignore) {
                    setError(e?.message ?? "정비 상세 조회 실패");
                    setDetail(null);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchDetail();

        return () => {
            ignore = true;
        };
    }, [maintenanceId]);

    const statusText = useMemo(() => {
        const raw = detail?.status;
        return STATUS_LABEL[raw] ?? raw ?? "-";
    }, [detail]);

    const statusClass = STATUS_STYLE[statusText] ?? "bg-gray-100 text-gray-700";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* 헤더 */}
                <div
                    className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Wrench className="w-6 h-6 text-blue-600"/>
                        </div>
                        <div>
                            <h2 className="text-gray-900">정비 상세 정보</h2>
                            <p className="text-gray-500">
                                {loading ? "불러오는 중..." : detail?.title ?? "-"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="닫기"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6"/>
                    </button>
                </div>

                {/* 컨텐츠 */}
                <div className="p-6">
                    {/* 로딩/에러 */}
                    {loading && (
                        <div className="mb-6 text-gray-500">
                            상세 조회중... (서버 일하는 척이라도 하겠지)
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                            {error}
                        </div>
                    )}

                    {!loading && !error && detail && (
                        <>
                            {/* 정비 상태 */}
                            <div className="mb-6 flex items-center gap-3">
                                <span className="text-gray-600">상태:</span>
                                <span className={`inline-block px-4 py-2 rounded-full ${statusClass}`}>
                  {statusText}
                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 왼쪽 컬럼 - 정비 정보 */}
                                <div className="space-y-4">
                                    <h3 className="text-gray-900 mb-2">정비 정보</h3>

                                    <InfoRow icon={FileText} label="정비 제목">
                                        {detail?.title ?? "-"}
                                    </InfoRow>

                                    <InfoRow icon={Calendar} label="정비 일자">
                                        {detail?.maintenanceDate ?? "-"}
                                    </InfoRow>

                                    <InfoRow icon={DollarSign} label="정비 비용">
                                        {formatCost(detail?.cost)}
                                    </InfoRow>
                                </div>

                                {/* 오른쪽 컬럼 - 차량 및 담당자 */}
                                <div className="space-y-4">
                                    <h3 className="text-gray-900 mb-2">차량 및 담당자</h3>

                                    <InfoRow icon={Car} label="차량 식별번호">
                                        {detail?.vehicleIdNumber ?? "-"}
                                    </InfoRow>

                                    <InfoRow icon={Car} label="차량 정보">
                                        {vehicle ? (
                                            <div>
                                                <div className="text-gray-900">{vehicle.model}</div>
                                                <div className="text-gray-500 text-sm">{vehicle.licensePlate}</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </InfoRow>

                                    <InfoRow icon={User} label="정비 직원 이름">
                                        {detail?.employeeName ?? "미지정"}
                                    </InfoRow>

                                    <InfoRow icon={IdCard} label="정비 직원 ID">
                                        {detail?.employeeId ?? "미지정"}
                                    </InfoRow>
                                </div>
                            </div>

                            {/* 상세 내용 */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-gray-900 mb-3">정비 내용</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {detail?.detail ?? "-"}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* 푸터 */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
