import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Zap,
  GraduationCap,
  Rocket,
  Users,
  BookOpen,
  Package,
  Key,
  Repeat,
  BarChart3,
  Cpu,
  ExternalLink,
  ChevronRight,
  Box,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'ts' | 'move'>('ts');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <SEO title="move-ts - TypeScript to Sui Move Transpiler" />
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-20 right-6 z-50 w-12 h-12 bg-white text-black rounded border-2 border-black flex items-center justify-center"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed top-0 right-0 h-full w-80 bg-[#0f0f0f] border-l-2 border-white z-40 overflow-y-auto"
            >
              <div className="p-6 pt-20">
                <nav className="space-y-4">
                  <Link
                    to="/docs/v2/getting-started/overview"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 border-2 border-white hover:bg-white hover:text-black transition-colors font-bold text-center"
                  >
                    [DOCUMENTATION]
                  </Link>
                  <a
                    href="https://github.com/yourusername/ts-sui-transpiler"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 border-2 border-white hover:bg-white hover:text-black transition-colors font-bold text-center"
                  >
                    [GITHUB]
                  </a>
                </nav>

                {/* Quick Actions */}
                <div className="mt-8 pt-8 border-t-2 border-[#333]">
                  <h3 className="text-sm font-bold mb-4 text-[#888]">QUICK_ACTIONS</h3>
                  <div className="space-y-3">
                    <Link
                      to="/docs/v2/getting-started/overview"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 bg-white text-black font-bold hover:bg-[#ddd] transition-colors text-center"
                    >
                      GET_STARTED →
                    </Link>
                    <Link
                      to="/docs/v2/examples/owned-object"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 border border-white hover:bg-white hover:text-black transition-colors font-bold text-center"
                    >
                      VIEW_EXAMPLES
                    </Link>
                  </div>
                </div>

                {/* Version Info */}
                <div className="mt-8 pt-8 border-t-2 border-[#333]">
                  <div className="flex items-center justify-between text-xs text-[#888]">
                    <span>MOVE-TS_v1.0</span>
                    <span>MIT_LICENSE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="border-b border-[#333]">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <div className="flex items-center gap-2 text-[#00ff00] mb-4">
                <span>$</span>
                <div className="flex items-center gap-2">
                  <span className="animate-pulse">▊</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-5xl md:text-7xl font-bold mb-6 leading-tight">
                TYPESCRIPT {'>'} SUI MOVE
              </h1>
              <p className="text-xl text-[#888] mb-8 max-w-2xl border-l-2 border-[#333] pl-4">
                // Transpile TypeScript syntax to production-ready Sui Move contracts
                <br />
                // No Move experience required. Ship faster.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/docs/v2/getting-started/overview"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold hover:bg-[#ddd] transition-colors border-2 border-white"
              >
                GET_STARTED
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Code Block */}
      <section className="border-b border-[#333] overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <div className="border-2 border-white overflow-hidden">
            {/* Tabs */}
            <div className="flex flex-col md:flex-row border-b-2 border-white">
              <button
                onClick={() => setActiveTab('ts')}
                className={`flex-1 px-6 py-3 font-bold transition-colors ${activeTab === 'ts'
                  ? 'bg-white text-black'
                  : 'bg-black text-white hover:bg-[#1a1a1a]'
                  }`}
              >
                HelloWorld.sui.ts
              </button>
              <button
                onClick={() => setActiveTab('move')}
                className={`flex-1 px-6 py-3 font-bold transition-colors ${activeTab === 'move'
                  ? 'bg-white text-black'
                  : 'bg-black text-white hover:bg-[#1a1a1a]'
                  }`}
              >
                hello-world.MOVE
              </button>
            </div>

            {/* Code Content */}
            <div className="p-6 bg-black min-h-[400px] overflow-x-auto">
              {activeTab === 'ts' ? (
                <pre className="text-sm leading-relaxed overflow-x-auto">
                  <code className="text-[#00ff00] block">
                    {`@Module('hello_world')
class MyContract {

  @Public()
  createPerson(
    name: String,
    age: u64,
    ctx: TxContext
  ) {
    let person = {
      id: SuiObject.createObjectId(ctx),
      name,
      age
    };

    Transfer.transfer<Person>(
      person,
      TxContext.sender(ctx)
    );
  }

  @Public()
  getUser(person: Person) {
    return {
      name: person.name,
      age: person.age
    };
  }
}`}
                  </code>
                </pre>
              ) : (
                <pre className="text-sm leading-relaxed overflow-x-auto">
                  <code className="text-[#00ff00] block">
                    {`module hello_world::mycontract {
  use std::string::String;

  public fun createPerson(
    name: String,
    age: u64,
    ctx: &mut TxContext
  ) {
    let person = Person {
      id: sui::object::new(ctx),
      name,
      age
    };

    sui::transfer::transfer(
      person,
      sui::tx_context::sender(ctx)
    );
  }

  public fun getUser(p: &Person): (String, u64) {
    (p.name, p.age)
  }
}`}
                  </code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-b border-[#333]">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-12 border-l-4 border-white pl-4">
            [FEATURES]
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-white p-6 hover:bg-white hover:text-black transition-colors group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 border-2 border-current">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-bold">{useCase.title}</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  {useCase.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="group-hover:text-black text-[#888] group-hover:font-normal">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-b border-[#333]">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-12 border-l-4 border-white pl-4">
            [CAPABILITIES]
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border border-[#333] p-4 hover:border-white transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  {cap.icon}
                  <h3 className="font-bold text-sm">{cap.title}</h3>
                </div>
                <p className="text-xs text-[#888]">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation */}
      {/* <section className="border-b border-[#333]">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-12 border-l-4 border-white pl-4">
            [QUICK_START]
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-white p-6">
              <div className="flex items-center gap-2 text-[#888] mb-2 text-sm">
                <span>01</span>
                <span>/</span>
                <span>Install</span>
              </div>
              <code className="text-[#00ff00] text-sm">
                $ npm install -g move-ts
              </code>
            </div>

            <div className="border-2 border-white p-6">
              <div className="flex items-center gap-2 text-[#888] mb-2 text-sm">
                <span>02</span>
                <span>/</span>
                <span>Compile</span>
              </div>
              <code className="text-[#00ff00] text-sm">
                $ move-ts --compileV2 contract.sui.ts
              </code>
            </div>

            <div className="border-2 border-white p-6">
              <div className="flex items-center gap-2 text-[#888] mb-2 text-sm">
                <span>03</span>
                <span>/</span>
                <span>Deploy</span>
              </div>
              <code className="text-[#00ff00] text-sm">
                $ sui client publish --gas-budget 100000000
              </code>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section id="docs" className="border-b border-[#333]">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <div className="border-4 border-white p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-base md:text-4xl font-bold mb-6">
              [DOCUMENTATION]
            </h2>
            <p className="text-xl text-[#888] mb-8 max-w-2xl mx-auto">
              Complete guide to building Sui contracts with TypeScript
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/docs/v2/getting-started/overview"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold hover:bg-[#ddd] transition-colors"
              >
                READ_DOCS
                <ExternalLink className="w-5 h-5" />
              </Link>
              {/* <Link
                to="/docs/v2/getting-started/overview"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-colors font-bold"
              >
                VIEW_EXAMPLES
                <Code2 className="w-5 h-5" />
              </Link> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const useCases = [
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: 'LEARN_MOVE',
    points: [
      'Write TypeScript, study Move output',
      'Understand decorator mappings',
      'Grasp ownership model'
    ]
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: 'PROTOTYPE_FAST',
    points: [
      'Test ideas in minutes',
      'No Move expertise needed',
      'Ship hackathon MVPs'
    ]
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'BRIDGE_DEVS',
    points: [
      'Onboard JS/TS developers',
      'Familiar syntax paradigm',
      'Gradual Move transition'
    ]
  }
];

const capabilities = [
  {
    icon: <Box className="w-4 h-4" />,
    title: '@MODULE',
    description: 'Module definition with decorators'
  },
  {
    icon: <Key className="w-4 h-4" />,
    title: 'ABILITIES',
    description: 'Has<> generic type system'
  },
  {
    icon: <Code2 className="w-4 h-4" />,
    title: '@PUBLIC',
    description: 'Entry & view functions'
  },
  {
    icon: <Repeat className="w-4 h-4" />,
    title: 'TRANSFER',
    description: 'Object ownership control'
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    title: 'EVENTS',
    description: 'On-chain event emission'
  },
  {
    icon: <Cpu className="w-4 h-4" />,
    title: 'TYPE_MAP',
    description: 'Auto TS→Move conversion'
  },
  {
    icon: <Zap className="w-4 h-4" />,
    title: 'INSTANT',
    description: 'Fast transpilation'
  },
  {
    icon: <Package className="w-4 h-4" />,
    title: 'STRUCTS',
    description: 'Interface→Struct mapping'
  }
];
