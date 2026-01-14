import {useEffect, useMemo, useState} from "react";
import {Calendar, Clock, DollarSign, FileText, Fuel, MapPin, Trash2, User, X,} from "lucide-react";
import {AddMaintenanceModal} from "./AddMaintenanceModal";
import {mockMaintenanceRecords} from "@/mocks/maintenance";
import {mockRentalHistory} from "@/mocks/rentals";

export function VehicleDetailModal({
                                       vehicle,
                                       onClose,
                                       onUpdate,
                                       onDelete,
                                   }) {
    const [activeTab, setActiveTab] = useState("info");
    const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);

    // 간단 수정용 draft (상태/위치/주행거리만)
    const [draft, setDraft] = useState({
        status: vehicle.status,
        location: vehicle.location,
        mileage: vehicle.mileage,
    });

    useEffect(() => {
        setDraft({
            status: vehicle.status,
            location: vehicle.location,
            mileage: vehicle.mileage,
        });
    }, [vehicle.id, vehicle.location, vehicle.mileage, vehicle.status]);

    const [maintenanceRecords, setMaintenanceRecords] = useState(
        mockMaintenanceRecords.filter((m) => m.vehicleId === vehicle.id)
    );

    useEffect(() => {
        setMaintenanceRecords(mockMaintenanceRecords.filter((m) => m.vehicleId === vehicle.id));
    }, [vehicle.id]);

    const rentalHistory = useMemo(
        () => mockRentalHistory.filter((r) => r.vehicleId === vehicle.id),
        [vehicle.id]
    );

    const handleAddMaintenance = (maintenance) => {
        const newMaintenance = {
            ...maintenance,
            id: Date.now().toString(),
            vehicleId: vehicle.id,
        };

        setMaintenanceRecords((prev) => [newMaintenance, ...prev]);
        setIsAddMaintenanceOpen(false);
    };

    const getMaintenanceStatusColor = (status) => {
        switch (status) {
            case "완료":
                return "bg-green-100 text-green-700";
            case "진행중":
                return "bg-blue-100 text-blue-700";
            case "예정":
                return "bg-yellow-100 text-yellow-700";
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
        }
    };

    const isDirty =
        draft.status !== vehicle.status ||
        draft.location !== vehicle.location ||
        draft.mileage !== vehicle.mileage;

    const saveChanges = () => {
        if (!isDirty) return;
        onUpdate({...vehicle, ...draft});
    };

    const handleDelete = () => {
        if (!confirm("이 차량을 삭제하시겠습니까?")) return;
        onDelete(vehicle.id);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                    {/* 헤더 */}
                    <div
                        className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src={vehicle.imageUrl}
                                alt={vehicle.model}
                                className="w-20 h-15 object-cover rounded"
                            />
                            <div>
                                <h2 className="text-gray-900">{vehicle.model}</h2>
                                <p className="text-gray-500">
                                    {vehicle.vehicleCode} | {vehicle.licensePlate}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                                type="button"
                            >
                                <Trash2 className="w-4 h-4"/>
                                <span>삭제</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                type="button"
                            >
                                <X className="w-6 h-6"/>
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
                                                    setDraft((prev) => ({...prev, location: e.target.value}))
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
                                                <FileText className="w-4 h-4"/>
                                                <span>차량 코드</span>
                                            </div>
                                            <div className="text-gray-900">{vehicle.vehicleCode}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Calendar className="w-4 h-4"/>
                                                <span>제작년도</span>
                                            </div>
                                            <div className="text-gray-900">{vehicle.year}년</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Fuel className="w-4 h-4"/>
                                                <span>연료 타입</span>
                                            </div>
                                            <div className="text-gray-900">{vehicle.fuelType}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <MapPin className="w-4 h-4"/>
                                                <span>위치</span>
                                            </div>
                                            <div className="text-gray-900">{vehicle.location}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Clock className="w-4 h-4"/>
                                                <span>주행거리</span>
                                            </div>
                                            <div className="text-gray-900">
                                                {vehicle.mileage} km
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Calendar className="w-4 h-4"/>
                                                <span>시스템 등록일</span>
                                            </div>
                                            <div className="text-gray-900">{vehicle.registeredDate}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <Calendar className="w-4 h-4"/>
                                                <span>검사일</span>
                                            </div>
                                            <div className="text-gray-900">{vehicle.inspectionDate}</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <FileText className="w-4 h-4"/>
                                                <span>보험 정보</span>
                                            </div>
                                            <div className="text-gray-900">{vehicle.insurance}</div>
                                            <div className="text-gray-500">
                                                보험 등급: {vehicle.insuranceType}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <User className="w-4 h-4"/>
                                                <span>연령 제한</span>
                                            </div>
                                            <div className="text-gray-900">{vehicle.minAge}세 이상</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                <DollarSign className="w-4 h-4"/>
                                                <span>구입가</span>
                                            </div>
                                            <div className="text-gray-900">
                                                ₩{vehicle.purchasePrice.toLocaleString()}
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
                                                {record.cost > 0 && (
                                                    <div className="text-gray-900">
                                                        비용: ₩{record.cost.toLocaleString()}
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
                                                            <User className="w-4 h-4 text-gray-500"/>
                                                            <span className="text-gray-900">
                                {rental.memberName}
                              </span>
                                                        </div>
                                                        <div className="text-gray-500 mt-1">
                                                            {rental.startDate} ~ {rental.endDate}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full ${getRentalStatusColor(
                                                            rental.status
                                                        )}`}
                                                    >
                            {rental.status}
                          </span>
                                                </div>
                                                <div className="text-gray-900">
                                                    대여 비용: ₩{rental.totalCost.toLocaleString()}
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
                    model: vehicle.model,
                    licensePlate: vehicle.licensePlate,
                }}
            />
        </>
    );
}
