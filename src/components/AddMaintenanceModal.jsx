import {useState} from "react";
import {X} from "lucide-react";

const emptyForm = () => ({
    date: "",
    type: "",
    cost: 0,
    description: "",
    status: "예정",
});

export function AddMaintenanceModal({
                                        isOpen,
                                        onClose,
                                        onAdd,
                                        vehicleInfo,
                                    }) {
    const [formData, setFormData] = useState(emptyForm());

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData(emptyForm());
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "cost" ? Number(value || 0) : value,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div
                    className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-gray-900">정비 등록</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                    >
                        <X className="w-6 h-6"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {vehicleInfo && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-gray-900">{vehicleInfo.model}</div>
                            <div className="text-gray-500">{vehicleInfo.licensePlate}</div>
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 mb-2">정비일자</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">정비 종류</label>
                        <input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">비용</label>
                        <input
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">상태</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="예정">예정</option>
                            <option value="진행중">진행중</option>
                            <option value="완료">완료</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">설명</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                            등록
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
