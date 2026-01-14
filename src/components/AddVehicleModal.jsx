import {useState} from "react";
import {X} from "lucide-react";

const emptyForm = () => ({
    vehicleCode: "",
    imageUrl: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    location: "",
    mileage: 0,
    fuelType: "가솔린",
    registeredDate: "",
    inspectionDate: "",
    insurance: "",
    insuranceType: "일반",
    minAge: 21,
    purchasePrice: 0,
    status: "대기",
});

export function AddVehicleModal({isOpen, onClose, onAdd}) {
    const [formData, setFormData] = useState(emptyForm());

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData(emptyForm());
    };

    const handleChange = (key, value) => {
        setFormData((prev) => ({...prev, [key]: value}));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div
                    className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-gray-900">새 차량 추가</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                    >
                        <X className="w-6 h-6"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">차량코드</label>
                            <input
                                required
                                value={formData.vehicleCode}
                                onChange={(e) => handleChange("vehicleCode", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">차량번호</label>
                            <input
                                required
                                value={formData.licensePlate}
                                onChange={(e) => handleChange("licensePlate", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">모델명</label>
                            <input
                                required
                                value={formData.model}
                                onChange={(e) => handleChange("model", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">제작년도</label>
                            <input
                                type="number"
                                required
                                value={formData.year}
                                onChange={(e) => handleChange("year", Number(e.target.value || 0))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">위치</label>
                            <input
                                required
                                value={formData.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">주행거리(km)</label>
                            <input
                                type="number"
                                required
                                value={formData.mileage}
                                onChange={(e) => handleChange("mileage", Number(e.target.value || 0))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">유종</label>
                            <select
                                value={formData.fuelType}
                                onChange={(e) =>
                                    handleChange("fuelType", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="가솔린">가솔린</option>
                                <option value="디젤">디젤</option>
                                <option value="전기">전기</option>
                                <option value="LPG">LPG</option>
                                <option value="하이브리드">하이브리드</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">상태</label>
                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    handleChange("status", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="운행중">운행중</option>
                                <option value="대기">대기</option>
                                <option value="정비중">정비중</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">차량 이미지 URL</label>
                        <input
                            value={formData.imageUrl}
                            onChange={(e) => handleChange("imageUrl", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">시스템 등록일</label>
                            <input
                                type="date"
                                value={formData.registeredDate}
                                onChange={(e) => handleChange("registeredDate", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">검사일</label>
                            <input
                                type="date"
                                value={formData.inspectionDate}
                                onChange={(e) => handleChange("inspectionDate", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">보험 정보</label>
                            <input
                                value={formData.insurance}
                                onChange={(e) => handleChange("insurance", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">보험 등급</label>
                            <select
                                value={formData.insuranceType}
                                onChange={(e) =>
                                    handleChange(
                                        "insuranceType",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="일반">일반</option>
                                <option value="고급">고급</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">연령 제한</label>
                            <input
                                type="number"
                                value={formData.minAge}
                                onChange={(e) => handleChange("minAge", Number(e.target.value || 0))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">구입가</label>
                            <input
                                type="number"
                                value={formData.purchasePrice}
                                onChange={(e) =>
                                    handleChange("purchasePrice", Number(e.target.value || 0))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            추가
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
