'use client'

import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { ArrowUpRight, Globe, Zap, Mail, Briefcase, User as UserIcon } from '@/lib/icons'
import { formatDate, profileTypeLabel } from '@/lib/site'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
  createdAt: Date | string
}

interface PortfolioData {
  title: string
  description: string
  template: string
  slug: string
  createdAt: Date | string
  user: {
    name: string
    email: string
    profile: {
      type: string
      bio: string
      avatarUrl: string
    } | null
  }
  projects: Project[]
}

interface TemplateProps {
  portfolio: PortfolioData
}

// ----------------------------------------------------
// 1. MINIMAL TEMPLATE (Warm beige, clean borders, airy)
// ----------------------------------------------------
export function MinimalTemplate({ portfolio }: TemplateProps) {
  const profile = portfolio.user.profile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#2c2b29] selection:bg-[#EAE6DF] font-sans antialiased">
      <header className="border-b border-[#EAE6DF] bg-[#FAF9F5]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-xl font-medium tracking-tight hover:opacity-80 transition">
            {portfolio.user.name}
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-[#6e6c64]">
            <Link href={`mailto:${portfolio.user.email}`} className="hover:text-black transition">
              Contact
            </Link>
            <Link href="/register" className="rounded-full border border-black bg-black px-4 py-1.5 text-xs text-white hover:bg-neutral-800 transition">
              Create Yours
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-20"
        >
          {/* Hero Profile Section */}
          <motion.section variants={itemVariants} className="grid gap-10 lg:grid-cols-[1.5fr_1fr] items-start border-b border-[#EAE6DF] pb-16">
            <div className="space-y-6">
              <span className="inline-block rounded-full bg-[#EAE6DF] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#6e6c64]">
                {profile ? profileTypeLabel(profile.type) : 'Portfolio'}
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-[1.1] text-black">
                {portfolio.title}
              </h1>
              <p className="text-lg leading-relaxed text-[#5c5a52] max-w-2xl font-light">
                {portfolio.description || 'Curated designer & developer creations.'}
              </p>
            </div>

            <div className="rounded-3xl border border-[#EAE6DF] bg-white p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl text-black">About</h3>
              <p className="text-sm leading-relaxed text-[#6e6c64] font-light">
                {profile?.bio || 'No detailed biography provided.'}
              </p>
              <div className="pt-4 border-t border-[#FAF9F5] text-xs text-[#9d9a92] space-y-1">
                <p>Published: {formatDate(portfolio.createdAt)}</p>
                <p>Location: Remote / Worldwide</p>
              </div>
            </div>
          </motion.section>

          {/* Projects Section */}
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="flex items-baseline justify-between border-b border-[#EAE6DF] pb-4">
              <h2 className="font-serif text-2xl text-black">Selected Work</h2>
              <span className="text-xs text-[#9d9a92] font-mono">{portfolio.projects.length} Entries</span>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.projects.length > 0 ? (
                portfolio.projects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="group flex flex-col justify-between rounded-2xl border border-[#EAE6DF] bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#fcfcfa] to-[#EAE6DF] flex items-center justify-center p-4 border-b border-[#FAF9F5] relative overflow-hidden">
                      <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition duration-300" />
                      <Briefcase size={28} className="text-[#a8a49f] group-hover:scale-110 transition duration-300" />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif text-lg text-black group-hover:text-neutral-700 transition">{project.title}</h4>
                        {project.link ? (
                          <Link href={project.link} target="_blank" className="text-[#6e6c64] hover:text-black transition">
                            <ArrowUpRight size={16} />
                          </Link>
                        ) : null}
                      </div>
                      <p className="text-xs leading-relaxed text-[#6e6c64] font-light line-clamp-3">
                        {project.description || 'Minimalist project showcase.'}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full border border-dashed border-[#EAE6DF] rounded-2xl p-12 text-center text-sm text-[#9d9a92]">
                  This portfolio has no showcase projects listed yet.
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      </main>

      <footer className="border-t border-[#EAE6DF] py-12 text-center text-xs text-[#9d9a92]">
        <p>© {new Date().getFullYear()} {portfolio.user.name}. Powered by PortfolioForge.</p>
      </footer>
    </div>
  )
}

// ----------------------------------------------------
// 2. AURORA TEMPLATE (Glassmorphic cyber gradient dark mode)
// ----------------------------------------------------
export function AuroraTemplate({ portfolio }: TemplateProps) {
  const profile = portfolio.user.profile

  return (
    <div className="min-h-screen bg-[#07050e] text-[#b4b0c2] selection:bg-[#4d3b84]/50 selection:text-white font-sans relative overflow-hidden">
      {/* Animated glowing neon background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7c4fe0]/20 blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#e8673a]/15 blur-[140px] pointer-events-none animate-pulse duration-[12s]" />

      <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c4fe0] to-[#e8673a] shadow-[0_0_15px_rgba(124,79,224,0.4)]">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-semibold text-white tracking-wide group-hover:text-[#7c4fe0] transition-colors">{portfolio.user.name}</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`mailto:${portfolio.user.email}`} className="text-sm font-medium hover:text-white transition">
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <Mail size={12} /> Contact
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 lg:py-20 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Main Card with Glassmorphic Gradient Border */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 lg:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#7c4fe0]/30 to-[#e8673a]/30 blur-2xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Globe size={12} className="animate-spin duration-[10s]" />
              ONLINE SHOWCASE
            </div>

            <h1 className="mt-8 text-4xl sm:text-6xl font-bold leading-tight text-white tracking-tight">
              {portfolio.title}
            </h1>
            
            <p className="mt-6 text-base leading-relaxed text-[#b4b0c2]/80 max-w-2xl font-light">
              {portfolio.description || 'Welcome to my creative space built on state-of-the-art tech.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-mono text-[#7c4fe0] shadow-sm">
                Template: AURORA
              </span>
              {profile ? (
                <span className="rounded-md bg-[#7c4fe0]/10 border border-[#7c4fe0]/30 px-2.5 py-1 text-xs text-white">
                  Type: {profileTypeLabel(profile.type)}
                </span>
              ) : null}
            </div>
          </motion.div>

          {/* About / Bio Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {profile?.avatarUrl ? (
                  <div
                    role="img"
                    aria-label="Avatar"
                    className="h-12 w-12 rounded-2xl border border-white/15 bg-center bg-cover"
                    style={{ backgroundImage: `url("${profile.avatarUrl}")` }}
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c4fe0] to-[#e8673a] text-white">
                    <UserIcon size={18} />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-white">{portfolio.user.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-[#7c4fe0] font-mono">Creative Mind</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5">
                <p className="text-xs font-semibold tracking-wider text-white/50 uppercase font-mono mb-2">Biography</p>
                <p className="text-sm leading-relaxed text-[#b4b0c2]/90 font-light">
                  {profile?.bio || 'Passionate builder crafting elegant digital experiences.'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-xs font-mono flex items-center justify-between text-white/40">
              <span>ACTIVE STATUS</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>
          </motion.div>
        </div>

        {/* Featured Projects Grid */}
        <section className="mt-16 space-y-8">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">FEATURED LABS</h2>
              <p className="text-xs text-white/40 uppercase tracking-widest font-mono mt-1">Experimental work and projects</p>
            </div>
            <span className="text-sm font-mono text-[#7c4fe0]">{portfolio.projects.length} Nodes</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.projects.length > 0 ? (
              portfolio.projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden hover:border-white/15 hover:bg-white/[0.03] transition-all duration-300 relative group shadow-lg"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#120a2a] to-[#251554]/50 flex items-center justify-center relative overflow-hidden border-b border-white/5">
                    {/* Visual glowing aura behind logo on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7c4fe0]/10 to-[#e8673a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Briefcase size={32} className="text-white/20 group-hover:text-white/60 group-hover:scale-110 transition duration-300" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-semibold text-white group-hover:text-[#7c4fe0] transition-colors">{project.title}</h4>
                      {project.link ? (
                        <Link href={project.link} target="_blank" className="rounded-full border border-white/10 bg-white/5 p-1.5 text-white/60 hover:text-white hover:border-white/25 transition">
                          <ArrowUpRight size={14} />
                        </Link>
                      ) : null}
                    </div>
                    <p className="text-xs leading-relaxed text-[#b4b0c2]/70 font-light line-clamp-3">
                      {project.description || 'Cyberpunk structural portfolio project.'}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full border border-dashed border-white/10 rounded-2xl py-16 text-center text-sm font-mono text-white/40">
                No active project interfaces deployed.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center text-xs font-mono text-white/30 relative z-10">
        <p>© {new Date().getFullYear()} {portfolio.user.name}. Aurora Grid Interface.</p>
      </footer>
    </div>
  )
}

// ----------------------------------------------------
// 3. MIDNIGHT TEMPLATE (Dark noir mode with neon cyan highlights)
// ----------------------------------------------------
export function MidnightTemplate({ portfolio }: TemplateProps) {
  const profile = portfolio.user.profile

  return (
    <div className="min-h-screen bg-[#070709] text-[#e3e3e3] selection:bg-[#00f2fe]/20 selection:text-white font-mono antialiased relative">
      {/* Structural layout lines */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-5">
        <div className="border-r border-cyan-500 h-full" />
        <div className="border-r border-cyan-500 h-full" />
        <div className="border-r border-cyan-500 h-full" />
        <div className="h-full" />
      </div>

      <header className="border-b border-[#1b1c22] bg-[#070709]/90 sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-bold text-white hover:text-[#00f2fe] transition flex items-center gap-2">
            <span className="inline-block h-2 w-2 bg-[#00f2fe] rounded-full animate-ping" />
            SYS://{portfolio.user.name.toUpperCase().replace(/\s+/g, '_')}
          </Link>
          <Link href={`mailto:${portfolio.user.email}`} className="text-xs hover:text-white text-[#00f2fe] transition uppercase tracking-widest font-semibold border-b border-[#00f2fe] pb-0.5">
            CONNECT
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 lg:py-20 relative z-10">
        {/* Neon Warning Box / Intro */}
        <div className="border border-[#1b1c22] rounded-xl bg-[#0b0c10] p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-400 to-[#00f2fe]" />
          
          <div className="flex justify-between items-center text-[10px] text-cyan-400">
            <span>INDEX.SYS // LOADED</span>
            <span>SECURE SHELL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-none">
            {portfolio.title}
          </h1>

          <p className="text-sm leading-relaxed text-[#a0a2ad]">
            &gt; {portfolio.description || 'Welcome to my system interface. Run standard operations below.'}
          </p>

          <div className="pt-4 border-t border-[#1b1c22] flex flex-wrap gap-4 text-xs">
            <span>ROLE: <span className="text-[#00f2fe]">{profile ? profile.type.toUpperCase() : 'UNKNOWN'}</span></span>
            <span>BUILD: {formatDate(portfolio.createdAt)}</span>
          </div>
        </div>

        {/* Bio Panel */}
        <section className="mt-8 grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div className="border border-[#1b1c22] rounded-xl bg-[#090a0e] p-6 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase text-[#00f2fe]">ROOT_LOG // BIOGRAPHY</h3>
            <p className="text-xs leading-relaxed text-[#9294a0]">
              {profile?.bio || 'Biography parameters not currently initialised.'}
            </p>
          </div>
          <div className="border border-[#1b1c22] rounded-xl bg-[#090a0e] p-6 flex flex-col justify-between text-xs space-y-4">
            <div className="space-y-1 text-[#9294a0]">
              <p>USER: {portfolio.user.name}</p>
              <p>HOST: localhost:3000</p>
              <p>STATUS: OPERATIONAL</p>
            </div>
            <Link href="/register" className="block text-center border border-white/20 py-2.5 rounded-lg hover:border-[#00f2fe] hover:text-white transition uppercase text-[10px] font-bold text-white/60">
              Generate Portfolio
            </Link>
          </div>
        </section>

        {/* Project Section */}
        <section className="mt-12 space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="h-1.5 w-4 bg-[#00f2fe]" /> SHOWCASE_FILES
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.projects.length > 0 ? (
              portfolio.projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  whileHover={{ borderColor: '#00f2fe', scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="border border-[#1b1c22] rounded-xl bg-[#090a0e] overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-[9px] text-[#555] font-semibold">FILE_0{idx+1}</span>
                      {project.link ? (
                        <Link href={project.link} target="_blank" className="text-[#00f2fe] hover:underline text-[10px]">
                          [LAUNCH]
                        </Link>
                      ) : null}
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-[#00f2fe] transition">{project.title}</h4>
                    <p className="text-xs leading-relaxed text-[#9294a0] line-clamp-3">
                      {project.description || 'System records found for project parameters.'}
                    </p>
                  </div>
                  <div className="border-t border-[#1b1c22] px-6 py-3 bg-[#0b0c10] text-[9px] text-[#555] flex justify-between">
                    <span>TYPE: DATA_FILE</span>
                    <span>SIZE: 14KB</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full border border-dashed border-[#1b1c22] rounded-xl py-12 text-center text-xs text-[#555]">
                No operational project registries loaded.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1b1c22] py-8 text-center text-[10px] text-[#444] mt-16">
        <p>CONSOLE_V1.1_ALL_RIGHTS_RESERVED</p>
      </footer>
    </div>
  )
}

// ----------------------------------------------------
// 4. EDITORIAL TEMPLATE (Magazine style serif high contrast)
// ----------------------------------------------------
export function EditorialTemplate({ portfolio }: TemplateProps) {
  const profile = portfolio.user.profile

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#1c1c1c] font-serif antialiased selection:bg-neutral-800 selection:text-white">
      <header className="border-b-2 border-[#1c1c1c] mx-auto max-w-5xl px-6 py-6 flex items-baseline justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight uppercase">
          {portfolio.user.name}
        </Link>
        <span className="text-xs uppercase tracking-widest font-sans font-semibold">
          Issue No. {new Date().getDate() + 12}
        </span>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 space-y-16">
        {/* Magazine Masthead / Title Grid */}
        <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr] border-b border-[#1c1c1c] pb-12">
          <div className="space-y-6">
            <span className="font-sans text-xs uppercase tracking-widest text-[#e8673a] font-bold">
              {profile ? profileTypeLabel(profile.type) : 'Featured Edition'}
            </span>
            <h1 className="text-5xl sm:text-7xl font-bold leading-[0.95] text-[#1c1c1c] tracking-tighter">
              {portfolio.title}
            </h1>
            <p className="text-lg leading-relaxed text-[#444] font-normal pt-4 font-sans">
              {portfolio.description || 'An elegant publication of hand-selected professional milestones.'}
            </p>
          </div>

          <div className="border-l border-[#1c1c1c] pl-8 space-y-6 flex flex-col justify-between font-sans">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest font-bold text-neutral-500">Biographical Abstract</p>
              <p className="text-sm leading-relaxed text-[#333] font-light">
                {profile?.bio || 'Biography section currently in production. Details will be populated shortly.'}
              </p>
            </div>
            <div className="pt-6 border-t border-[#d8d7d3] text-xs text-[#777] flex items-center justify-between">
              <span>DATE: {formatDate(portfolio.createdAt)}</span>
              <Link href={`mailto:${portfolio.user.email}`} className="font-semibold underline hover:text-[#e8673a] transition">
                Email Owner
              </Link>
            </div>
          </div>
        </section>

        {/* Selected Works Editorial Columns */}
        <section className="space-y-8">
          <div className="border-b-2 border-[#1c1c1c] pb-3 flex justify-between items-baseline font-sans">
            <h2 className="text-sm uppercase tracking-widest font-bold">Selected Portfolios</h2>
            <span className="text-xs text-neutral-500 uppercase">{portfolio.projects.length} Works catalogued</span>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.projects.length > 0 ? (
              portfolio.projects.map((project, idx) => (
                <div key={project.id} className="space-y-4 group">
                  <div className="aspect-[4/3] bg-neutral-200 border border-[#1c1c1c] flex items-center justify-center p-4 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-300">
                    <span className="font-serif text-5xl font-black text-white select-none opacity-80 group-hover:scale-105 transition-transform duration-300">{idx+1}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xl font-bold tracking-tight text-[#1c1c1c]">{project.title}</h4>
                      {project.link ? (
                        <Link href={project.link} target="_blank" className="text-[#1c1c1c] hover:text-[#e8673a] transition">
                          <ArrowUpRight size={18} />
                        </Link>
                      ) : null}
                    </div>
                    <p className="text-sm leading-relaxed text-[#444] font-sans font-light line-clamp-4">
                      {project.description || 'No descriptive excerpt provided for this catalogue entry.'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full border-2 border-dashed border-[#1c1c1c] rounded-lg py-16 text-center text-sm font-sans text-neutral-500">
                This edition has no entries at the current time.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1c1c1c] py-12 text-center text-xs font-sans tracking-widest text-[#777] uppercase">
        <p>© {new Date().getFullYear()} {portfolio.user.name}. Editorial Publication. All rights reserved.</p>
      </footer>
    </div>
  )
}

// ----------------------------------------------------
// 5. SPLIT TEMPLATE (Split-screen interactive layout)
// ----------------------------------------------------
export function SplitTemplate({ portfolio }: TemplateProps) {
  const profile = portfolio.user.profile

  return (
    <div className="min-h-screen bg-white text-[#222] font-sans antialiased selection:bg-neutral-900 selection:text-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left column - Fixed Profile Panel */}
        <section className="lg:h-screen lg:sticky lg:top-0 bg-[#e8673a] text-white p-8 lg:p-16 flex flex-col justify-between space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <Link href="/" className="font-bold tracking-tight text-xl">
              {portfolio.user.name}
            </Link>
            <span className="text-xs uppercase tracking-widest opacity-80 font-mono">
              SPLIT_UI // V1
            </span>
          </div>

          {/* Hero details */}
          <div className="space-y-6 my-auto">
            <span className="inline-block rounded-full bg-white/20 border border-white/30 px-3.5 py-1 text-xs tracking-wider uppercase font-semibold">
              {profile ? profileTypeLabel(profile.type) : 'Professional'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {portfolio.title}
            </h1>
            <p className="text-lg leading-relaxed text-white/90 font-light max-w-md">
              {portfolio.description || 'Welcome to my space. View selected projects in the scrolling directory.'}
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link href={`mailto:${portfolio.user.email}`}>
                <span className="inline-flex items-center gap-2 rounded-xl bg-white text-[#e8673a] px-5 py-2.5 text-sm font-semibold hover:bg-neutral-100 transition shadow-sm">
                  <Mail size={14} /> Send Email
                </span>
              </Link>
              <Link href="/register">
                <span className="inline-flex items-center gap-2 rounded-xl bg-black/20 border border-white/35 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 transition">
                  Create Yours
                </span>
              </Link>
            </div>
          </div>

          {/* Bio block */}
          <div className="rounded-2xl bg-black/15 p-6 space-y-3 border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 font-mono">Abstract Biography</h3>
            <p className="text-sm leading-relaxed text-white/90 font-light">
              {profile?.bio || 'Biography parameters will be updated during the next operational refresh.'}
            </p>
          </div>
        </section>

        {/* Right column - Scrolling Projects list */}
        <section className="p-8 lg:p-16 space-y-12 bg-neutral-50 overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-800">Featured Directory</h2>
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mt-1">
              Scroll to explore selected project cards
            </p>
          </div>

          <div className="grid gap-6">
            {portfolio.projects.length > 0 ? (
              portfolio.projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col justify-between hover:border-neutral-350 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 rounded-bl-2xl bg-neutral-50 border-l border-b border-neutral-150 px-3 py-1.5 text-xs text-neutral-400 font-mono">
                    #{idx+1}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight text-neutral-800 group-hover:text-[#e8673a] transition-colors">{project.title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-600 font-light pr-8">
                      {project.description || 'Full descriptions are hosted within private build files.'}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Project Workspace</span>
                    {project.link ? (
                      <Link href={project.link} target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-[#e8673a] hover:underline">
                        Launch Project <ArrowUpRight size={14} />
                      </Link>
                    ) : null}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="border border-dashed border-neutral-300 rounded-2xl py-20 text-center text-sm text-neutral-400">
                The folder is empty. No files registered.
              </div>
            )}
          </div>

          <footer className="text-center text-xs text-neutral-400 pt-8">
            <p>© {new Date().getFullYear()} {portfolio.user.name}. Interactive Directory Interface.</p>
          </footer>
        </section>
      </div>
    </div>
  )
}
