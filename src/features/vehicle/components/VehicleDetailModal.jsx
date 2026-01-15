import { useEffect, useMemo, useState } from "react";
import {
    Calendar,
    Clock,
    DollarSign,
    FileText,
    Fuel,
    MapPin,
    Trash2,
    User,
    X,
} from "lucide-react";

import { AddMaintenanceModal } from "@/features/maintenance";
import { mockMaintenanceRecords } from "@/mocks/maintenance";
import { mockRentalHistory } from "@/mocks/rentals";

// ✅ 너가 만든 API/매핑 함수 가져와야 함 (경로는 네 프로젝트에 맞게 수정)
import { getVehicleDetail, toVehicleDetailUiModel } from "@/api/vehicle";

export function VehicleDetailModal({ vehicle, onClose, onUpdate, onDelete }) {
    // vehicle이 없으면 렌더하지 않음 (상태 꼬이면 터지니까 방어)
    if (!vehicle) return null;

    const [activeTab, setActiveTab] = useState("info");
    const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);

    // ✅ 실제 화면에 뿌릴 "상세+목록 합친 데이터"
    const [detailVehicle, setDetailVehicle] = useState(vehicle);

    // ✅ 상세조회 로딩/에러 (필요없으면 UI 표시 안 해도 됨)
    const [loading, setLoading] = useState(false);

    // 간단 수정용 draft (상태/위치/주행거리만)
    const [draft, setDraft] = useState({
        status: vehicle.status ?? "",
        location: vehicle.location ?? "",
        mileage: Number(vehicle.mileage ?? 0),
    });

    // -----------------------------
    // ✅ 숫자/통화 안전 포맷 (undefined.toLocaleString 방지)
    // -----------------------------
    const formatNumber = (v) => Number(v ?? 0).toLocaleString();
    const formatCurrency = (v) => `₩${Number(v ?? 0).toLocaleString()}`;

    // -----------------------------
    // ✅ 모달 열릴 때 상세 조회 GET 추가
    // -----------------------------
    useEffect(() => {
        let alive = true;

        // 모달 열자마자 일단 목록 데이터로 표시 시작
        setDetailVehicle(vehicle);

        // 화면에서만 추가된 차량(서버 carId 없음)이면 상세 GET 스킵
        if (!vehicle?.carId) {
            setLoading(false);
            return () => {
                alive = false;
            };
        }

        (async () => {
            try {
                setLoading(true);

                const dto = await getVehicleDetail(vehicle.carId);
                // axios 기반이면 dto.data일 수 있음 (네 api 래퍼 구현에 따라 다름)
                const data = dto?.data ?? dto;

                const merged = toVehicleDetailUiModel(data, vehicle);

                if (alive) {
                    setDetailVehicle(merged);
                }
            } catch (e) {
                // 실패해도 목록 데이터로 버티게 둠 (UI 안 죽게)
                if (alive) {
                    setDetailVehicle(vehicle);
                }
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [vehicle?.id, vehicle?.carId]);

    // -----------------------------
    // ✅ 상세 데이터 바뀌면 draft도 갱신
    // -----------------------------
    useEffect(() => {
        setDraft({
            status: detailVehicle.status ?? "",
            location: detailVehicle.location ?? "",
            mileage: Number(detailVehicle.mileage ?? 0),
        });
    }, [detailVehicle.id, detailVehicle.status, detailVehicle.location, detailVehicle.mileage]);

    // -----------------------------
    // ✅ 목업 데이터 (너 기존 코드 유지)
    // -----------------------------
    const [maintenanceRecords, setMaintenanceRecords] = useState(
        mockMaintenanceRecords.filter((m) => m.vehicleId === detailVehicle.id)
    );

    useEffect(() => {
        setMaintenanceRecords(
            mockMaintenanceRecords.filter((m) => m.vehicleId === detailVehicle.id)
        );
    }, [detailVehicle.id]);

    const rentalHistory = useMemo(
        () => mockRentalHistory.filter((r) => r.vehicleId === detailVehicle.id),
        [detailVehicle.id]
    );

    const handleAddMaintenance = (maintenance) => {
        const newMaintenance = {
            ...maintenance,
            id: Date.now().toString(),
            vehicleId: detailVehicle.id,
        };

        setMaintenanceRecords((prev) => [newMaintenance, ...prev]);
        setIsAddMaintenanceOpen(false);
    };

    // -----------------------------
    // ✅ 상태 색상 (기존 유지)
    // -----------------------------
    const getMaintenanceStatusColor = (status) => {
        switch (status) {
            case "완료":
                return "bg-green-100 text-green-700";
            case "진행중":
                return "bg-blue-100 text-blue-700";
            case "예정":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getRentalStatusColor = (status) => {
        switch (status) {
            case "완료":
                return "bg-green-100 text-green-700";
            case "진행중":
                return "bg-blue-100 text-blue-700";
            case "취소":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // -----------------------------
    // ✅ 변경 감지 / 저장 / 삭제
    // -----------------------------
    const isDirty =
        draft.status !== (detailVehicle.status ?? "") ||
        draft.location !== (detailVehicle.location ?? "") ||
        Number(draft.mileage ?? 0) !== Number(detailVehicle.mileage ?? 0);

    const saveChanges = () => {
        if (!isDirty) return;

        const merged = {
            ...detailVehicle,
            ...draft,
            mileage: Number(draft.mileage ?? 0),
        };

        // 화면 즉시 반영 + 부모 업데이트 콜백
        setDetailVehicle(merged);
        onUpdate?.(merged);
    };

    const handleDelete = () => {
        if (!window.confirm("이 차량을 삭제하시겠습니까?")) return;
        onDelete?.(detailVehicle.id);
        onClose?.();
    };

    // -----------------------------
    // ✅ 렌더링
    // -----------------------------
    const imgSrc =
        detailVehicle.imageUrl ||
        detailVehicle.carImage ||
        detailVehicle.image ||
        "https://placehold.co/160x120?text=No+Image";

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                    {/* 헤더 */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src={imgSrc}
                                alt={detailVehicle.model ?? "vehicle"}
                                className="w-20 h-15 object-cover rounded"
                            />
                            <div>
                                <h2 className="text-gray-900">
                                    {detailVehicle.model ?? "-"}
                                    {loading && (
                                        <span className="ml-2 text-sm text-gray-400">(상세 로딩중)</span>
                                    )}
                                </h2>
                                <p className="text-gray-500">
                                    {detailVehicle.vehicleCode ?? "-"} |{" "}
                                    {detailVehicle.licensePlate ?? detailVehicle.carNumber ?? "-"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                                type="button"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>삭제</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                type="button"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* 탭 */}
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`px-6 py-3 transition-colors ${
                                    activeTab === "info"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                                type="button"
                            >
                                기본 정보
                            </button>
                            <button
                                onClick={() => setActiveTab("maintenance")}
                                className={`px-6 py-3 transition-colors ${
                                    activeTab === "maintenance"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                                type="button"
                            >
                                정비 이력
                            </button>
                            <button
                                onClick={() => setActiveTab("rental")}
                                className={`px-6 py-3 transition-colors ${
                                    activeTab === "rental"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                                type="button"
                            >
                                대여 이력
                            </button>
                        </div>
                    </div>

                    {/* 컨텐츠 */}
                    <div className="p-6">
                        {/* 기본 정보 탭 */}
                        {activeTab === "info" && (
                            <div className="space-y-6">
                                {/* 빠른 수정 */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-gray-900">상태/위치/주행거리 수정</h3>
                                        <button
                                            onClick={saveChanges}
                                            disabled={!isDirty}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                isDirty
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                            type="button"
                                        >
                                            저장
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-700 mb-2">상태</label>
                                            <select
                                                value={draft.status}
                                                onChange={(e) =>
                                                    setDraft((prev) => ({
                                                        ...prev,
                                                        status: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="운행중">운행중</option>
                                                <option value="대기">대기</option>
                                                <option value="정비중">정비중</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2">위치</label>
                                            <input
                                                value={draft.location}
                                                onChange={(e) =>
                                                    setDraft((prev) => ({
                                                        ...prev,
                                                        location: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2">주행거리(km)</label>
                                            <input
                                                type="number"
                                                value={draft.mileage}
                                                onChange={(e) =>
                                                    setDraft((prev) => ({
                                                        ...prev,
                                                        mileage: Number(e.target.value || 0),
                                                    }))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 상세 정보 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <FileText className="w-4 h-4" />
                                                <span>차량 코드</span>
                                            </div>
                                            <div className="text-gray-900">{detailVehicle.vehicleCode ?? "-"}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>제작년도</span>
                                            </div>
                                            <div className="text-gray-900">
                                                {detailVehicle.year ? `${detailVehicle.year}년` : "-"}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Fuel className="w-4 h-4" />
                                                <span>연료 타입</span>
                                            </div>
                                            <div className="text-gray-900">{detailVehicle.fuelType ?? "-"}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>위치</span>
                                            </div>
                                            <div className="text-gray-900">{detailVehicle.location ?? "-"}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Clock className="w-4 h-4" />
                                                <span>주행거리</span>
                                            </div>
                                            <div className="text-gray-900">
                                                {formatNumber(detailVehicle.mileage)} km
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>시스템 등록일</span>
                                            </div>
                                            <div className="text-gray-900">{detailVehicle.registeredDate ?? "-"}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>검사일</span>
                                            </div>
                                            <div className="text-gray-900">{detailVehicle.inspectionDate ?? "-"}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <FileText className="w-4 h-4" />
                                                <span>보험 정보</span>
                                            </div>
                                            <div className="text-gray-900">{detailVehicle.insurance ?? "-"}</div>
                                            <div className="text-gray-500">
                                                보험 등급: {detailVehicle.insuranceType ?? "-"}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <User className="w-4 h-4" />
                                                <span>연령 제한</span>
                                            </div>
                                            <div className="text-gray-900">
                                                {detailVehicle.minAge ? `${detailVehicle.minAge}세 이상` : "-"}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <DollarSign className="w-4 h-4" />
                                                <span>구입가</span>
                                            </div>
                                            <div className="text-gray-900">
                                                {formatCurrency(detailVehicle.purchasePrice)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 정비 이력 탭 */}
                        {activeTab === "maintenance" && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-gray-900">정비 기록</h3>
                                    <button
                                        onClick={() => setIsAddMaintenanceOpen(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        type="button"
                                    >
                                        정비 등록
                                    </button>
                                </div>

                                {maintenanceRecords.length > 0 ? (
                                    <div className="space-y-4">
                                        {maintenanceRecords.map((record) => (
                                            <div
                                                key={record.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="text-gray-900">{record.type}</div>
                                                        <div className="text-gray-500">{record.date}</div>
                                                    </div>
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full ${getMaintenanceStatusColor(
                                                            record.status
                                                        )}`}
                                                    >
                            {record.status}
                          </span>
                                                </div>
                                                <p className="text-gray-600 mb-2">{record.description}</p>
                                                {Number(record.cost ?? 0) > 0 && (
                                                    <div className="text-gray-900">
                                                        비용: {formatCurrency(record.cost)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        정비 기록이 없습니다
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 대여 이력 탭 */}
                        {activeTab === "rental" && (
                            <div>
                                <h3 className="text-gray-900 mb-4">대여 기록</h3>

                                {rentalHistory.length > 0 ? (
                                    <div className="space-y-4">
                                        {rentalHistory.map((rental) => (
                                            <div
                                                key={rental.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-gray-500" />
                                                            <span className="text-gray-900">
                                {rental.memberName ?? "-"}
                              </span>
                                                        </div>
                                                        <div className="text-gray-500 mt-1">
                                                            {rental.startDate ?? "-"} ~ {rental.endDate ?? "-"}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full ${getRentalStatusColor(
                                                            rental.status
                                                        )}`}
                                                    >
                            {rental.status ?? "-"}
                          </span>
                                                </div>
                                                <div className="text-gray-900">
                                                    대여 비용: {formatCurrency(rental.totalCost)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        대여 기록이 없습니다
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 정비 등록 모달 */}
            <AddMaintenanceModal
                isOpen={isAddMaintenanceOpen}
                onClose={() => setIsAddMaintenanceOpen(false)}
                onAdd={handleAddMaintenance}
                vehicleInfo={{
                    model: detailVehicle.model ?? "-",
                    licensePlate: detailVehicle.licensePlate ?? detailVehicle.carNumber ?? "-",
                }}
            />
        </>
    );
}
