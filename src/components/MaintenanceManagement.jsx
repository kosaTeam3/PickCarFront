import {useMemo, useState} from "react";
import {AlertCircle, Calendar, Filter, Plus, Wrench} from "lucide-react";
import {AddMaintenanceModal} from "./AddMaintenanceModal";
import {VehicleSelectionModal} from "./VehicleSelectionModal";
import {mockMaintenanceRecords} from "@/mocks/maintenance";
import {mockVehicleLookup, mockVehicles} from "@/mocks/vehicles";

export function MaintenanceManagement() {
    const [records, setRecords] = useState(mockMaintenanceRecords);
    const [isVehicleSelectionOpen, setIsVehicleSelectionOpen] = useState(false);
    const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        vehicleModel: "",
        vehicleCode: "",
        // ""(전체) | "완료" | "진행중" | "예정"
        status: "",
    });

    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsVehicleSelectionOpen(false);
        setIsAddMaintenanceOpen(true);
    };

    const handleAddMaintenance = (maintenance) => {
        if (!selectedVehicle) return;

        const newMaintenance = {
            ...maintenance,
            id: Date.now().toString(),
            vehicleId: selectedVehicle.id,
        };

        setRecords((prev) => [newMaintenance, ...prev]);
        setIsAddMaintenanceOpen(false);
        setSelectedVehicle(null);
    };

    const filteredRecords = useMemo(() => {
        return records.filter((record) => {
            const vehicle = mockVehicleLookup[record.vehicleId];
            if (!vehicle) return false;

            const matchesModel =
                !filters.vehicleModel || vehicle.model.includes(filters.vehicleModel);
            const matchesCode =
                !filters.vehicleCode ||
                vehicle.vehicleCode.toLowerCase().includes(filters.vehicleCode.toLowerCase());
            const matchesStatus = !filters.status || record.status === filters.status;

            return matchesModel && matchesCode && matchesStatus;
        });
    }, [records, filters]);

    const getStatusColor = (status) => {
        switch (status) {
            case "완료":
                return "bg-green-100 text-green-700";
            case "진행중":
                return "bg-blue-100 text-blue-700";
            case "예정":
                return "bg-yellow-100 text-yellow-700";
        }
    };

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
                    <Plus className="w-5 h-5"/>
                    <span>정비 등록</span>
                </button>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Wrench className="w-5 h-5 text-green-600"/>
                        </div>
                        <span className="text-gray-600">완료된 정비</span>
                    </div>
                    <div className="text-gray-900">
                        {records.filter((r) => r.status === "완료").length}건
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-blue-600"/>
                        </div>
                        <span className="text-gray-600">진행중</span>
                    </div>
                    <div className="text-gray-900">
                        {records.filter((r) => r.status === "진행중").length}건
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-yellow-600"/>
                        </div>
                        <span className="text-gray-600">예정된 정비</span>
                    </div>
                    <div className="text-gray-900">
                        {records.filter((r) => r.status === "예정").length}건
                    </div>
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
                        <Filter className="w-4 h-4"/>
                        <span>필터</span>
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="block text-gray-700 mb-2">차종</label>
                            <select
                                value={filters.vehicleModel}
                                onChange={(e) =>
                                    setFilters((prev) => ({...prev, vehicleModel: e.target.value}))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">전체</option>
                                {vehicleModels.map((model) => (
                                    <option key={model} value={model}>
                                        {model}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">차량코드</label>
                            <input
                                type="text"
                                value={filters.vehicleCode}
                                onChange={(e) =>
                                    setFilters((prev) => ({...prev, vehicleCode: e.target.value}))
                                }
                                placeholder="예: VH-2023-001"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">정비 상태</label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        status: e.target.value,
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">전체</option>
                                <option value="완료">완료</option>
                                <option value="진행중">진행중</option>
                                <option value="예정">예정</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* 정비 기록 테이블 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-700">차량코드</th>
                            <th className="px-6 py-3 text-left text-gray-700">차량</th>
                            <th className="px-6 py-3 text-left text-gray-700">정비 유형</th>
                            <th className="px-6 py-3 text-left text-gray-700">일자</th>
                            <th className="px-6 py-3 text-left text-gray-700">비용</th>
                            <th className="px-6 py-3 text-left text-gray-700">상태</th>
                            <th className="px-6 py-3 text-left text-gray-700">설명</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredRecords.map((record) => {
                            const vehicle = mockVehicleLookup[record.vehicleId];
                            return (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">
                                        {vehicle?.vehicleCode || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {vehicle ? (
                                            <>
                                                <div className="text-gray-900">{vehicle.model}</div>
                                                <div className="text-gray-500">{vehicle.licensePlate}</div>
                                            </>
                                        ) : (
                                            <div className="text-gray-500">알 수 없음</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">{record.type}</td>
                                    <td className="px-6 py-4 text-gray-600">{record.date}</td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {record.cost > 0 ? `₩${record.cost.toLocaleString()}` : "-"}
                                    </td>
                                    <td className="px-6 py-4">
                      <span
                          className={`inline-block px-3 py-1 rounded-full ${getStatusColor(
                              record.status
                          )}`}
                      >
                        {record.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{record.description}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {filteredRecords.length === 0 && (
                    <div className="text-center py-12 text-gray-500">정비 기록이 없습니다</div>
                )}
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
        </div>
    );
}
