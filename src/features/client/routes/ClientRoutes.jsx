import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { LoginScreen, SignupEmailStep, SignupLicenseStep, SignupPersonalStep } from "@/features/client/auth";
import { MainMenu } from "@/features/client/menu";
import { RentMapView, RentTimeSelection } from "@/features/client/rental";
import { MyPage } from "@/features/client/account";
import { AccidentReport } from "@/features/client/accident";

const ClientSessionContext = createContext(null);

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage 못 쓰는 환경이면 그냥 무시
  }
}

export function useClientSession() {
  const ctx = useContext(ClientSessionContext);
  if (!ctx) throw new Error("useClientSession must be used within <ClientRoot />");
  return ctx;
}

export function ClientRoot() {
  const [user, setUser] = useState(() => readJson("client_user", null));
  const [activeRental, setActiveRental] = useState(() => readJson("client_active_rental", null));

  const [signup, setSignup] = useState({
    email: "",
    name: "",
    residentNumber: "",
    licenseName: "",
    licenseNumber: "",
    licenseIssuer: "",
    licenseIssueDate: "",
  });

  const [rent, setRent] = useState({ startTime: "", endTime: "" });

  useEffect(() => writeJson("client_user", user), [user]);
  useEffect(() => writeJson("client_active_rental", activeRental), [activeRental]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      activeRental,
      setActiveRental,
      signup,
      setSignup,
      rent,
      setRent,
      logout: () => {
        setUser(null);
        setActiveRental(null);
        setRent({ startTime: "", endTime: "" });
        setSignup({
          email: "",
          name: "",
          residentNumber: "",
          licenseName: "",
          licenseNumber: "",
          licenseIssuer: "",
          licenseIssueDate: "",
        });
      },
    }),
    [user, activeRental, signup, rent]
  );

  return (
    <ClientSessionContext.Provider value={value}>
      <Outlet />
    </ClientSessionContext.Provider>
  );
}

function ClientAuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

function RequireClientAuth({ children }) {
  const { user } = useClientSession();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function ClientEntry() {
  const { user } = useClientSession();

  if (user) return <Navigate to="/menu" replace />;
  return <Navigate to="/login" replace />;
}

export function ClientLogin() {
  const nav = useNavigate();
  const { setUser } = useClientSession();

  return (
    <ClientAuthLayout>
      <LoginScreen
        onSignupClick={() => nav("/signup/email")}
        onLogin={(email, name) => {
          setUser({ email, name });
          nav("/menu");
        }}
      />
    </ClientAuthLayout>
  );
}

export function ClientSignupEmail() {
  const nav = useNavigate();
  const { signup, setSignup } = useClientSession();

  return (
    <ClientAuthLayout>
      <SignupEmailStep
        email={signup.email}
        onNext={(email) => {
          setSignup((prev) => ({ ...prev, email }));
          nav("/signup/personal");
        }}
        onBack={() => nav("/login")}
      />
    </ClientAuthLayout>
  );
}

export function ClientSignupPersonal() {
  const nav = useNavigate();
  const { signup, setSignup } = useClientSession();

  if (!signup.email) return <Navigate to="/signup/email" replace />;

  return (
    <ClientAuthLayout>
      <SignupPersonalStep
        name={signup.name}
        residentNumber={signup.residentNumber}
        onNext={(name, residentNumber) => {
          setSignup((prev) => ({ ...prev, name, residentNumber }));
          nav("/signup/license");
        }}
        onBack={() => nav("/signup/email")}
      />
    </ClientAuthLayout>
  );
}

export function ClientSignupLicense() {
  const nav = useNavigate();
  const { signup, setSignup, setUser } = useClientSession();

  if (!signup.email) return <Navigate to="/signup/email" replace />;
  if (!signup.name || !signup.residentNumber) return <Navigate to="/signup/personal" replace />;

  return (
    <ClientAuthLayout>
      <SignupLicenseStep
        licenseName={signup.licenseName}
        licenseNumber={signup.licenseNumber}
        licenseIssuer={signup.licenseIssuer}
        licenseIssueDate={signup.licenseIssueDate}
        onNext={(licenseName, licenseNumber, licenseIssuer, licenseIssueDate) => {
          setSignup((prev) => ({
            ...prev,
            licenseName,
            licenseNumber,
            licenseIssuer,
            licenseIssueDate,
          }));

          // 데모: 가입 완료되면 바로 로그인 처리
          setUser({ email: signup.email, name: signup.name });

          // 가입 흐름 데이터는 비워줌
          setSignup({
            email: "",
            name: "",
            residentNumber: "",
            licenseName: "",
            licenseNumber: "",
            licenseIssuer: "",
            licenseIssueDate: "",
          });

          nav("/menu");
        }}
        onBack={() => nav("/signup/personal")}
      />
    </ClientAuthLayout>
  );
}

export function ClientMenu() {
  const nav = useNavigate();
  const { user, activeRental, setActiveRental, logout } = useClientSession();

  return (
    <RequireClientAuth>
      <MainMenu
        user={user}
        activeRental={activeRental}
        onRentClick={() => nav("/rent/time")}
        onMyPageClick={() => nav("/mypage")}
        onAccidentReportClick={() => nav("/accident")}
        onReturnVehicle={() => {
          setActiveRental(null);
          alert("차량 반납이 완료되었습니다.");
          nav("/menu");
        }}
        onLogout={() => {
          logout();
          nav("/login");
        }}
      />
    </RequireClientAuth>
  );
}

export function ClientRentTime() {
  const nav = useNavigate();
  const { user, rent, setRent, logout } = useClientSession();

  return (
    <RequireClientAuth>
      <RentTimeSelection
        user={user}
        startTime={rent.startTime}
        endTime={rent.endTime}
        onNext={(startTime, endTime) => {
          setRent({ startTime, endTime });
          nav("/rent/map");
        }}
        onLogout={() => {
          logout();
          nav("/login");
        }}
      />
    </RequireClientAuth>
  );
}

export function ClientRentMap() {
  const nav = useNavigate();
  const { user, rent, setActiveRental, logout } = useClientSession();

  if (!rent.startTime) return <Navigate to="/rent/time" replace />;

  return (
    <RequireClientAuth>
      <RentMapView
        user={user}
        startTime={rent.startTime}
        endTime={rent.endTime}
        onBack={() => nav("/rent/time")}
        onRentalComplete={(rental) => {
          // MainMenu/AccidentReport가 기대하는 모양으로 맞춰줌
          setActiveRental({
            vehicleName: rental.vehicle.name,
            vehicleType: rental.vehicle.type,
            location: rental.location.name,
            startTime: rental.startTime,
            endTime: rental.endTime,
            price: rental.price,
          });
          alert("예약이 완료되었습니다!");
          nav("/menu");
        }}
        onLogout={() => {
          logout();
          nav("/login");
        }}
      />
    </RequireClientAuth>
  );
}

export function ClientMyPage() {
  const nav = useNavigate();
  const { user, logout } = useClientSession();

  return (
    <RequireClientAuth>
      <MyPage
        user={user}
        onBack={() => nav("/menu")}
        onLogout={() => {
          logout();
          nav("/login");
        }}
      />
    </RequireClientAuth>
  );
}

export function ClientAccident() {
  const nav = useNavigate();
  const { user, activeRental, logout } = useClientSession();

  if (!activeRental) return <Navigate to="/menu" replace />;

  return (
    <RequireClientAuth>
      <AccidentReport
        user={user}
        activeRental={activeRental}
        onBack={() => nav("/menu")}
        onLogout={() => {
          logout();
          nav("/login");
        }}
      />
    </RequireClientAuth>
  );
}
