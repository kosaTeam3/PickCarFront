import {BarChart3, Car, DollarSign, TrendingUp} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const monthlyRentalData = [
    {month: '7월', count: 145},
    {month: '8월', count: 168},
    {month: '9월', count: 152},
    {month: '10월', count: 178},
    {month: '11월', count: 165},
    {month: '12월', count: 192},
];

const revenueData = [
    {month: '7월', revenue: 42500000},
    {month: '8월', revenue: 48200000},
    {month: '9월', revenue: 45100000},
    {month: '10월', revenue: 51800000},
    {month: '11월', revenue: 49300000},
    {month: '12월', revenue: 55600000},
];

export function Statistics() {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-gray-900 mb-2">통계</h1>
                <p className="text-gray-500">렌터카 운영 통계를 확인합니다</p>
            </div>

            {/* 주요 지표 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Car className="w-6 h-6 text-blue-600"/>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4"/>
                            <span>+12%</span>
                        </div>
                    </div>
                    <div className="text-gray-500 mb-1">이번 달 대여</div>
                    <div className="text-gray-900">192건</div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600"/>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4"/>
                            <span>+8%</span>
                        </div>
                    </div>
                    <div className="text-gray-500 mb-1">이번 달 매출</div>
                    <div className="text-gray-900">₩55,600,000</div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Car className="w-6 h-6 text-purple-600"/>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4"/>
                            <span>+5%</span>
                        </div>
                    </div>
                    <div className="text-gray-500 mb-1">평균 이용률</div>
                    <div className="text-gray-900">78%</div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-orange-600"/>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4"/>
                            <span>+15%</span>
                        </div>
                    </div>
                    <div className="text-gray-500 mb-1">신규 회원</div>
                    <div className="text-gray-900">48명</div>
                </div>
            </div>

            {/* 차트 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 월별 대여 건수 */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-gray-900 mb-4">월별 대여 건수</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyRentalData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="month"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="count" name="대여 건수" fill="#3b82f6"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 월별 매출 */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-gray-900 mb-4">월별 매출</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="month"/>
                            <YAxis/>
                            <Tooltip
                                formatter={(value) => `₩${value.toLocaleString()}`}
                            />
                            <Legend/>
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                name="매출"
                                stroke="#10b981"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 인기 차종 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
                <h2 className="text-gray-900 mb-4">인기 차종 TOP 5</h2>
                <div className="space-y-4">
                    {[
                        {model: '현대 아반떼', count: 45, percentage: 23},
                        {model: '기아 스포티지', count: 38, percentage: 20},
                        {model: '현대 쏘나타', count: 32, percentage: 17},
                        {model: '기아 K5', count: 28, percentage: 15},
                        {model: '제네시스 G80', count: 22, percentage: 11},
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-8 text-gray-500">{index + 1}</div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-gray-900">{item.model}</span>
                                    <span className="text-gray-600">{item.count}건</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{width: `${item.percentage}%`}}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
