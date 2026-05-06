import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-darkBg text-slate-200 font-sans flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <TopBar />
        <main className="flex-1 p-8 overflow-y-auto relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
