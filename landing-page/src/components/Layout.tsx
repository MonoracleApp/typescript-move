import { Terminal } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-mono">
      {/* Terminal Header */}
      <header className="border-b border-[#333]">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <div className="ml-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00ff00]" />
                <span className="text-sm">~/suijs</span>
              </div>
            </Link>
            <nav className="flex flex-wrap items-center gap-6 text-sm">
              <Link
                to="/docs/v2/getting-started/overview"
                className={`transition-colors ${location.pathname.startsWith('/docs')
                  ? 'text-white'
                  : 'text-[#888] hover:text-white'
                  }`}
              >
                [docs]
              </Link>
              {/* <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#888] hover:text-white transition-colors flex items-center gap-1"
              >
                [github]
              </a> */}
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00ff00]" />
              <span>SUIJS_v2.0</span>
            </div>
            <div className="text-[#888]">
              TypeScript {'→'} Sui Move Transpiler
            </div>
            <div className="text-[#888]">
              MIT_LICENSE © 2024
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
