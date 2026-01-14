export const mockEmployees = [
  {
    id: "1",
    name: "김민수",
    phone: "010-1111-2222",
    position: "지점장",
    hireDate: "2020-01-15",
    userId: "kim.minsu",
    branchId: "1",
  },
  {
    id: "2",
    name: "이영희",
    phone: "010-2222-3333",
    position: "지점장",
    hireDate: "2019-05-20",
    userId: "lee.younghee",
    branchId: "2",
  },
  {
    id: "3",
    name: "박철수",
    phone: "010-3333-4444",
    position: "지점장",
    hireDate: "2021-03-10",
    userId: "park.chulsoo",
    branchId: "3",
  },
  {
    id: "4",
    name: "최지원",
    phone: "010-4444-5555",
    position: "영업사원",
    hireDate: "2022-07-01",
    userId: "choi.jiwon",
    branchId: "1",
  },
  {
    id: "5",
    name: "정수현",
    phone: "010-5555-6666",
    position: "정비사",
    hireDate: "2021-11-15",
    userId: "jung.soohyun",
    branchId: "1",
  },
  {
    id: "6",
    name: "한미래",
    phone: "010-6666-7777",
    position: "영업사원",
    hireDate: "2023-02-10",
    userId: "han.mirae",
    branchId: "2",
  },
  {
    id: "7",
    name: "서준호",
    phone: "010-7777-8888",
    position: "관리직",
    hireDate: "2020-09-01",
    userId: "seo.junho",
    branchId: "3",
  },
];

export const mockBranches = [
  {
    id: "1",
    name: "강남지점",
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    managerId: "1",
    employeeCount: 3,
    vehicleCount: 25,
  },
  {
    id: "2",
    name: "송파지점",
    address: "서울특별시 송파구 올림픽로 456",
    phone: "02-2345-6789",
    managerId: "2",
    employeeCount: 1,
    vehicleCount: 20,
  },
  {
    id: "3",
    name: "성남지점",
    address: "경기도 성남시 분당구 판교역로 789",
    phone: "031-3456-7890",
    managerId: "3",
    employeeCount: 1,
    vehicleCount: 18,
  },
];

export const branchNames = Object.fromEntries(
  mockBranches.map((b) => [b.id, b.name])
);
