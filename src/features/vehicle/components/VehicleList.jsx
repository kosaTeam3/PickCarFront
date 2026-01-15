import { useEffect, useMemo, useState } from "react";
import { Filter, Plus, Search } from "lucide-react";

import { AddVehicleModal } from "./AddVehicleModal";
import { VehicleDetailModal } from "./VehicleDetailModal";

import { mockVehicles } from "@/mocks/vehicles";
import { getVehicleList, toVehicleUiModel } from "@/api/vehicle";
import { extractContent } from "@/api/api";

export function VehicleList() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    status: "",
    fuelType: "",
    location: "",
  });

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getVehicleList({ page: 0, size: 20 });
        const content = extractContent(res);
        const mapped = content.map(toVehicleUiModel);

        if (!ignore) setVehicles(mapped);
      } catch (e) {
        if (!ignore) setError(e?.message ?? String(e));
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAddVehicle = (newVehicle) => {
    // TODO: 실제 API(createVehicle) 붙일 때 여기서 POST하고 성공 응답으로 state 갱신해라.
    // 지금은 화면에서만 추가되는 목업.
    const vehicle = {
      ...newVehicle,
      id: Date.now().toString(),
      carId: undefined,

      // UI에서 쓰는 필드명 정규화
      vehicleIdNum: newVehicle.vehicleCode ?? newVehicle.vehicleIdNum ?? "",
      carNumber: newVehicle.licensePlate ?? newVehicle.carNumber ?? "",
      licensePlate: newVehicle.licensePlate ?? newVehicle.carNumber ?? "",
      carImage: newVehicle.imageUrl ?? newVehicle.carImage ?? "",
    };

    setVehicles((prev) => [vehicle, ...prev]);
  };

  const handleDeleteVehicle = (id) => {
    if (!confirm("이 차량을 삭제하시겠습니까?")) return;
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const filteredVehicles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const model = String(vehicle.model ?? "").toLowerCase();
      const plate = String(vehicle.licensePlate ?? vehicle.carNumber ?? "").toLowerCase();
      const code = String(vehicle.vehicleIdNum ?? vehicle.vehicleCode ?? "").toLowerCase();
      const location = String(vehicle.location ?? "");

      const matchesSearch = !q || model.includes(q) || plate.includes(q) || code.includes(q);
      const matchesStatus = !filters.status || vehicle.status === filters.status;
      const matchesFuelType = !filters.fuelType || vehicle.fuelType === filters.fuelType;
      const matchesLocation = !filters.location || location.includes(filters.location);

      return matchesSearch && matchesStatus && matchesFuelType && matchesLocation;
    });
  }, [vehicles, searchTerm, filters]);

  const getStatusColor = (status) => {
    switch (status) {
      case "운행중":
        return "bg-green-100 text-green-700";
      case "정비중":
        return "bg-red-100 text-red-700";
      case "대기":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const locations = useMemo(() => {
    const list = vehicles
      .map((v) => String(v.location ?? "").trim())
      .filter(Boolean)
      .map((loc) => loc.split(" ")[0]);

    return Array.from(new Set(list));
  }, [vehicles]);

  return (
    <div className="p-8">
      {loading && <div className="mb-4 text-gray-500">불러오는 중...</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">차량 관리</h1>
        <p className="text-gray-500">전체 차량 목록을 관리합니다</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="차량 모델, 차량번호, 차량코드로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? "bg-blue-50 border-blue-500 text-blue-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            type="button"
          >
            <Filter className="w-5 h-5" />
            <span>필터</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            type="button"
          >
            <Plus className="w-5 h-5" />
            <span>새 차량 추가</span>
          </button>
        </div>

        {/* 필터 옵션 */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-gray-700 mb-2">상태</label>
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
                <option value="운행중">운행중</option>
                <option value="대기">대기</option>
                <option value="정비중">정비중</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">유종</label>
              <select
                value={filters.fuelType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    fuelType: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="가솔린">가솔린</option>
                <option value="디젤">디젤</option>
                <option value="전기">전기</option>
                <option value="LPG">LPG</option>
                <option value="하이브리드">하이브리드</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">지역</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 차량 목록 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">차량코드</th>
                <th className="px-6 py-3 text-left text-gray-700">차량</th>
                <th className="px-6 py-3 text-left text-gray-700">유종</th>
                <th className="px-6 py-3 text-left text-gray-700">차량번호</th>
                <th className="px-6 py-3 text-left text-gray-700">위치</th>
                <th className="px-6 py-3 text-left text-gray-700">주행거리</th>
                <th className="px-6 py-3 text-left text-gray-700">연령제한</th>
                <th className="px-6 py-3 text-left text-gray-700">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-gray-600">{vehicle.vehicleIdNum ?? "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={vehicle.carImage}
                        alt={vehicle.model}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="text-gray-900">{vehicle.model}</div>
                        <div className="text-gray-500">
                          {vehicle.year ? `${vehicle.year}년형` : "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {vehicle.fuelType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{vehicle.carNumber ?? "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{vehicle.location ?? "-"}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {Number(vehicle.mileage ?? 0).toLocaleString()} km
                  </td>
                  <td className="px-6 py-4 text-gray-600">{vehicle.ageLimit}세 이상</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full ${getStatusColor(
                        vehicle.status
                      )}`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12 text-gray-500">검색 결과가 없습니다</div>
        )}
      </div>

      {/* 차량 추가 모달 */}
      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddVehicle}
      />

      {/* 차량 상세 모달 */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onUpdate={(updatedVehicle) => {
            setVehicles((prev) =>
              prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
            );
            setSelectedVehicle(null);
          }}
          onDelete={handleDeleteVehicle}
        />
      )}
    </div>
  );
}
