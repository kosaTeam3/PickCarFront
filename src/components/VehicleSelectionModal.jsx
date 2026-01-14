import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { mockVehicles } from "@/mocks/vehicles";
export function VehicleSelectionModal({
  isOpen,
  onClose,
  onSelect,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return mockVehicles.filter((v) => {
      if (!q) return true;
      return (
        v.model.toLowerCase().includes(q) ||
        v.licensePlate.includes(searchTerm) ||
        v.vehicleCode.toLowerCase().includes(q)
      );
    });
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleSelect = (vehicle) => {
    onSelect({
      id: vehicle.id,
      model: vehicle.model,
      licensePlate: vehicle.licensePlate,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">차량 선택</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="차량 모델, 차량번호, 차량코드로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            {filteredVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => handleSelect(vehicle)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                type="button"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.model}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="text-gray-900">{vehicle.model}</div>
                    <div className="text-gray-500">
                      {vehicle.vehicleCode} | {vehicle.licensePlate}
                    </div>
                    <div className="text-gray-500">{vehicle.location}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {vehicle.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
