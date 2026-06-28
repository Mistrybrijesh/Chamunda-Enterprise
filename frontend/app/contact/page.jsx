'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production: send to an email API or backend contact route
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name:'', email:'', phone:'', message:'' });
  };

  return (
    <>
      <div className="page-band">
        <div className="container">
          <h1>Contact Us</h1>
          <p style={{color:'var(--text2)',marginTop:6}}>We'd love to hear from you</p>
        </div>
      </div>

      <div className="section">
        <div className="container contact-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'start'}}>
          {/* Contact Info */}
          <div>
            <h2 style={{fontSize:26,fontWeight:800,marginBottom:24}}>Get In Touch</h2>
            {[
              {icon:'📍',label:'Visit Us',value:'123 Furniture Lane, Ahmedabad, Gujarat — 380001'},
              {icon:'📞',label:'Call Us',value:'+91 99999 88888 (Mon–Sat, 10am–7pm)'},
              {icon:'📧',label:'Email Us',value:'hello@furnicraft.in'},
            ].map(({icon,label,value})=>(
              <div key={label} style={{display:'flex',gap:16,marginBottom:24,alignItems:'flex-start'}}>
                <div style={{width:44,height:44,background:'var(--bg3)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{icon}</div>
                <div>
                  <p style={{fontWeight:700,marginBottom:4}}>{label}</p>
                  <p style={{color:'var(--text2)',fontSize:14,lineHeight:1.6}}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="mobilepad" style={{background:'var(--bg3)',borderRadius:20,padding:36}}>
            <h2 style={{fontSize:22,fontWeight:800,marginBottom:24}}>Send a Message</h2>
            {sent && (
              <div style={{background:'rgba(34,197,94,0.1)',border:'1px solid var(--success)',borderRadius:10,padding:'12px 16px',marginBottom:20,fontSize:14,color:'var(--success)'}}>
                ✓ Message sent! We'll get back to you within 24 hours.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Name *</label>
                  <input required value={form.name} onChange={f('name')} /></div>
                <div className="form-group"><label>Phone</label>
                  <input value={form.phone} onChange={f('phone')} /></div>
              </div>
              <div className="form-group"><label>Email *</label>
                <input required type="email" value={form.email} onChange={f('email')} /></div>
              <div className="form-group"><label>Message *</label>
                <textarea required rows={5} placeholder="Tell us how we can help you..." value={form.message} onChange={f('message')} /></div>
              <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px'}}>
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
