import {api} from "./client";

// 네 백엔드 엔드포인트에 맞춰서 수정
export function getVehicleList(params) {
    return api("/api/manager/vehicles", {params});
}

export function getVehicleDetail(vehicleId) {
    return api(`/api/manager/vehicles/${vehicleId}`);
}

export function createVehicle(payload) {
    return api("/api/manager/vehicles", {method: "POST", body: payload});
}

export function updateVehicle(vehicleId, payload) {
    return api(`/api/manager/vehicles/${vehicleId}`, {method: "PUT", body: payload});
}

export function deleteVehicle(vehicleId) {
    return api(`/api/manager/vehicles/${vehicleId}`, {method: "DELETE"});
}

export function toVehicleUiModel(dto) {
    return {
        id: dto.carId,
        carId: dto.carId,

        vehicleCode: dto.vehicleIdNumber,
        vehicleIdNum: dto.vehicleIdNumber,

        carImage: dto.image,
        model: dto.model,
        carNumber: dto.carNumber,

        location: dto.branchName ?? "",

        mileage: Number(dto.mileage ?? 0),
        ageLimit: dto.ageLimit ?? 0,

        // ✅ UI 표기용
        status: STATUS_KO[dto.status] ?? dto.status,
        fuelType: FUEL_KO[dto.fuelType] ?? dto.fuelType,

        // ✅ 내부값도 같이 들고 있으면 필터/색상 로직 편함
        statusCode: dto.status,
        fuelTypeCode: dto.fuelType,

        color: dto.color,
        branchId: dto.branchId,
        branchName: dto.branchName,
    };
}

const STATUS_KO = {
    DRIVING: "운행중",
    MAINTENANCE: "정비중",
    WAITING: "대기",
};

const FUEL_KO = {
    GASOLINE: "가솔린",
    DIESEL: "디젤",
    ELECTRIC: "전기",
    LPG: "LPG",
    HYBRID: "하이브리드",
};
