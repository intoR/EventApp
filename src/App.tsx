/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Camera, 
  Car, 
  MessageSquare, 
  Image as ImageIcon, 
  ChevronRight, 
  X, 
  Plus,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { SESSIONS, VENUES } from './constants';
import { SharedStateService } from './services/sharedState';
import { cn, formatTimestamp } from './lib/utils';
import { Session, Greeting, TravelPost, GalleryPhoto } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'greetings' | 'travel' | 'gallery' | 'feedback'>('schedule');
  const [showSelfieModal, setShowSelfieModal] = useState(false);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  return (
    <div className="min-h-screen bg-art-bg selection:bg-art-accent selection:text-white pb-20 md:pb-0">
      {/* Universal Header */}
      <header className="art-header">
        <div className="art-logo">SUTA<br />60</div>
        <div className="art-meta text-right">
          APR 17 — SILICON VALLEY, CA
          <div className="text-[10px] opacity-60 uppercase tracking-widest font-black">60th Anniversary Gala</div>
        </div>
      </header>

      {/* Responsive Dashboard Layout */}
      <div className="hidden md:grid h-[calc(100vh-140px)] gap-0 border-t border-art-ink overflow-hidden md:grid-cols-2 lg:grid-cols-[320px_1fr_300px]">
        {/* Left Column: Schedule */}
        <div className="border-r border-art-ink overflow-y-auto p-6 art-scroll">
          <div className="art-section-title">Daily Itinerary</div>
          <ScheduleTimeline onSelect={setSelectedSession} />
        </div>

        {/* Center: Community Hub */}
        <div className="bg-white overflow-y-auto flex flex-col art-scroll">
          {/* Top Half: Innovation Forum Theme */}
          <div className="border-b border-art-gray p-8 flex flex-col items-center text-center">
            <div className="art-section-title">Innovation Forum</div>
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-art-ink flex items-center justify-center mb-6 bg-art-gray/30">
              <Camera size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black uppercase mb-2 font-display">Honoring Legacy.<br/>Engineering Future.</h2>
            <p className="text-sm opacity-60 mb-8 max-w-xs font-medium">Connect with fellow alumni and share your vision for the next frontier.</p>
            <button onClick={() => setShowSelfieModal(true)} className="art-btn-primary">Send Greeting</button>
          </div>
          
          {/* Bottom Half: Photo Stream */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="art-section-title mb-0">Live Event Feed</div>
              <button 
                onClick={() => setActiveTab('gallery')} 
                className="text-[10px] font-bold uppercase underline underline-offset-4"
              >
                View Full Gallery
              </button>
            </div>
            <GreetingsGrid compact />
          </div>

          {/* Logistics Tablet View */}
          <div className="lg:hidden p-8 bg-art-bg border-t border-art-ink">
            <div className="art-section-title">Logistics</div>
            <div className="grid grid-cols-2 gap-8">
               <section>
                <div className="text-[10px] font-black uppercase mb-4 opacity-40 italic">Directions</div>
                <div className="space-y-3">
                  <MiniVenueMap venue={VENUES.MORNING} label="Innovation Forum" />
                  <MiniVenueMap venue={VENUES.AFTERNOON} label="Anniversary Gala" />
                </div>
              </section>
              <section>
                <div className="text-[10px] font-black uppercase mb-4 opacity-40 italic">Travel Board</div>
                <TravelList compact />
                <button onClick={() => setShowTravelModal(true)} className="w-full mt-4 text-[10px] font-black uppercase border-b border-art-ink pb-1 text-left">Post ride request →</button>
              </section>
            </div>
          </div>
        </div>

        {/* Right Column: Desktop Utils */}
        <div className="hidden lg:block border-l border-art-ink overflow-y-auto p-6 bg-art-bg art-scroll">
          <div className="space-y-12">
            <section>
              <div className="art-section-title">Directions</div>
              <div className="space-y-3">
                <MiniVenueMap venue={VENUES.MORNING} label={VENUES.MORNING.name} />
                <MiniVenueMap venue={VENUES.AFTERNOON} label={VENUES.AFTERNOON.name} />
              </div>
            </section>

            <section>
              <div className="art-section-title">Travel Coordination</div>
              <TravelList compact />
              <button onClick={() => setShowTravelModal(true)} className="w-full mt-4 text-[10px] font-black uppercase border-b border-art-ink pb-1 text-left">Post ride request →</button>
            </section>

            <section className="bg-art-accent p-6 text-white -mx-6">
              <div className="font-black text-[12px] uppercase mb-1">Instant Feedback</div>
              <p className="text-[11px] opacity-80 mb-4 font-medium italic">How is your conference experience? Let us know.</p>
              <button onClick={() => setActiveTab('feedback')} className="w-full py-2 bg-white/20 text-[10px] font-bold uppercase tracking-widest border border-white/40 hover:bg-white hover:text-art-accent transition-colors">Open Feedback Hub</button>
            </section>
          </div>
        </div>
      </div>

      {/* Mobile Tabbed View */}
      <div className="md:hidden p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'schedule' && <ScheduleView onSelect={setSelectedSession} />}
          {activeTab === 'greetings' && <GreetingsView onAdd={() => setShowSelfieModal(true)} />}
          {activeTab === 'travel' && <TravelView onAdd={() => setShowTravelModal(true)} />}
          {activeTab === 'gallery' && <GalleryView />}
          {activeTab === 'feedback' && <FeedbackView />}
        </AnimatePresence>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t-2 border-art-ink flex items-center justify-around md:hidden px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <MobileNavButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={<Calendar size={22} />} />
        <MobileNavButton active={activeTab === 'greetings'} onClick={() => setActiveTab('greetings')} icon={<Camera size={22} />} />
        <MobileNavButton active={activeTab === 'travel'} onClick={() => setActiveTab('travel')} icon={<Car size={22} />} iconActive={<Car size={22} fill="currentColor" />} />
        <MobileNavButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<ImageIcon size={22} />} />
        <MobileNavButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} icon={<MessageSquare size={22} />} />
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {selectedSession && <SessionDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} />}
        {showSelfieModal && <SelfieModal onClose={() => setShowSelfieModal(false)} />}
        {showTravelModal && <TravelModal onClose={() => setShowTravelModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function MobileNavButton({ active, onClick, icon, iconActive }: { active: boolean, onClick: () => void, icon: React.ReactNode, iconActive?: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2 transition-all duration-200",
        active ? "text-art-accent scale-110" : "text-zinc-400"
      )}
    >
      {active && iconActive ? iconActive : icon}
    </button>
  );
}

