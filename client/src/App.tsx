import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import { Toaster } from "sonner";

const Auth = lazy(() => import("./pages/auth/Auth"));
const Home = lazy(() => import("./pages/Home"));
const Conference = lazy(() => import("./pages/webrtc/conference/conference"));
const JoinConference = lazy(() => import("./pages/webrtc/join-conference/JoinConference"));
const WaitingArea = lazy(() => import("./pages/webrtc/waiting-area/WaitingArea"));

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />

                    <Route path="/webrtc">
                        <Route path="conference/:id" element={<Conference />} />
                        <Route path="join-conference" element={<JoinConference />} />
                        <Route path="waiting-area/:id" element={<WaitingArea />} />
                    </Route>
                </Routes>
                <Toaster position="bottom-right" closeButton richColors />
            </>
        </Suspense>
    );
}

export default App;