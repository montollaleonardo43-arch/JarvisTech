import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from '../ui/WhatsAppButton'

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a120b] via-[#050604] to-[#020403]" />
        <div className="absolute top-[-10%] left-[-5%] w-[45rem] h-[45rem] rounded-full bg-green-600/25 blur-[130px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-emerald-600/20 blur-[130px]" />
        <div className="absolute bottom-[-5%] left-[20%] w-[42rem] h-[42rem] rounded-full bg-teal-500/20 blur-[130px]" />
      </div>
      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