function MiniVenueMap({ venue, label }: { venue: typeof VENUES.MORNING, label: string }) {
  return (
    <a href={venue.mapUrl} target="_blank" className="block relative h-28 bg-art-gray border border-art-ink group overflow-hidden">
      <div className="absolute inset-0 bg-zinc-400 mix-blend-multiply opacity-20" />
      <div className="absolute bottom-2 left-2 bg-art-ink text-white text-[10px] px-2 py-1 font-bold group-hover:bg-art-accent transition-colors truncate max-w-[90%]">{label}</div>
    </a>
  );
}

// --- SHARED COMPONENTS ---

function ScheduleTimeline({ onSelect }: { onSelect: (s: Session) => void }) {
  return (
    <div className="space-y-4">
      {SESSIONS.map((session) => (
        <button 
          key={session.id} 
          onClick={() => onSelect(session)}
          className="art-sched-item w-full text-left group transition-all hover:bg-white/60 hover:translate-x-1"
        >
          <div className="text-[12px] font-black">{session.time}</div>
          <div className="text-[18px] font-bold leading-tight font-display py-1">{session.title}</div>
          <div className="flex justify-between items-center">
            <div className="text-[11px] uppercase font-black text-art-accent">{session.location}</div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
      ))}
    </div>
  );
}

