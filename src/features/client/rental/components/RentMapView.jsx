import { useState } from 'react';
import { MapPin, ArrowLeft, LogOut, X, Users, Fuel, Settings, Calendar } from 'lucide-react';
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
// Mock 렌터카 지점 데이터
const RENTAL_LOCATIONS = [
    { lat: 37.5665, lng: 126.9780, name: '서울역 지점' },
    { lat: 37.5511, lng: 126.9882, name: '강남역 지점' },
    { lat: 37.5172, lng: 127.0473, name: '잠실 지점' },
    { lat: 37.5794, lng: 126.9770, name: '광화문 지점' },
    { lat: 37.4979, lng: 127.0276, name: '강남구청 지점' },
    { lat: 37.5641, lng: 126.9375, name: '마포 지점' },
];
// Mock 차량 데이터
const VEHICLES = [
    {
        id: '1',
        name: '현대 아반떼',
        type: '준중형 세단',
        image: 'https://images.unsplash.com/photo-1658662160331-62f7e52e63de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjY5NjgwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        pricePerDay: 50000,
        pricePerHour: 7000,
        seats: 5,
        fuel: '가솔린',
        transmission: '자동',
        available: true,
    },
    {
        id: '2',
        name: '기아 쏘렌토',
        type: 'SUV',
        image: 'https://images.unsplash.com/photo-1639280791656-5f8506ff21d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXYlMjBjYXJ8ZW58MXx8fHwxNzY2OTcxNjk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        pricePerDay: 85000,
        pricePerHour: 11000,
        seats: 7,
        fuel: '디젤',
        transmission: '자동',
        available: true,
    },
    {
        id: '3',
        name: '현대 캐스퍼',
        type: '경형',
        image: 'https://images.unsplash.com/photo-1766602111000-96a7685d79f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyfGVufDF8fHx8MTc2NjkxMDQzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
        pricePerDay: 35000,
        pricePerHour: 5000,
        seats: 4,
        fuel: '가솔린',
        transmission: '자동',
        available: true,
    },
    {
        id: '4',
        name: '제네시스 G80',
        type: '대형 세단',
        image: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXJ8ZW58MXx8fHwxNzY2OTEzODA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        pricePerDay: 150000,
        pricePerHour: 20000,
        seats: 5,
        fuel: '가솔린',
        transmission: '자동',
        available: true,
    },
    {
        id: '5',
        name: '현대 쏘나타',
        type: '중형 세단',
        image: 'https://images.unsplash.com/photo-1658662160331-62f7e52e63de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjY5NjgwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        pricePerDay: 65000,
        pricePerHour: 9000,
        seats: 5,
        fuel: '하이브리드',
        transmission: '자동',
        available: true,
    },
    {
        id: '6',
        name: '기아 스포티지',
        type: 'SUV',
        image: 'https://images.unsplash.com/photo-1639280791656-5f8506ff21d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXYlMjBjYXJ8ZW58MXx8fHwxNzY2OTcxNjk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        pricePerDay: 70000,
        pricePerHour: 9500,
        seats: 5,
        fuel: '가솔린',
        transmission: '자동',
        available: false,
    },
];
export function RentMapView({ user, startTime, endTime, onBack, onRentalComplete, onLogout }) {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [hoveredLocation, setHoveredLocation] = useState(null);
    const [showVehiclePopup, setShowVehiclePopup] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    // 렌트 기간 계산
    const calculateRentalPeriod = () => {
        if (!startTime)
            return null;
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : new Date(start.getTime() + 24 * 60 * 60 * 1000);
        const hoursDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
        const daysDiff = Math.ceil(hoursDiff / 24);
        return { hours: hoursDiff, days: daysDiff };
    };
    const rentalPeriod = calculateRentalPeriod();
    // 가격 계산
    const calculatePrice = (vehicle) => {
        if (!rentalPeriod)
            return 0;
        if (rentalPeriod.hours >= 24) {
            return vehicle.pricePerDay * rentalPeriod.days;
        }
        else {
            return vehicle.pricePerHour * rentalPeriod.hours;
        }
    };
    const handleLocationClick = (location) => {
        setSelectedLocation(location);
        setShowVehiclePopup(true);
        setSelectedVehicle(null);
    };
    const handleReservation = () => {
        if (selectedVehicle && selectedLocation) {
            const price = calculatePrice(selectedVehicle);
            const rental = {
                vehicle: selectedVehicle,
                location: selectedLocation,
                startTime: startTime,
                endTime: endTime,
                price: price,
            };
            onRentalComplete(rental);
            setShowVehiclePopup(false);
            setSelectedVehicle(null);
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5"/>
                이전
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white">{user.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-gray-900">{user.name}님</p>
                </div>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <LogOut className="w-5 h-5"/>
              로그아웃
            </button>
          </div>

          {/* Rental Info */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-600"/>
              </div>
              <div>
                <p className="text-gray-600">렌트 기간</p>
                <p className="text-gray-900">
                  {rentalPeriod ? (rentalPeriod.hours >= 24 ? `${rentalPeriod.days}일` : `${rentalPeriod.hours}시간`) : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-gray-600">시작 시간</p>
                <p className="text-gray-900">{new Date(startTime).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-gray-900 mb-4">렌터카 지점 선택</h2>
              <p className="text-gray-600 mb-6">지도에서 원하는 지점을 선택하세요</p>
              
              {/* Mock Map */}
              <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                  {/* Grid lines */}
                  <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
        }}/>
                  
                  {/* Location Pins */}
                  {RENTAL_LOCATIONS.map((location, index) => {
            const isSelected = selectedLocation?.name === location.name;
            const isHovered = hoveredLocation?.name === location.name;
            const x = ((location.lng - 126.8) / 0.3) * 100;
            const y = ((37.7 - location.lat) / 0.3) * 100;
            return (<div key={index} className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200" style={{ left: `${x}%`, top: `${y}%` }} onClick={() => handleLocationClick(location)} onMouseEnter={() => setHoveredLocation(location)} onMouseLeave={() => setHoveredLocation(null)}>
                        <div className={`relative ${isSelected ? 'scale-125' : isHovered ? 'scale-110' : ''}`}>
                          <MapPin className={`w-10 h-10 ${isSelected ? 'text-indigo-600' : 'text-red-500'} drop-shadow-lg`} fill={isSelected ? '#4f46e5' : '#ef4444'}/>
                          {(isHovered || isSelected) && (<div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10 border border-gray-200">
                              <p className="text-gray-900">{location.name}</p>
                            </div>)}
                        </div>
                      </div>);
        })}
                </div>
                
                {/* Map Label */}
                <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md">
                  <p className="text-gray-600">서울 지역</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-gray-900 mb-4">지점 목록</h3>
              <div className="space-y-3">
                {RENTAL_LOCATIONS.map((location, index) => {
            const isSelected = selectedLocation?.name === location.name;
            return (<button key={index} onClick={() => handleLocationClick(location)} onMouseEnter={() => setHoveredLocation(location)} onMouseLeave={() => setHoveredLocation(null)} className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}>
                      <div className="flex items-start gap-3">
                        <MapPin className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}/>
                        <div>
                          <p className={`${isSelected ? 'text-indigo-600' : 'text-gray-900'}`}>
                            {location.name}
                          </p>
                          <p className="text-gray-500 mt-1">
                            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </button>);
        })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle List Popup */}
      {showVehiclePopup && selectedLocation && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Popup Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-gray-900 mb-1">{selectedLocation.name} - 차량 목록</h2>
                <p className="text-gray-600">이용 가능한 차량 ({VEHICLES.filter(v => v.available).length}대)</p>
              </div>
              <button onClick={() => {
                setShowVehiclePopup(false);
                setSelectedVehicle(null);
            }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6"/>
              </button>
            </div>

            {/* Vehicle Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VEHICLES.map((vehicle) => {
                const isSelected = selectedVehicle?.id === vehicle.id;
                const price = calculatePrice(vehicle);
                return (<div key={vehicle.id} className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${vehicle.available
                        ? isSelected
                            ? 'border-indigo-600 shadow-lg'
                            : 'border-gray-200 hover:border-indigo-300 hover:shadow-md cursor-pointer'
                        : 'border-gray-200 opacity-60'}`} onClick={() => vehicle.available && setSelectedVehicle(vehicle)}>
                      {/* Vehicle Image */}
                      <div className="relative h-40 bg-gray-200">
                        <ImageWithFallback src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover"/>
                        {!vehicle.available && (<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white px-3 py-1 bg-red-600 rounded-lg">대여 중</span>
                          </div>)}
                        {isSelected && (<div className="absolute top-2 right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>)}
                      </div>

                      {/* Vehicle Info */}
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="text-gray-900 mb-1">{vehicle.name}</h3>
                          <p className="text-gray-600">{vehicle.type}</p>
                        </div>

                        {/* Specifications */}
                        <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-200">
                          <div className="flex flex-col items-center">
                            <Users className="w-4 h-4 text-gray-400 mb-1"/>
                            <span className="text-gray-600">{vehicle.seats}인승</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <Fuel className="w-4 h-4 text-gray-400 mb-1"/>
                            <span className="text-gray-600">{vehicle.fuel}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <Settings className="w-4 h-4 text-gray-400 mb-1"/>
                            <span className="text-gray-600">{vehicle.transmission}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-gray-600">총 금액</p>
                            <p className="text-indigo-600">
                              <span className="text-gray-900">{price.toLocaleString()}</span>원
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500">
                              {rentalPeriod && rentalPeriod.hours >= 24
                        ? `${vehicle.pricePerDay.toLocaleString()}원/일`
                        : `${vehicle.pricePerHour.toLocaleString()}원/시간`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>);
            })}
              </div>
            </div>

            {/* Popup Footer - Reservation Button */}
            {selectedVehicle && (<div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">선택한 차량</p>
                    <p className="text-gray-900">{selectedVehicle.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-gray-600">총 금액</p>
                      <p className="text-indigo-600">
                        {calculatePrice(selectedVehicle).toLocaleString()}원
                      </p>
                    </div>
                    <button onClick={handleReservation} className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                      예약하기
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>)}
    </div>);
}
