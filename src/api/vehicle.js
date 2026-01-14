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

const TODO_VALUE = "TODO";

export function toVehicleListUiModel(dto) {
    return {
        id: dto.carId,
        carId: dto.carId,

        vehicleCode: dto.vehicleIdNumber ?? TODO_VALUE,
        vehicleIdNum: dto.vehicleIdNumber ?? TODO_VALUE,

        carImage: dto.image ?? "",
        imageUrl: dto.image ?? "",
        model: dto.model ?? TODO_VALUE,
        carNumber: dto.carNumber ?? TODO_VALUE,
        licensePlate: dto.carNumber ?? TODO_VALUE,

        location: dto.branchName ?? TODO_VALUE,

        mileage: Number(dto.mileage ?? 0),
        ageLimit: dto.ageLimit ?? 0,
        year: dto.year ?? TODO_VALUE,

        // ✅ UI 표기용
        status: STATUS_KO[dto.status] ?? (dto.status ?? TODO_VALUE),
        fuelType: FUEL_KO[dto.fuelType] ?? (dto.fuelType ?? TODO_VALUE),

        // ✅ 내부값도 같이 들고 있으면 필터/색상 로직 편함
        statusCode: dto.status ?? "",
        fuelTypeCode: dto.fuelType ?? "",

        color: dto.color ?? TODO_VALUE,
        branchId: dto.branchId ?? null,
        branchName: dto.branchName ?? null,
    };
}

export function toVehicleDetailUiModel(dto) {
    return {
        id: dto.carId,
        carId: dto.carId,
        vehicleCode: dto.vehicleIdNumber ?? TODO_VALUE,
        vehicleIdNum: dto.vehicleIdNumber ?? TODO_VALUE,
        model: dto.model ?? TODO_VALUE,
        brand: dto.brand ?? TODO_VALUE,
        price: dto.price ?? 0,
        year: dto.year ?? TODO_VALUE,
        ageLimit: dto.ageLimit ?? 0,
        fuelType: FUEL_KO[dto.fuelType] ?? (dto.fuelType ?? TODO_VALUE),
        fuelTypeCode: dto.fuelType ?? "",
        carImage: dto.image ?? "",
        imageUrl: dto.image ?? "",
        branchId: dto.branchId ?? null,
        carNumber: dto.carNumber ?? TODO_VALUE,
        licensePlate: dto.carNumber ?? TODO_VALUE,
        mileage: Number(dto.mileage ?? 0),
        maintenanceDate: dto.maintenanceDate ?? TODO_VALUE,
        insurance: dto.insuranceName ?? TODO_VALUE,
        insuranceType: TODO_VALUE,
        status: STATUS_KO[dto.status] ?? (dto.status ?? TODO_VALUE),
        statusCode: dto.status ?? "",
        purchasePrice: dto.purchasePrice ?? 0,
        modelPrice: dto.modelPrice ?? 0,
        seater: dto.seater ?? 0,
        color: dto.color ?? TODO_VALUE,
        registeredDate: TODO_VALUE,
        inspectionDate: dto.maintenanceDate ?? TODO_VALUE,
        location: TODO_VALUE,
        minAge: dto.ageLimit ?? 0,
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