function TravelList({ compact }: { compact?: boolean }) {
  const [posts, setPosts] = useState<TravelPost[]>([]);

  useEffect(() => {
    setPosts(SharedStateService.getTravelPosts().slice(0, compact ? 4 : 50));
    const handleUpdate = () => setPosts(SharedStateService.getTravelPosts().slice(0, compact ? 4 : 50));
    window.addEventListener('storage_update', handleUpdate);
    return () => window.removeEventListener('storage_update', handleUpdate);
  }, [compact]);

  return (
    <ul className="space-y-0 text-[13px]">
      {posts.length === 0 && <li className="text-zinc-400 italic py-2">No ride posts yet.</li>}
      {posts.map(post => (
        <li key={post.id} className="flex justify-between items-center py-3 border-b border-art-gray group">
          <div className="flex-1">
            <div className="font-bold">{post.userName} @ {post.time}</div>
            <div className="text-[10px] opacity-60 font-medium">{post.from} → {post.to}</div>
          </div>
          <span className={cn(
            "art-pill",
            post.type === 'offering' ? "bg-green-100 text-green-900" : "bg-blue-100 text-blue-900"
          )}>
            {post.type === 'offering' ? 'Offer' : 'Seek'}
          </span>
        </li>
      ))}
    </ul>
  );
}

function GreetingsGrid({ compact }: { compact?: boolean }) {
  const [greetings, setGreetings] = useState<Greeting[]>([]);

  useEffect(() => {
    setGreetings(SharedStateService.getGreetings().slice(0, compact ? 6 : 100));
    const handleUpdate = () => setGreetings(SharedStateService.getGreetings().slice(0, compact ? 6 : 100));
    window.addEventListener('storage_update', handleUpdate);
    return () => window.removeEventListener('storage_update', handleUpdate);
  }, [compact]);

  return (
    <div className={cn("grid gap-4", compact ? "grid-cols-3" : "grid-cols-1 md:grid-cols-2")}>
      {greetings.length === 0 ? (
        <div className="col-span-full py-12 text-center text-zinc-300 italic border-border border-dashed border">Check in to send your greeting.</div>
      ) : (
        greetings.map(greeting => (
          <div key={greeting.id} className="relative group aspect-square bg-art-gray border border-art-ink overflow-hidden">
            <img src={greeting.photoUrl} alt="Greeting" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            <div className="absolute inset-0 bg-art-accent/0 group-hover:bg-art-accent/10 transition-colors" />
            {!compact && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 border-t border-art-ink">
                <div className="font-black text-xs uppercase mb-1">{greeting.userName}</div>
                <p className="text-[11px] leading-tight opacity-70 italic">"{greeting.message}"</p>
              </div>
            )}
            <div className="absolute bottom-1 left-1 text-[8px] font-bold opacity-30 text-zinc-900">SUTA // 60</div>
          </div>
        ))
      )}
    </div>
  );
}

// --- VIEWS ---

function ScheduleView({ onSelect }: { onSelect: (s: Session) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="art-section-title">Daily Itinerary</div>
      <ScheduleTimeline onSelect={onSelect} />
    </motion.div>
  );
}

function GreetingsView({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="art-section-title mb-0">Community Wall</div>
        <button onClick={onAdd} className="art-btn-primary p-2"><Plus size={18} /></button>
      </header>
      <GreetingsGrid />
    </motion.div>
  );
}

function TravelView({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="art-section-title mb-0">Travel Help</div>
        <button onClick={onAdd} className="art-btn-primary px-4">Post</button>
      </header>
      <TravelList />
    </motion.div>
  );
}

