import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Calendar, Filter, Plus, Wrench } from "lucide-react";

import { AddMaintenanceModal } from "./AddMaintenanceModal";
import { VehicleSelectionModal } from "@/features/vehicle";
import { MaintenanceDetailModal } from "@/features/maintenance/components/MaintenanceDetailModal";

import { mockVehicleLookup, mockVehicles } from "@/mocks/vehicles";
import { getMaintenanceList } from "@/api/maintenance";

const STATUS_LABEL = {
    SCHEDULE: "예정",
    ONGOING: "진행중",
    COMPLETED: "완료",
};

const getStatusColor = (statusEnum) => {
    switch (statusEnum) {
        case "COMPLETED":
            return "bg-green-100 text-green-700";
        case "ONGOING":
            return "bg-blue-100 text-blue-700";
        case "SCHEDULE":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export function MaintenanceManagement() {
    // ✅ 서버에서 내려오는 목록: MaintenanceListResponse[]
    // { maintenanceId, carId, branchId, employeeId, employeeName, title, status }
    const [records, setRecords] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 페이지 정보
    const [page, setPage] = useState(0);
    const [pageInfo, setPageInfo] = useState({
        totalPages: 0,
        totalElements: 0,
    });

    // 서버 재조회 트리거
    const [refreshKey, setRefreshKey] = useState(0);

    // 모달/UI
    const [isVehicleSelectionOpen, setIsVehicleSelectionOpen] = useState(false);
    const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // 상세 모달: maintenanceId + carId 같이 저장
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);

    const [showFilters, setShowFilters] = useState(false);

    // ✅ 백엔드 필터에 맞춤: branchId / status(enum) / keyword
    const [filters, setFilters] = useState({
        branchId: "", // string으로 들고 있다가 Number로 변환
        status: "", // "" | "SCHEDULE" | "ONGOING" | "COMPLETED"
        keyword: "",
    });

    // ===== 목록 조회 =====
    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            setError("");

            try {
                const params = {
                    page,
                    size: 20,
                    sort: "id,DESC",
                    branchId: filters.branchId ? Number(filters.branchId) : undefined,
                    status: filters.status || undefined,
                    keyword: filters.keyword || undefined,
                };

                const res = await getMaintenanceList(params);
                const data = res?.data ?? res;

                setRecords(Array.isArray(data?.content) ? data.content : []);
                setPageInfo({
                    totalPages: data?.totalPages ?? 0,
                    totalElements: data?.totalElements ?? 0,
                });
            } catch (e) {
                setError(e?.message ?? "정비 목록 조회 실패");
                setRecords([]);
                setPageInfo({ totalPages: 0, totalElements: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [page, filters.branchId, filters.status, filters.keyword, refreshKey]);

    // ===== 통계 =====
    const completedCount = useMemo(
        () => records.filter((r) => r.status === "COMPLETED").length,
        [records]
    );
    const ongoingCount = useMemo(
        () => records.filter((r) => r.status === "ONGOING").length,
        [records]
    );
    const scheduleCount = useMemo(
        () => records.filter((r) => r.status === "SCHEDULE").length,
        [records]
    );

    // ===== 차량 선택 → 등록 모달 =====
    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsVehicleSelectionOpen(false);
        setIsAddMaintenanceOpen(true);
    };

    // ⚠️ 현재 AddMaintenanceModal이 실제 서버 POST랑 연결 안 되어있으면
    // 일단 화면만 갱신되게 하거나, 등록 후 refreshKey 올려서 재조회 하면 됨.
    const handleAddMaintenance = (maintenance) => {
        if (!selectedVehicle) return;

        // 서버 스펙이 확정되기 전 임시
        // 실제로는 createMaintenance(...) 성공 후 refreshKey 올려라
        setIsAddMaintenanceOpen(false);
        setSelectedVehicle(null);

        // 목록 새로고침
        setPage(0);
        setRefreshKey((v) => v + 1);
    };

    // ===== 필터 변경 시 page 0으로 초기화 =====
    const updateFilters = (patch) => {
        setFilters((prev) => ({ ...prev, ...patch }));
        setPage(0);
    };

    // (이거 지금은 mockVehicles라 그냥 남겨둠)
    const vehicleModels = useMemo(() => {
        return Array.from(new Set(mockVehicles.map((v) => v.model)));
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-gray-900 mb-2">정비 관리</h1>
                    <p className="text-gray-500">차량 정비 이력 및 예정 작업을 관리합니다</p>
                </div>

                <button
                    onClick={() => setIsVehicleSelectionOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    type="button"
                >
                    <Plus className="w-5 h-5" />
                    <span>정비 등록</span>
                </button>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Wrench className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-gray-600">완료된 정비</span>
                    </div>
                    <div className="text-gray-900">{completedCount}건</div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-gray-600">진행중</span>
                    </div>
                    <div className="text-gray-900">{ongoingCount}건</div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-yellow-600" />
                        </div>
                        <span className="text-gray-600">예정된 정비</span>
                    </div>
                    <div className="text-gray-900">{scheduleCount}건</div>
                </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-700">검색 및 필터</h3>
                    <button
                        onClick={() => setShowFilters((v) => !v)}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors ${
                            showFilters
                                ? "bg-blue-50 border-blue-500 text-blue-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                        type="button"
                    >
                        <Filter className="w-4 h-4" />
                        <span>필터</span>
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="block text-gray-700 mb-2">지점 ID</label>
                            <input
                                type="number"
                                value={filters.branchId}
                                onChange={(e) => updateFilters({ branchId: e.target.value })}
                                placeholder="예: 1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">검색어</label>
                            <input
                                type="text"
                                value={filters.keyword}
                                onChange={(e) => updateFilters({ keyword: e.target.value })}
                                placeholder="예: 엔진오일, 직원명, 제목"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">정비 상태</label>
                            <select
                                value={filters.status}
                                onChange={(e) => updateFilters({ status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">전체</option>
                                <option value="SCHEDULE">예정</option>
                                <option value="ONGOING">진행중</option>
                                <option value="COMPLETED">완료</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* 로딩/에러 */}
            {loading && (
                <div className="mb-4 text-gray-500">정비 목록 불러오는 중...</div>
            )}
            {error && (
                <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                    {error}
                </div>
            )}

            {/* 정비 기록 테이블 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-700">차량코드</th>
                            <th className="px-6 py-3 text-left text-gray-700">차량</th>
                            <th className="px-6 py-3 text-left text-gray-700">정비 제목</th>
                            <th className="px-6 py-3 text-left text-gray-700">직원명</th>
                            <th className="px-6 py-3 text-left text-gray-700">상태</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {records.map((record) => {
                            const vehicle = mockVehicleLookup[record.carId];

                            return (
                                <tr
                                    key={record.maintenanceId}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() =>
                                        setSelectedMaintenance({
                                            maintenanceId: record.maintenanceId,
                                            vehicleId: record.carId,
                                        })
                                    }
                                >
                                    <td className="px-6 py-4 text-gray-600">
                                        {vehicle?.vehicleCode ?? `CAR-${record.carId}`}
                                    </td>

                                    <td className="px-6 py-4">
                                        {vehicle ? (
                                            <>
                                                <div className="text-gray-900">{vehicle.model}</div>
                                                <div className="text-gray-500">{vehicle.licensePlate}</div>
                                            </>
                                        ) : (
                                            <div className="text-gray-500">차량 정보 없음</div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-gray-900">
                                        {record.title ?? "-"}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {record.employeeName ?? "-"}
                                    </td>

                                    <td className="px-6 py-4">
                      <span
                          className={`inline-block px-3 py-1 rounded-full ${getStatusColor(
                              record.status
                          )}`}
                      >
                        {STATUS_LABEL[record.status] ?? record.status ?? "-"}
                      </span>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {!loading && records.length === 0 && (
                    <div className="text-center py-12 text-gray-500">정비 기록이 없습니다</div>
                )}
            </div>

            {/* 페이징 */}
            <div className="flex justify-between items-center mt-4">
                <div className="text-gray-500">
                    총 {pageInfo.totalElements}건
                </div>

                <div className="flex gap-2">
                    <button
                        className="px-3 py-2 border rounded disabled:opacity-40"
                        disabled={page <= 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        type="button"
                    >
                        이전
                    </button>

                    <button
                        className="px-3 py-2 border rounded disabled:opacity-40"
                        disabled={page + 1 >= pageInfo.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        type="button"
                    >
                        다음
                    </button>
                </div>
            </div>

            {/* 차량 선택 모달 */}
            <VehicleSelectionModal
                isOpen={isVehicleSelectionOpen}
                onClose={() => setIsVehicleSelectionOpen(false)}
                onSelect={handleVehicleSelect}
            />

            {/* 정비 등록 모달 */}
            <AddMaintenanceModal
                isOpen={isAddMaintenanceOpen}
                onClose={() => setIsAddMaintenanceOpen(false)}
                onAdd={handleAddMaintenance}
                vehicleInfo={selectedVehicle || undefined}
            />

            {/* 정비 상세 모달 */}
            {selectedMaintenance && (
                <MaintenanceDetailModal
                    maintenanceId={selectedMaintenance.maintenanceId}
                    vehicle={mockVehicleLookup[selectedMaintenance.vehicleId]}
                    onClose={() => setSelectedMaintenance(null)}
                />
            )}
        </div>
    );
}
