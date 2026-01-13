import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Menu, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { docsV2 } from '../data/docsV2';
import { docsV1 } from '../data/docsV1';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SEO from '../components/SEO';

export default function Docs() {
  const { version = 'v2', category = 'getting-started', section = 'overview' } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([category]);

  const docs = version === 'v1' ? docsV1 : docsV2;

  const currentCategory = docs.find(c => c.slug === category);
  const currentSection = currentCategory?.sections.find(s => s.id === section);

  // Page title
  const pageTitle = currentSection
    ? `${currentSection.title} - typescript-move ${version.toUpperCase()} Docs`
    : 'typescript-move Documentation';

  // Auto-expand current category
  useEffect(() => {
    if (category && !expandedCategories.includes(category)) {
      setExpandedCategories(prev => [...prev, category]);
    }
  }, [category]);

  // Find prev/next sections
  const allSections = docs.flatMap(cat =>
    cat.sections.map(sec => ({ categorySlug: cat.slug, section: sec }))
  );
  const currentIndex = allSections.findIndex(
    item => item.categorySlug === category && item.section.id === section
  );
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const switchVersion = (newVersion: string) => {
    // V2 için getting-started/overview, V1 için introduction/overview
    const defaultRoute = newVersion === 'v2'
      ? '/docs/v2/getting-started/overview'
      : '/docs/v1/introduction/overview';
    navigate(defaultRoute);
  };

  return (
    <>
      <SEO title={pageTitle} />
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-white text-black rounded border-2 border-black flex items-center justify-center"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-16 left-0 h-[calc(100vh-64px)] w-72 bg-black border-r-2 border-[#333] overflow-y-auto transition-transform z-40`}
      >
        <div className="p-6">
          {/* Version Switcher */}
          <div className="mb-6 border-2 border-white">
            <button
              onClick={() => switchVersion('v2')}
              className={`w-full px-4 py-2 font-bold text-sm transition-colors ${
                version === 'v2'
                  ? 'bg-white text-black'
                  : 'bg-black text-white hover:bg-[#1a1a1a]'
              }`}
            >
              V2_API [RECOMMENDED]
            </button>
            <button
              onClick={() => switchVersion('v1')}
              className={`w-full px-4 py-2 font-bold text-sm border-t-2 border-white transition-colors ${
                version === 'v1'
                  ? 'bg-white text-black'
                  : 'bg-black text-white hover:bg-[#1a1a1a]'
              }`}
            >
              V1_API [DECORATOR]
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {docs.map(cat => (
              <div key={cat.slug}>
                <button
                  onClick={() => toggleCategory(cat.slug)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left font-bold text-sm hover:bg-[#1a1a1a] transition-colors"
                >
                  <span>{cat.title.toUpperCase()}</span>
                  {expandedCategories.includes(cat.slug) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedCategories.includes(cat.slug) && (
                  <div className="ml-4 space-y-1 border-l border-[#333]">
                    {cat.sections.map(sec => (
                      <Link
                        key={sec.id}
                        to={`/docs/${version}/${cat.slug}/${sec.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-1.5 text-sm transition-colors ${
                          category === cat.slug && section === sec.id
                            ? 'text-[#00ff00] border-l-2 border-[#00ff00]'
                            : 'text-[#888] hover:text-white'
                        }`}
                      >
                        {sec.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 max-w-4xl">
        {currentSection ? (
          <>
            {/* Content */}
            <article className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }: { children?: React.ReactNode }) => (
                    <h1 className="text-4xl font-bold mb-6 pb-4 border-b-2 border-[#333]">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }: { children?: React.ReactNode }) => (
                    <h2 className="text-2xl font-bold mt-12 mb-4 border-l-4 border-white pl-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }: { children?: React.ReactNode }) => (
                    <h3 className="text-xl font-bold mt-8 mb-3">{children}</h3>
                  ),
                  p: ({ children }: { children?: React.ReactNode }) => (
                    <p className="text-[#ccc] leading-relaxed mb-4">{children}</p>
                  ),
                  ul: ({ children }: { children?: React.ReactNode }) => (
                    <ul className="list-none space-y-2 mb-4">{children}</ul>
                  ),
                  li: ({ children }: { children?: React.ReactNode }) => (
                    <li className="flex items-start gap-2 text-[#ccc]">
                      <span className="text-[#00ff00] mt-1">▸</span>
                      <span>{children}</span>
                    </li>
                  ),
                  code: ({ inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded border border-[#333] !bg-black"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="px-2 py-1 bg-black border border-[#333] rounded text-[#00ff00] text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  table: ({ children }: { children?: React.ReactNode }) => (
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full border-2 border-white">{children}</table>
                    </div>
                  ),
                  thead: ({ children }: { children?: React.ReactNode }) => (
                    <thead className="bg-white text-black">{children}</thead>
                  ),
                  th: ({ children }: { children?: React.ReactNode }) => (
                    <th className="px-4 py-2 text-left font-bold text-sm border border-white">
                      {children}
                    </th>
                  ),
                  td: ({ children }: { children?: React.ReactNode }) => (
                    <td className="px-4 py-2 text-sm border border-[#333] text-[#ccc]">
                      {children}
                    </td>
                  ),
                  blockquote: ({ children }: { children?: React.ReactNode }) => (
                    <blockquote className="border-l-4 border-[#00ff00] pl-4 py-2 my-4 bg-[#0a0a0a]">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {currentSection.content}
              </ReactMarkdown>
            </article>

            {/* Prev/Next Navigation */}
            <div className="flex items-center justify-between mt-16 pt-8 border-t-2 border-[#333]">
              {prevSection ? (
                <Link
                  to={`/docs/${version}/${prevSection.categorySlug}/${prevSection.section.id}`}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-white hover:bg-white hover:text-black transition-colors font-bold"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-xs text-[#888]">PREVIOUS</div>
                    <div className="text-sm">{prevSection.section.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextSection ? (
                <Link
                  to={`/docs/${version}/${nextSection.categorySlug}/${nextSection.section.id}`}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-white hover:bg-white hover:text-black transition-colors font-bold"
                >
                  <div className="text-right">
                    <div className="text-xs text-[#888]">NEXT</div>
                    <div className="text-sm">{nextSection.section.title}</div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </>
        ) : (
          <div className="text-[#888] text-center py-20">
            <p>Section not found</p>
          </div>
        )}
      </main>
      </div>
    </>
  );
}