function GalleryView() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setPhotos(SharedStateService.getGallery());
    const handleUpdate = () => setPhotos(SharedStateService.getGallery());
    window.addEventListener('storage_update', handleUpdate);
    return () => window.removeEventListener('storage_update', handleUpdate);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="art-section-title mb-0">Event Gallery</div>
        <button onClick={() => setShowAdd(!showAdd)} className="text-[10px] font-bold uppercase border border-art-ink px-2 py-1 transition-colors hover:bg-art-ink hover:text-white">Admin</button>
      </div>
      
      {showAdd && (
        <div className="art-card mb-8">
          <AddPhotoForm onComplete={() => setShowAdd(false)} />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
        {photos.map(photo => (
          <div key={photo.id} className="aspect-square relative group bg-art-gray border border-art-ink overflow-hidden">
            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            <div className="absolute inset-x-0 bottom-0 bg-art-ink text-white p-2 text-[10px] translate-y-full group-hover:translate-y-0 transition-transform">
              {photo.caption}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FeedbackView() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    SharedStateService.addFeedback({ userId: 'current', rating, comment });
    setSent(true);
  };

  if (sent) return (
    <div className="bg-art-accent p-12 text-white text-center rounded-none border-2 border-art-ink shadow-[10px_10px_0px_0px_rgba(17,17,17,1)]">
      <div className="text-4xl font-black mb-4 font-display italic">RECEIVED.</div>
      <p className="text-sm font-bold uppercase tracking-widest">Your feedback fuels our growth.</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto py-8">
      <div className="art-section-title text-center">Instant Feedback</div>
      <form onSubmit={handleSubmit} className="art-card space-y-8 shadow-[10px_10px_0px_0px_rgba(255,79,0,1)]">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-center block opacity-40">Overall Impression</label>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <button 
                key={s} 
                type="button" 
                onClick={() => setRating(s)}
                className={cn("w-10 h-10 border border-art-ink flex items-center justify-center font-black transition-all", rating >= s ? "bg-art-accent text-white" : "text-art-ink hover:bg-art-gray")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <textarea 
          value={comment} 
          onChange={e => setComment(e.target.value)}
          placeholder="How can we improve?" 
          className="w-full h-32 bg-art-gray/30 border border-art-ink rounded-none p-4 text-sm font-medium focus:outline-none focus:bg-white transition-colors" 
        />
        <button type="submit" disabled={rating === 0} className="art-btn-primary w-full py-4 disabled:opacity-50">Transmit Feedback</button>
      </form>
    </motion.div>
  );
}

function AddPhotoForm({ onComplete }: { onComplete: () => void }) {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleRandom = () => {
    setUrl(`https://picsum.photos/seed/${Math.random()}/1200/800`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !caption) return;
    SharedStateService.addGalleryPhoto(caption, url);
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Photo URL</label>
        <div className="flex gap-2">
          <input value={url} onChange={e => setUrl(e.target.value)} className="flex-1 bg-zinc-50 border border-art-ink rounded-none p-3 text-sm" placeholder="https://..." />
          <button type="button" onClick={handleRandom} className="bg-zinc-100 px-3 border border-art-ink text-xs font-bold hover:bg-art-gray">Mock</button>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Caption</label>
        <input value={caption} onChange={e => setCaption(e.target.value)} className="w-full bg-zinc-50 border border-art-ink rounded-none p-3 text-sm" placeholder="Moment @ Gala" />
      </div>
      <button type="submit" className="w-full bg-art-ink text-white font-bold py-3 uppercase text-[12px] hover:bg-art-accent transition-colors">Publish to Gallery</button>
    </form>
  );
}

// --- MODALS ---

function SessionDetailModal({ session, onClose }: { session: Session, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-art-ink/80 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: 20, opacity: 0 }} 
        className="relative bg-white border-4 border-art-ink w-full max-w-lg overflow-hidden shadow-[20px_20px_0px_0px_rgba(255,79,0,1)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-art-ink hover:text-art-accent"><X size={24} /></button>
        <div className="p-10 space-y-8">
          <div className="space-y-2">
            <span className="art-pill bg-art-accent text-white">{session.type}</span>
            <div className="text-sm font-black text-art-ink/40 tracking-wider italic">{session.time}</div>
          </div>
          
          <h2 className="text-4xl font-black font-display uppercase leading-none tracking-tight">{session.title}</h2>
          
          <div className="flex items-center gap-2 text-art-accent">
             <MapPin size={16} />
             <span className="font-bold text-sm uppercase italic">{session.location}</span>
          </div>

          <p className="text-lg font-medium leading-relaxed border-t-2 border-art-ink pt-8 font-serif italic text-art-ink/80">
            {session.description}
          </p>

          <button onClick={onClose} className="w-full art-btn-primary py-5 uppercase italic tracking-[2px]">Close Dossier</button>
        </div>
      </motion.div>
    </div>
  );
}

function SelfieModal({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  }

  function stopCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }

  function capture() {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setCapturedImage(canvasRef.current.toDataURL('image/jpeg'));
        stopCamera();
      }
    }
  }

  function handlePost() {
    if (capturedImage && userName && message) {
      SharedStateService.addGreeting(userName, capturedImage, message);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-900/95 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white border-2 border-art-ink w-full max-w-lg overflow-hidden shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/10 text-white rounded-full z-10 hover:bg-art-accent"><X size={20} /></button>
        <div className="p-0">
          <div className="aspect-[3/4] bg-art-gray relative overflow-hidden border-b border-art-ink">
            {!capturedImage ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                <button onClick={capture} className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white flex items-center justify-center group">
                  <div className="w-12 h-12 bg-white rounded-full transition-transform group-active:scale-90" />
                </button>
              </>
            ) : (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover scale-x-[-1]" />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="p-8 space-y-6">
            <input type="text" placeholder="ALUMNI NAME" value={userName} onChange={e => setUserName(e.target.value)} className="w-full text-xl font-black p-0 border-none focus:ring-0 placeholder:text-zinc-200 uppercase font-display" />
            <textarea placeholder="MESSAGE TO CLASS" value={message} onChange={e => setMessage(e.target.value)} className="w-full text-zinc-600 border-none p-0 resize-none focus:ring-0 placeholder:text-zinc-200 h-24 font-bold italic" />
            <button onClick={handlePost} disabled={!capturedImage || !userName || !message} className="art-btn-primary w-full py-5 disabled:opacity-20 transition-all font-display">TRANSMIT COMMUNIQUE</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TravelModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    userName: '',
    type: 'seeking' as 'seeking' | 'offering',
    from: '',
    to: '',
    time: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.from || !formData.to) return;
    SharedStateService.addTravelPost(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: 50, opacity: 0 }} 
        className="relative bg-white border-2 border-art-ink w-full max-w-md p-8 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-400 hover:text-art-ink"><X size={24} /></button>
        <h3 className="text-3xl font-black font-display mb-8 uppercase tracking-tighter">Travel Board</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex border border-art-ink">
            <button type="button" onClick={() => setFormData({...formData, type: 'seeking'})} className={cn("flex-1 py-3 text-[11px] font-black uppercase transition-all font-display", formData.type === 'seeking' ? "bg-art-ink text-white" : "bg-white text-art-ink")}>Seeking</button>
            <button type="button" onClick={() => setFormData({...formData, type: 'offering'})} className={cn("flex-1 py-3 text-[11px] font-black uppercase transition-all font-display", formData.type === 'offering' ? "bg-art-ink text-white" : "bg-white text-art-ink")}>Offering</button>
          </div>
          <div className="space-y-4">
            <SimpleInput label="NAME" value={formData.userName} onChange={v => setFormData({...formData, userName: v})} />
            <div className="grid grid-cols-2 gap-4">
              <SimpleInput label="FROM" value={formData.from} onChange={v => setFormData({...formData, from: v})} />
              <SimpleInput label="TO" value={formData.to} onChange={v => setFormData({...formData, to: v})} />
            </div>
            <SimpleInput label="TIME" value={formData.time} onChange={v => setFormData({...formData, time: v})} />
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="NOTES" className="w-full bg-art-gray/20 border border-art-ink p-3 text-sm focus:outline-none h-20 placeholder:text-zinc-300 font-bold italic" />
          </div>
          <button type="submit" className="art-btn-primary w-full py-4 italic font-display">POST ARRANGEMENT</button>
        </form>
      </motion.div>
    </div>
  );
}

function SimpleInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-black tracking-widest text-zinc-400 ml-1 italic">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-art-gray/20 border border-art-ink p-3 text-sm focus:outline-none placeholder:text-zinc-200" />
    </div>
  );
}
