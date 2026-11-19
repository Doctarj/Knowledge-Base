import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type { IKnowledgeBaseProps } from './IKnowledgeBaseProps';
import type { ClientTree, DocBlock, Photo, TreeNode } from '../data/types';
import { CLIENT_LOADERS, PHOTO_LOADERS } from '../data/clientLoaders';

const C = {
  navy:'#000735',blue:'#012169',teal:'#004B44',purple:'#3D1063',
  copper:'#E7BD9D',rose:'#AD665E',amber:'#B07D2A',
  bg:'#F6F5F2',white:'#FFFFFF',border:'#E2E1DB',sub:'#4A4A60',muted:'#8888A0',
  get blue2(){return this.blue}
};


const CLIENTS = [
  {name:'Albany Club of Toronto',province:'Ontario',code:'ALB'},
  {name:'Angus Glen GC',province:'Ontario',code:'ANG'},
  {name:'AT Immigration Law',province:'Ontario',code:'ATI'},
  {name:'Bayview G&CC',province:'Ontario',code:'BAY'},
  {name:'Beach Grove Golf Club',province:'BC',code:'BGR'},
  {name:'Beacon Hall Golf Club',province:'Ontario',code:'BHG'},
  {name:'Bigwin Island Golf Club',province:'Ontario',code:'BIG'},
  {name:'Blackhawk Golf Club',province:'AB',code:'BLA'},
  {name:'Boulevard Club',province:'Ontario',code:'BOU'},
  {name:'Brampton Golf Club',province:'Ontario',code:'BRM'},
  {name:'Brantford G&CC',province:'Ontario',code:'BRN'},
  {name:'Burlington G&CC',province:'Ontario',code:'BUR'},
  {name:'Calgary Winter Club',province:'AB',code:'CWC'},
  {name:'Canyon Meadows G&CC',province:'AB',code:'CMG'},
  {name:'Cedar Brae Golf Club',province:'Ontario',code:'CDR'},
  {name:'Country Hills Golf Club',province:'AB',code:'CHG'},
  {name:'Credit Valley G&CC',province:'Ontario',code:'CRV'},
  {name:'Debut Group',province:'Ontario',code:'DEB'},
  {name:'Derrick Golf and Winter Club',province:'AB',code:'DER'},
  {name:'Devils Pulpit Golf Association',province:'Ontario',code:'DEV'},
  {name:'Donalda Golf Club',province:'Ontario',code:'DON'},
  {name:'Dundas Valley G&CC',province:'Ontario',code:'DVG'},
  {name:'Earl Grey Golf Club',province:'AB',code:'EGR'},
  {name:'Edmonton Country Club',province:'AB',code:'ECC'},
  {name:'Edmonton Petroleum G&CC',province:'AB',code:'EPG'},
  {name:'Glendale G&CC',province:'AB',code:'GLN'},
  {name:'Granite Golf Club',province:'Ontario',code:'GRA'},
  {name:'Greenacres Golf Course',province:'BC',code:'GRN'},
  {name:'Hamilton G&CC',province:'Ontario',code:'HAM'},
  {name:'Highlands Golf Club',province:'AB',code:'HLN'},
  {name:'Islington Golf Club',province:'Ontario',code:'ISL'},
  {name:'Ladies Golf Club',province:'Ontario',code:'LAD'},
  {name:'Lambton G&CC',province:'Ontario',code:'LAM'},
  {name:'Maple Downs G&CC',province:'Ontario',code:'MPD'},
  {name:'Marine Drive GC',province:'BC',code:'MDG'},
  {name:'Markland Wood Golf Club',province:'Ontario',code:'MKW'},
  {name:'Mississaugua G&CC',province:'Ontario',code:'MSG'},
  {name:'Mizuno Canada',province:'Ontario',code:'MIZ'},
  {name:'National Yacht Club',province:'Ontario',code:'TNY'},
  {name:'North Halton G&CC',province:'Ontario',code:'NHA'},
  {name:'Oakdale G&CC',province:'Ontario',code:'OKD'},
  {name:'Ontario Racquet Club',province:'Ontario',code:'ORC'},
  {name:'Oshawa Golf & Curling Club',province:'Ontario',code:'OSH'},
  {name:'Peterborough G&CC',province:'Ontario',code:'PTB'},
  {name:'PGA of Ontario',province:'Ontario',code:'PGA'},
  {name:'Pitt Meadows Golf Club',province:'BC',code:'PIT'},
  {name:'Point Grey G&CC',province:'BC',code:'PGR'},
  {name:'Port Credit Yacht Club',province:'Ontario',code:'PCY'},
  {name:'Priddis Greens G&CC',province:'AB',code:'PRG'},
  {name:'RCMI',province:'Ontario',code:'RCM'},
  {name:'Richmond Country Club',province:'BC',code:'RIC'},
  {name:'Rideau Club',province:'Ontario',code:'RID'},
  {name:'Rosedale GC',province:'Ontario',code:'ROS'},
  {name:'Royal Canadian Yacht Club',province:'Ontario',code:'RCYC'},
  {name:'Royal Glenora Club',province:'AB',code:'RGL'},
  {name:'Scarboro G&CC',province:'Ontario',code:'SCR'},
  {name:'Shaughnessy G&CC',province:'BC',code:'SHA'},
  {name:'Silver Springs G&CC',province:'AB',code:'SSG'},
  {name:'St Georges G&CC',province:'Ontario',code:'STG'},
  {name:'The Arbutus Club',province:'BC',code:'ARB'},
  {name:'The Avalon Club',province:'Ontario',code:'AVL'},
  {name:'The Balmy Beach Club',province:'Ontario',code:'BAL'},
  {name:'The Glencoe Club',province:'AB',code:'GLC'},
  {name:'The Hamilton Club',province:'Ontario',code:'THC'},
  {name:'The National Club',province:'Ontario',code:'TNC'},
  {name:'The Oakville Club',province:'Ontario',code:'OAC'},
  {name:'The Oakville Golf Club',province:'Ontario',code:'OAG'},
  {name:'The Royal Vancouver Yacht Club',province:'BC',code:'RVYC'},
  {name:'The Toronto Club',province:'Ontario',code:'TTC'},
  {name:'The Toronto Golf Club',province:'Ontario',code:'TGO'},
  {name:'The Toronto Hunt',province:'Ontario',code:'THU'},
  {name:'The Toronto L&T Club',province:'Ontario',code:'TLT'},
  {name:'The University Club of Toronto',province:'Ontario',code:'UNI'},
  {name:'The Vancouver Golf Club',province:'BC',code:'VGC'},
  {name:'The York Club',province:'Ontario',code:'TYC'},
  {name:'Thornhill G&CC',province:'Ontario',code:'THO'},
  {name:'Toronto Cricket S&CC',province:'Ontario',code:'TCC'},
  {name:'Vancouver Lawn Tennis & Badminton Club',province:'BC',code:'VLT'},
  {name:'Vancouver Rowing Club',province:'BC',code:'VRC'},
  {name:'Weston Golf & Country Club',province:'Ontario',code:'WES'},
  {name:'Whitevale Golf Club',province:'Ontario',code:'WHI'},
  {name:'York Downs G&CC',province:'Ontario',code:'YDO'},
  {name:'Inverness Golf Club',province:'US',code:'INV'},
  {name:'La Cumbre Country Club',province:'US',code:'LCC'},
  {name:'Ladera Golf Club',province:'US',code:'LAG'},
  {name:'The Reserve Club',province:'US',code:'TRC'},
  {name:'Cooper Creek',province:'Ontario',code:'CCK'},
];

const SOPS = [
  {icon:'🔑',title:'Password Reset',time:'~5 min',steps:['Verify caller identity — ask for employee ID or manager name.','Log into ADUC or Azure AD portal.','Locate the user account and verify it is not locked.','If locked: unlock first, then reset password.','Set temporary password. Check "User must change at next logon".','Communicate password securely — not via plaintext email.','Confirm user can log in.','Document ticket with time, user, and action taken.']},
  {icon:'👤',title:'New User Setup',time:'30–60 min',steps:['Receive new hire details from HR.','Create AD/Azure AD account with standard naming.','Assign to correct security groups and distribution lists.','Provision M365 license and configure mailbox.','Prepare hardware — image, domain join, install software.','Set up MFA.','Hand over hardware and credentials on Day 1.','Walk through first login, password change, MFA enrollment.','Confirm email, drives, and apps are accessible.','Provide IT support contact and ticketing portal link.']},
  {icon:'🚪',title:'User Offboarding',time:'Same day',steps:['Receive termination notice from HR.','Disable (do not delete) AD/Azure AD account immediately.','Revoke all MFA tokens and active sessions.','Forward email to manager. Set out-of-office reply.','Remove from all distribution lists and security groups.','Revoke VPN, RDP, and third-party access.','Recover hardware and wipe/reimage for reuse.','Archive mailbox per retention policy.','Document and close ticket.']},
  {icon:'🌐',title:'Internet / Network Down',time:'~20 min',steps:['Ask: one device or whole site?','If one device: check cable, try different port, reboot.','If site-wide: check firewall/router status LEDs.','Log into firewall and check WAN status.','Ping 8.8.8.8 from firewall CLI.','Check ISP status page.','Reboot modem, wait 2 min, reboot firewall, test.','Escalate to ISP if still down.']},
  {icon:'🔒',title:'VPN Not Connecting',time:'~10 min',steps:['Confirm internet works without VPN.','Check VPN client version and update if outdated.','Verify VPN server address is correct.','Try disconnect and reconnect.','Check MFA token is valid.','Reset password and MFA if expired.','Verify port 443 is not blocked.','Try different network to rule out ISP blocking.']},
  {icon:'🦠',title:'Suspected Malware',time:'~30 min',steps:['Isolate machine from network immediately.','Do NOT power off — preserve evidence.','Notify manager immediately.','Document time of discovery and symptoms.','Run full scan with Windows Defender offline.','Check event viewer for suspicious activity.','If ransomware: do NOT pay. Restore from backup.','After cleanup: reset all passwords used on device.','Submit incident report.']},
  {icon:'🖨️',title:'Printer Troubleshooting',time:'~15 min',steps:['Ask for error message and printer model.','Check power, cables, paper, and toner.','Print test page directly from printer.','Restart Print Spooler service.','Delete stuck print jobs.','Reinstall driver from manufacturer website.','If network printer: ping IP, verify connectivity.','Escalate to hardware replacement if still failing.']},
  {icon:'💻',title:'Slow Computer',time:'~20 min',steps:['Ask when slowness started and if anything changed.','Check Task Manager for high CPU/RAM/Disk usage.','End runaway processes.','Run Disk Cleanup and empty Recycle Bin.','Ensure at least 10% free space on C: drive.','Run quick malware scan.','Disable unnecessary startup programs.','Restart and test.','If still slow: check RAM, consider SSD upgrade.']},
];

type Page = 'home'|'clients'|'client-detail'|'client-folder'|'sop'|'sop-detail'|'networks'|'security'|'servers'|'policies'|'tools';
interface Client {name:string;province:string;code:string;}
interface Sop {icon:string;title:string;time:string;steps:string[];}

const provLabel = (p:string) => p==='Ontario'?'ON':p==='BC'?'BC':p==='AB'?'AB':'US';
const provColor = (p:string) => p==='Ontario'?C.teal:p==='BC'?C.blue:p==='AB'?C.amber:C.rose;
const provBg    = (p:string) => p==='Ontario'?'rgba(0,75,68,0.09)':p==='BC'?'rgba(1,33,105,0.08)':p==='AB'?'rgba(176,125,42,0.1)':'rgba(173,102,94,0.09)';
const provBorder= (p:string) => p==='Ontario'?'rgba(0,75,68,0.18)':p==='BC'?'rgba(1,33,105,0.16)':p==='AB'?'rgba(176,125,42,0.18)':'rgba(173,102,94,0.18)';

const Tag: React.FC<{province:string}> = ({province}) => (
  <span style={{display:'inline-flex',alignItems:'center',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.18rem 0.5rem',borderRadius:3,background:provBg(province),color:provColor(province),border:`1px solid ${provBorder(province)}`}}>
    {provLabel(province)}
  </span>
);

const NavItem: React.FC<{icon:string;label:string;active:boolean;badge?:string;onClick:()=>void}> = ({icon,label,active,badge,onClick}) => (
  <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:'0.7rem',padding:'0.5rem 1.2rem',fontSize:'0.82rem',color:active?C.copper:'#fff',cursor:'pointer',borderLeft:active?`2px solid ${C.copper}`:'2px solid transparent',background:active?'rgba(231,189,157,0.1)':'transparent',fontWeight:active?600:400,transition:'all 0.15s'}}>
    <span style={{fontSize:'0.85rem',width:16,textAlign:'center'}}>{icon}</span>
    <span style={{flex:1}}>{label}</span>
    {badge&&<span style={{background:'rgba(0,75,68,0.6)',color:'#7EDFD0',fontSize:'0.57rem',padding:'0.12rem 0.45rem',borderRadius:10,fontWeight:700}}>{badge}</span>}
  </div>
);

const SectionHeading: React.FC<{text:string;action?:React.ReactNode}> = ({text,action}) => (
  <div style={{display:'flex',alignItems:'center',gap:'0.8rem',marginBottom:'0.9rem',marginTop:'0.5rem'}}>
    <span style={{fontSize:'0.64rem',fontWeight:700,letterSpacing:'0.13em',textTransform:'uppercase',color:C.muted,whiteSpace:'nowrap'}}>{text}</span>
    <div style={{flex:1,height:1,background:C.border}}/>
    {action}
  </div>
);

const BackBtn: React.FC<{label:string;onClick:()=>void}> = ({label,onClick}) => (
  <button onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:'0.4rem',fontSize:'0.75rem',fontWeight:500,color:C.teal,background:'none',border:'none',cursor:'pointer',marginBottom:'1.3rem',padding:0}}>
    ← {label}
  </button>
);

const PageHeader: React.FC<{title:string;subtitle:string;extra?:React.ReactNode}> = ({title,subtitle,extra}) => (
  <div style={{marginBottom:'1.8rem',paddingBottom:'1.4rem',borderBottom:`1px solid ${C.border}`}}>
    <h1 style={{fontSize:'1.5rem',fontWeight:700,letterSpacing:'-0.02em',color:C.navy,marginBottom:'0.3rem'}}>{title}</h1>
    <p style={{color:C.sub,fontSize:'0.83rem',margin:0}}>{subtitle}</p>
    {extra}
  </div>
);

const Callout: React.FC<{type:'info'|'warn'|'alert';children:React.ReactNode}> = ({type,children}) => {
  const colors = {info:{bg:'rgba(0,75,68,0.05)',border:C.teal,color:'#003D38'},warn:{bg:'rgba(176,125,42,0.07)',border:C.amber,color:'#5A3A10'},alert:{bg:'rgba(173,102,94,0.07)',border:C.rose,color:'#7A3830'}};
  const c = colors[type];
  return <div style={{borderRadius:6,padding:'0.75rem 1rem 0.75rem 1.1rem',fontSize:'0.79rem',lineHeight:1.6,marginBottom:'1rem',borderLeft:`3px solid ${c.border}`,background:c.bg,color:c.color}}>{children}</div>;
};

const FieldGroup: React.FC<{label:string;value:string;placeholder?:boolean}> = ({label,value,placeholder}) => (
  <div style={{marginBottom:'0.9rem'}}>
    <div style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:C.muted,marginBottom:'0.3rem'}}>{label}</div>
    <div style={{fontSize:'0.81rem',color:placeholder?C.muted:C.navy,background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:'0.5rem 0.8rem',lineHeight:1.5,minHeight:34,fontStyle:placeholder?'italic':'normal'}}>{value}</div>
  </div>
);

const StepList: React.FC<{steps:string[]}> = ({steps}) => (
  <ol style={{listStyle:'none',padding:0,margin:0}}>
    {steps.map((step,i)=>(
      <li key={i} style={{display:'flex',gap:'0.85rem',padding:'0.7rem 0',borderBottom:i===steps.length-1?'none':`1px solid ${C.border}`,fontSize:'0.81rem',lineHeight:1.55,color:C.navy}}>
        <span style={{width:20,height:20,flexShrink:0,background:C.navy,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.62rem',fontWeight:700,marginTop:2}}>{i+1}</span>
        <span>{step}</span>
      </li>
    ))}
  </ol>
);

const Accordion: React.FC<{icon:string;title:string;defaultOpen?:boolean;children:React.ReactNode}> = ({icon,title,defaultOpen,children}) => {
  const [open,setOpen] = React.useState(defaultOpen||false);
  return (
    <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,marginBottom:'0.6rem',overflow:'hidden'}}>
      <div onClick={()=>setOpen(!open)} style={{padding:'0.85rem 1.1rem',display:'flex',alignItems:'center',gap:'0.8rem',cursor:'pointer',borderLeft:open?`2px solid ${C.teal}`:'2px solid transparent',borderBottom:open?`1px solid ${C.border}`:'none',background:open?'transparent':C.white}}>
        <span>{icon}</span>
        <span style={{fontSize:'0.84rem',fontWeight:600,color:C.navy,flex:1}}>{title}</span>
        <span style={{color:C.muted,fontSize:'0.75rem',transform:open?'rotate(90deg)':'none',transition:'transform 0.2s'}}>›</span>
      </div>
      {open&&<div style={{padding:'1.2rem 1.3rem'}}>{children}</div>}
    </div>
  );
};

// ── LAZY DATA — client docs and photo galleries are separate chunks ──
const hasDocs = (code:string):boolean => Object.prototype.hasOwnProperty.call(CLIENT_LOADERS, code);

type Loadable<T> = {data:T|null; loading:boolean; error:boolean; retry:()=>void};
const loadCache: Record<string, Promise<unknown>> = {};

function useLazy<T>(key:string|null, loader:(()=>Promise<T>)|undefined): Loadable<T> {
  const [state, setState] = React.useState<{key:string|null;data:T|null;error:boolean}>({key:null,data:null,error:false});
  const [attempt, setAttempt] = React.useState(0);
  React.useEffect(() => {
    if(!key || !loader) return;
    let alive = true;
    if(!loadCache[key]) loadCache[key] = loader();
    loadCache[key].then(
      d => { if(alive) setState({key, data:d as T, error:false}); },
      () => { delete loadCache[key]; if(alive) setState({key, data:null, error:true}); }
    );
    return () => { alive = false; };
  }, [key, attempt]);
  const current = state.key === key;
  return {
    data: current ? state.data : null,
    loading: !!key && !!loader && !current,
    error: current && state.error,
    retry: () => { setState({key:null,data:null,error:false}); setAttempt(a=>a+1); }
  };
}

const useClientTree = (code:string):Loadable<ClientTree> =>
  useLazy<ClientTree>(hasDocs(code) ? 'client:'+code : null, CLIENT_LOADERS[code]);

const LoadState: React.FC<{state:Loadable<unknown>;what:string}> = ({state,what}) => (
  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'1.2rem',fontSize:'0.82rem',color:C.muted}}>
    {state.error
      ? <span>Could not load {what}. <button onClick={state.retry} style={{background:'none',border:'none',color:C.teal,cursor:'pointer',fontWeight:600,padding:0}}>Try again</button></span>
      : <span>Loading {what}…</span>}
  </div>
);

const folderIcon = (name:string):string => {
  const n = name.toLowerCase();
  if(n==='applications'||n==='apps') return '💻';
  if(n==='network') return '🌐';
  if(n==='general') return '📋';
  if(n==='guides') return '📖';
  if(n==='phones') return '📞';
  if(n==='printers') return '🖨️';
  if(n==='photos') return '📷';
  return '📁';
};

const folderColor = (name:string):string => {
  const n = name.toLowerCase();
  if(n==='network') return C.blue;
  if(n==='applications'||n==='apps') return C.purple;
  if(n==='guides') return C.teal;
  if(n==='phones') return C.amber;
  if(n==='printers') return C.sub;
  if(n==='photos') return C.rose;
  return C.teal;
};

// ── FOLDER GRID — renders cards for folder/file/photos nodes ──
const FolderGrid: React.FC<{nodes:TreeNode[];onNavigate:(name:string)=>void}> = ({nodes,onNavigate}) => (
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:12}}>
    {nodes.map((folder,i)=>{
      const name = folder.name || (folder.type==='files'?'Files':folder.type==='photos'?'Photos':'Item');
      // A folder wrapping a single file/files/photos node opens straight into it, so describe that content.
      const only = folder.type==='folder' && (folder.children||[]).length===1 ? (folder.children as TreeNode[])[0] : null;
      const node = only && only.type!=='folder' ? only : folder;
      const count = node.type==='folder'?(node.children||[]).length:
                    node.type==='files'?(node.tabs||[]).length:
                    node.type==='photos'?(node.count ?? (node.photos||[]).length):
                    node.type==='file'?1:0;
      const icon = node.type==='photos'?'📷':folderIcon(name);
      const color = node.type==='photos'?C.rose:folderColor(name);
      const label = node.type==='photos'?`${count} photo${count!==1?'s':''}`:
                    node.type==='file'?'1 file':
                    node.type==='files'?`${count} file${count!==1?'s':''}`:
                    `${count} item${count!==1?'s':''}`;
      return (
        <div key={i} onClick={()=>onNavigate(name)}
          style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'1.3rem 1rem',cursor:'pointer',position:'relative',overflow:'hidden',transition:'all 0.15s'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.navy;e.currentTarget.style.boxShadow='0 4px 16px rgba(0,7,53,0.09)';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow='none';}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:color}}/>
          <div style={{fontSize:'1.6rem',marginBottom:'0.55rem'}}>{icon}</div>
          <div style={{fontSize:'0.85rem',fontWeight:600,color:C.navy,marginBottom:'0.2rem',wordBreak:'break-word'}}>{name}</div>
          <div style={{fontSize:'0.7rem',color:C.muted}}>{label}</div>
          <div style={{marginTop:'0.7rem',fontSize:'0.7rem',color:C.teal,fontWeight:600}}>Open →</div>
        </div>
      );
    })}
  </div>
);

// ── CLIENT DETAIL — shows top-level folder cards ──────────────
const ClientDetail: React.FC<{client:Client;onBack:()=>void;onNavigate:(path:string[])=>void}> = ({client,onBack,onNavigate}) => {
  const tree = useClientTree(client.code);
  const topNodes = tree.data ? tree.data.children : [];

  return (
    <div>
      <button style={{display:'inline-flex',alignItems:'center',gap:'0.4rem',fontSize:'0.75rem',fontWeight:500,color:C.teal,background:'none',border:'none',cursor:'pointer',marginBottom:'1.3rem',padding:0}} onClick={onBack}>← Back to Clients</button>
      <div style={{marginBottom:'1.8rem',paddingBottom:'1.4rem',borderBottom:`1px solid ${C.border}`}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:700,letterSpacing:'-0.02em',color:C.navy,marginBottom:'0.3rem'}}>{client.name}</h1>
        <p style={{color:C.sub,fontSize:'0.83rem',margin:'0 0 0.5rem'}}>Complete client documentation</p>
        <div style={{display:'flex',alignItems:'center',gap:'0.6rem',flexWrap:'wrap'}}>
          <Tag province={client.province}/>
          <span style={{display:'inline-flex',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.18rem 0.5rem',borderRadius:3,background:'rgba(0,7,53,0.07)',color:C.navy,border:'1px solid rgba(0,7,53,0.14)'}}>{client.code}</span>
          {hasDocs(client.code)&&<span style={{display:'inline-flex',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.18rem 0.5rem',borderRadius:3,background:'rgba(0,75,68,0.09)',color:C.teal,border:'1px solid rgba(0,75,68,0.18)'}}>Documentation Available</span>}
        </div>
      </div>
      {(tree.loading || tree.error) ? (
        <LoadState state={tree} what="client documentation"/>
      ) : topNodes.length>0 ? (
        <FolderGrid nodes={topNodes} onNavigate={(name)=>onNavigate([name])}/>
      ) : (
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'1.2rem'}}>
          <div style={{fontSize:'0.82rem',color:C.muted,fontStyle:'italic'}}>No documentation uploaded yet for this client.</div>
        </div>
      )}
    </div>
  );
};

const highlight = (text: string): React.ReactElement => {
  // UNC paths: \\SERVER\Share$\folder (stops at whitespace and closing punctuation).
  const parts = text.split(/(\[[^\]\n]+\]\(https?:[^)\s]+\)|\\\\[^\s,;)"”]+|[A-Z][0-9]{3}[A-Z]{2}[0-9]{3}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}|[0-9]{3}[-.][0-9]{3}[-.][0-9]{4}|https?:[/][/][^ ]+)/g);
  return <>{parts.map((part, i) => {
    if(!part) return null;
    // split() with a capture group puts plain text at even indexes and matches at odd ones.
    if(i%2===0) return <span key={i}>{part}</span>;
    const md = /^\[([^\]\n]+)\]\((https?:[^)\s]+)\)$/.exec(part);
    if(md) return <a key={i} href={md[2]} target="_blank" rel="noreferrer" title={md[2]} style={{color:'#0F6E56',fontWeight:500,textDecoration:'underline',textDecorationColor:'rgba(15,110,86,0.35)'}}>{md[1]}</a>;
    if(/^\\\\/.test(part)) return <code key={i} style={{fontSize:'0.76rem',background:'rgba(1,33,105,0.07)',border:'1px solid rgba(1,33,105,0.15)',borderRadius:3,padding:'1px 5px',color:'#012169',fontFamily:'Consolas,monospace'}}>{part}</code>;
    if(/^[A-Z][0-9]{3}[A-Z]{2}[0-9]{3}$/.test(part)) return <strong key={i} style={{color:'#012169',fontWeight:600}}>{part}</strong>;
    if(/@/.test(part) && !/^https?/.test(part)) return <a key={i} href={'mailto:'+part} style={{color:'#0F6E56',textDecoration:'none',fontWeight:500}}>{part}</a>;
    if(/^[0-9]{3}[-.][0-9]{3}[-.][0-9]{4}$/.test(part)) return <strong key={i} style={{color:'#3D1063',fontWeight:600}}>{part}</strong>;
    if(/^https?:/.test(part)) return <a key={i} href={part} target="_blank" rel="noreferrer" style={{color:'#0F6E56',textDecoration:'none',wordBreak:'break-all'}}>{part}</a>;
    return <span key={i}>{part}</span>;
  })}</>;
};

// Text with line breaks from the source document (Shift+Enter in Word).
const multiline = (text: string): React.ReactElement => {
  const lines = text.split('\n');
  return <>{lines.map((line,i)=><React.Fragment key={i}>{highlight(line)}{i<lines.length-1&&<br/>}</React.Fragment>)}</>;
};

// Full-screen viewer for screenshots and photos; Esc, ←/→ and click outside work as expected.
const Lightbox: React.FC<{items:{src:string;caption?:string}[];index:number;onIndex:(i:number)=>void;onClose:()=>void}> = ({items,index,onIndex,onClose}) => {
  const many = items.length>1;
  React.useEffect(() => {
    const onKey = (e:KeyboardEvent):void => {
      if(e.key==='Escape') onClose();
      else if(many && e.key==='ArrowRight') onIndex((index+1)%items.length);
      else if(many && e.key==='ArrowLeft') onIndex((index-1+items.length)%items.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, items.length]);
  const item = items[index];
  const navBtn = (label:string, delta:number, side:'left'|'right'): React.ReactElement => (
    <button aria-label={label} onClick={e=>{e.stopPropagation();onIndex((index+delta+items.length)%items.length);}}
      style={{position:'absolute',top:'50%',[side]:16,transform:'translateY(-50%)',width:44,height:44,borderRadius:'50%',border:'none',background:'rgba(255,255,255,0.14)',color:'#fff',fontSize:'1.4rem',cursor:'pointer'}}>
      {delta<0?'‹':'›'}
    </button>
  );
  // Portal to <body>: SharePoint page sections can clip or transform position:fixed children.
  return ReactDOM.createPortal(
    <div onClick={onClose} role="dialog" aria-modal="true"
      style={{position:'fixed',inset:0,zIndex:10000,background:'rgba(0,7,53,0.88)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2.5rem 4.5rem',boxSizing:'border-box',cursor:'zoom-out'}}>
      <img src={item.src} alt={item.caption||''} onClick={e=>e.stopPropagation()}
        style={{maxWidth:'100%',maxHeight:'calc(100% - 2.5rem)',objectFit:'contain',borderRadius:4,boxShadow:'0 10px 40px rgba(0,0,0,0.45)',cursor:'default',background:'#fff'}}/>
      <div style={{color:'#fff',fontSize:'0.8rem',marginTop:'0.8rem',textAlign:'center'}}>
        {item.caption}{many&&<span style={{color:'rgba(255,255,255,0.55)',marginLeft:'0.6rem'}}>{index+1} / {items.length}</span>}
      </div>
      <button aria-label="Close" onClick={onClose} style={{position:'absolute',top:14,right:18,background:'none',border:'none',color:'#fff',fontSize:'1.6rem',cursor:'pointer'}}>×</button>
      {many&&navBtn('Previous',-1,'left')}
      {many&&navBtn('Next',1,'right')}
    </div>,
    document.body
  );
};

const ZoomImage: React.FC<{src:string;alt:string;width?:number}> = ({src,alt,width}) => {
  const [open,setOpen] = React.useState(false);
  return (
    <div style={{margin:'0.8rem 0'}}>
      <img src={src} alt={alt} onClick={()=>setOpen(true)} title="Click to enlarge"
        style={{maxWidth:'100%',width:width?Math.min(width,760):undefined,display:'block',maxHeight:520,objectFit:'contain',borderRadius:6,border:'0.5px solid #E2E1DB',background:'#F6F5F2',cursor:'zoom-in'}}/>
      {open&&<Lightbox items={[{src,caption:alt}]} index={0} onIndex={()=>undefined} onClose={()=>setOpen(false)}/>}
    </div>
  );
};

const renderDocBlock = (block: DocBlock, i: number): React.ReactElement => {
  if(block.type==='sub') return (
    <div key={i} style={{fontSize:'0.72rem',fontWeight:700,color:'#0F6E56',letterSpacing:'0.06em',textTransform:'uppercase',marginTop:i===0?0:'1.1rem',marginBottom:'0.4rem',paddingBottom:'0.25rem',borderBottom:'1px solid rgba(0,75,68,0.12)'}}>{block.text}</div>
  );

  if(block.type==='step') return (
    <div key={i} style={{display:'flex',gap:'0.75rem',alignItems:'flex-start',margin:'0.6rem 0',padding:'0.6rem 0.8rem',background:'rgba(0,7,53,0.03)',borderRadius:6,border:'0.5px solid rgba(0,7,53,0.08)'}}>
      <span style={{flexShrink:0,width:22,height:22,background:'#000735',color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:700}}>{block.num}</span>
      <span style={{fontSize:'0.81rem',lineHeight:1.6,color:'#0A0F35',paddingTop:2}}>{multiline(block.text||'')}</span>
    </div>
  );

  if(block.type==='list') return (
    <ul key={i} style={{margin:'0 0 0.7rem',paddingLeft:`${1.1+(block.level||0)*1.4}rem`,display:'flex',flexDirection:'column',gap:'0.3rem',listStyleType:(block.level||0)>0?'circle':'disc'}}>
      {(block.items||[]).map((item,j)=><li key={j} style={{fontSize:'0.81rem',lineHeight:1.6,color:'#0A0F35'}}>{highlight(item)}</li>)}
    </ul>
  );

  if(block.type==='note') return (
    <div key={i} style={{margin:'0.6rem 0 0.8rem',padding:'0.6rem 0.9rem',borderLeft:`3px solid ${C.amber}`,background:'rgba(176,125,42,0.07)',borderRadius:4,fontSize:'0.8rem',lineHeight:1.6,color:'#5A3A10'}}>
      {multiline(block.text||'')}
    </div>
  );

  // Indented text from the source document: templates, examples, naming formats.
  if(block.type==='indent') return (
    <div key={i} style={{margin:'0.2rem 0 0.8rem 0.9rem',padding:'0.55rem 0.9rem',borderLeft:'2px solid rgba(1,33,105,0.18)',background:'rgba(1,33,105,0.03)',borderRadius:'0 4px 4px 0',fontSize:'0.79rem',lineHeight:1.6,color:'#0A0F35'}}>
      {multiline(block.text||'')}
    </div>
  );

  if(block.type==='image' && block.b64) return (
    <ZoomImage key={i} src={`data:image/jpeg;base64,${block.b64}`} alt="Screenshot" width={block.w}/>
  );

  if(block.type==='table' && block.rows && block.rows.length>0) {
    const headers = block.rows[0];
    const bodyRows = block.rows.slice(1);
    return (
      <div key={i} style={{overflowX:'auto',marginBottom:'0.9rem',borderRadius:6,border:'0.5px solid #E2E1DB'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.78rem',minWidth:300}}>
          <thead>
            <tr>{headers.map((h,j)=><th key={j} style={{textAlign:'left',padding:'0.45rem 0.8rem',background:'#F0EFEB',color:'#8888A0',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.09em',fontWeight:700,borderBottom:'1px solid #E2E1DB',whiteSpace:'nowrap'}}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {bodyRows.map((row,ri)=>(
              <tr key={ri} style={{background:ri%2===0?'#FFFFFF':'#F9F9F7'}}>
                {row.map((cell,ci)=>(
                  <td key={ci} style={{padding:'0.5rem 0.8rem',borderBottom:'1px solid #E2E1DB',color:'#0A0F35',verticalAlign:'top',lineHeight:1.5}}>
                    {cell.split('\n').map((line,li)=><div key={li}>{line ? highlight(line) : <br/>}</div>)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const text = block.text||'';
  // Short "Label:" lines (e.g. "Domain Servers:") introduce the lines below them.
  const isLabel = text.length<60 && /:$/.test(text) && text.indexOf('\n')<0;
  return <p key={i} style={{fontSize:'0.81rem',lineHeight:1.65,margin:isLabel?'0.8rem 0 0.3rem':'0 0 0.55rem',color:'#0A0F35',fontWeight:isLabel?600:400}}>{multiline(text)}</p>;
};

// ── PHOTO GALLERY — inline photos, or a lazily loaded gallery chunk ──
const PhotoGallery: React.FC<{node:TreeNode}> = ({node}) => {
  const lazy = useLazy<Photo[]>(node.chunk ? 'photos:'+node.chunk : null, node.chunk ? PHOTO_LOADERS[node.chunk] : undefined);
  const [open, setOpen] = React.useState<number|null>(null);
  const photos = node.chunk ? (lazy.data||[]) : (node.photos||[]);
  if(node.chunk && (lazy.loading || lazy.error)) return <LoadState state={lazy} what={`${node.count||''} photos`.trim()}/>;
  const items = photos.map(p=>({src:`data:image/jpeg;base64,${p.b64}`,caption:p.name}));
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
        {photos.map((photo,i)=>(
          <div key={i} onClick={()=>setOpen(i)} title="Click to enlarge"
            style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,overflow:'hidden',cursor:'zoom-in'}}>
            <img src={items[i].src} alt={photo.name} loading="lazy"
              style={{width:'100%',height:210,objectFit:'cover',display:'block',background:C.bg}}/>
            <div style={{padding:'0.65rem 0.9rem',fontSize:'0.78rem',fontWeight:500,color:C.navy,lineHeight:1.45}}>{photo.name}</div>
          </div>
        ))}
      </div>
      {open!==null && <Lightbox items={items} index={open} onIndex={setOpen} onClose={()=>setOpen(null)}/>}
    </>
  );
};

// ── TREE PAGE — navigates into any node in the tree ──────────
const ClientTreePage: React.FC<{client:Client;path:string[];onBack:()=>void;onNavigate:(p:string[])=>void}> = ({client,path,onBack,onNavigate}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const tree = useClientTree(client.code);
  const pathKey = path.join('\u0001');
  React.useEffect(() => setActiveTab(0), [pathKey]);

  // Resolve node at current path
  const resolveNode = ():TreeNode|null => {
    let nodes:TreeNode[] = tree.data ? tree.data.children : [];
    let current:TreeNode|null = null;
    for(const seg of path) {
      const found = nodes.find(n=>n.name===seg || (!n.name&&n.type==='files'&&seg==='Files') || (!n.name&&n.type==='photos'&&seg==='Photos'));
      if(!found) return null;
      current = found;
      nodes = found.children||[];
    }
    return current;
  };

  const rawNode = resolveNode();
  // A folder that exists only to wrap a single files/file/photos node (e.g. Guides > Files)
  // should render that content directly instead of an extra "Files" card to click through.
  const node: TreeNode | null = (
    rawNode && rawNode.type==='folder' &&
    (rawNode.children||[]).length===1 &&
    (rawNode.children as TreeNode[])[0].type!=='folder'
  ) ? (rawNode.children as TreeNode[])[0] : rawNode;
  const note = (rawNode && rawNode.note) || (node && node!==rawNode && node.note) || '';

  const tabStyle = (active:boolean):React.CSSProperties => ({
    background:active?C.white:'transparent',border:'none',
    borderBottom:active?`2px solid ${C.teal}`:'2px solid transparent',
    padding:'0.6rem 1rem',fontSize:'0.78rem',fontWeight:active?700:400,
    color:active?C.navy:C.muted,cursor:'pointer',borderRadius:'4px 4px 0 0',
    fontFamily:"'DM Sans','Segoe UI',sans-serif",whiteSpace:'nowrap' as const
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{display:'flex',alignItems:'center',gap:'0.4rem',flexWrap:'wrap',marginBottom:'1rem',fontSize:'0.75rem'}}>
        <button style={{background:'none',border:'none',color:C.teal,cursor:'pointer',padding:0,fontWeight:500}} onClick={onBack}>← {client.name}</button>
        {path.map((seg,i)=>(
          <React.Fragment key={i}>
            <span style={{color:C.muted}}>›</span>
            {i<path.length-1
              ? <button style={{background:'none',border:'none',color:C.teal,cursor:'pointer',padding:0}} onClick={()=>onNavigate(path.slice(0,i+1))}>{seg}</button>
              : <span style={{color:C.navy,fontWeight:600}}>{seg}</span>
            }
          </React.Fragment>
        ))}
      </div>

      {/* Page header */}
      <div style={{marginBottom:'1.2rem',paddingBottom:'0.9rem',borderBottom:`1px solid ${C.border}`}}>
        <h1 style={{fontSize:'1.4rem',fontWeight:700,color:C.navy,marginBottom:'0.2rem'}}>{path[path.length-1]}</h1>
        <p style={{color:C.sub,fontSize:'0.82rem',margin:0}}>{client.name}</p>
      </div>

      {(tree.loading || tree.error) && <LoadState state={tree} what="client documentation"/>}
      {tree.data && !node && <div style={{fontSize:'0.82rem',color:C.muted}}>Folder not found.</div>}
      {note && <Callout type="info">📌 {note}</Callout>}

      {/* FOLDER — show child cards, or an empty state if nothing here yet */}
      {node && node.type==='folder' && (
        (node.children||[]).length>0 ? (
          <FolderGrid nodes={(node.children||[]) as TreeNode[]} onNavigate={(name)=>onNavigate([...path, name])}/>
        ) : (
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'1.2rem'}}>
            <div style={{fontSize:'0.82rem',color:C.muted,fontStyle:'italic'}}>No documentation uploaded yet for this section.</div>
          </div>
        )
      )}

      {/* FILES — show tabbed content */}
      {node && node.type==='files' && (node.tabs||[]).length>0 && (
        <div>
          <div style={{display:'flex',gap:'0.3rem',borderBottom:`1px solid ${C.border}`,marginBottom:'1.2rem',flexWrap:'wrap'}}>
            {(node.tabs||[]).map((tab,i)=>(
              <button key={tab.tab} onClick={()=>setActiveTab(i)} style={tabStyle(activeTab===i)}>{tab.tab}</button>
            ))}
          </div>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'1.2rem 1.3rem'}}>
            {(node.tabs||[])[activeTab]?.blocks.map((block,i)=>renderDocBlock(block,i))}
          </div>
        </div>
      )}

      {/* FILE — show single file content */}
      {node && node.type==='file' && (
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'1.2rem 1.3rem'}}>
          {(node.blocks||[]).map((block,i)=>renderDocBlock(block,i))}
        </div>
      )}

      {/* PHOTOS — show photo gallery */}
      {node && node.type==='photos' && <PhotoGallery node={node}/>}
    </div>
  );
};

const SopDetail: React.FC<{sop:Sop;onBack:()=>void}> = ({sop,onBack}) => (
  <div>
    <BackBtn label="Back to SOPs" onClick={onBack}/>
    <PageHeader title={`${sop.icon} SOP: ${sop.title}`} subtitle={`Estimated time: ${sop.time}`} extra={
      <div style={{marginTop:'0.5rem'}}>
        <span style={{display:'inline-flex',alignItems:'center',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.18rem 0.5rem',borderRadius:3,background:'rgba(0,75,68,0.09)',color:C.teal,border:'1px solid rgba(0,75,68,0.18)'}}>Active SOP</span>
      </div>
    }/>
    <Accordion icon="📋" title="Procedure Steps" defaultOpen>
      <StepList steps={sop.steps}/>
    </Accordion>
  </div>
);

interface KBState {
  page: Page;
  selectedClient: Client|null;
  selectedSop: Sop|null;
  treePath: string[];
  search: string;
}

export default class KnowledgeBase extends React.Component<IKnowledgeBaseProps, KBState> {
  public constructor(props: IKnowledgeBaseProps) {
    super(props);
    this.state = {page:'home', selectedClient:null, selectedSop:null, treePath:[], search:''};
  }

  private nav = (page: Page): void => { this.setState({page, search:'', treePath:[]}); }

  public render(): React.ReactElement<IKnowledgeBaseProps> {
    const {page, selectedClient, selectedSop, treePath, search} = this.state;

    const filtered = CLIENTS.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.province.toLowerCase().includes(search.toLowerCase())
    );

    const card = (key:string, bar:string, icon:string, title:string, sub:string, footer:string, onClick:()=>void) => (
      <div key={key} onClick={onClick} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'1.2rem',cursor:'pointer',position:'relative',overflow:'hidden',transition:'all 0.15s'}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.navy;e.currentTarget.style.boxShadow='0 4px 16px rgba(0,7,53,0.09)';}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow='none';}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:bar}}/>
        <div style={{width:34,height:34,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',marginBottom:'0.85rem',marginTop:'0.3rem',background:'rgba(0,75,68,0.08)'}}>{icon}</div>
        <div style={{fontSize:'0.84rem',fontWeight:600,color:C.navy,marginBottom:'0.3rem',lineHeight:1.3}}>{title}</div>
        <p style={{fontSize:'0.73rem',color:C.sub,lineHeight:1.5,margin:0}}>{sub}</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'0.85rem',paddingTop:'0.6rem',borderTop:`1px solid ${C.border}`,fontSize:'0.68rem',color:C.muted}}>
          <span>{footer}</span><span>→</span>
        </div>
      </div>
    );

    const clientCard = (c: Client) => (
      <div key={c.code} onClick={()=>this.setState({page:'client-detail',selectedClient:c})}
        style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'1.2rem',cursor:'pointer',position:'relative',overflow:'hidden'}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.navy;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:C.teal}}/>
        <div style={{width:36,height:36,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.68rem',fontWeight:700,background:C.bg,color:C.navy,marginBottom:'0.85rem',marginTop:'0.3rem',letterSpacing:'0.06em',border:`1px solid ${C.border}`}}>{c.code}</div>
        <div style={{fontSize:'0.84rem',fontWeight:600,color:C.navy,marginBottom:'0.3rem',lineHeight:1.3}}>{c.name}</div>
        <p style={{fontSize:'0.73rem',color:C.sub,lineHeight:1.5,margin:0}}>{c.province}</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'0.85rem',paddingTop:'0.6rem',borderTop:`1px solid ${C.border}`,fontSize:'0.68rem',color:C.muted}}>
          <Tag province={c.province}/><span>→</span>
        </div>
      </div>
    );

    const HomePage = (
      <div>
        <div style={{background:C.navy,borderRadius:10,padding:'1.8rem 2rem',marginBottom:'2rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1.5rem',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:180,backgroundImage:'repeating-linear-gradient(-45deg,transparent,transparent 9px,rgba(255,255,255,0.03) 9px,rgba(255,255,255,0.03) 10px)',pointerEvents:'none'}}/>
          <div>
            <div style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.13em',textTransform:'uppercase',color:C.copper,marginBottom:'0.45rem'}}>IT Services & Cyber Security for Clubs. Only.</div>
            <h2 style={{fontSize:'1.3rem',fontWeight:700,color:'#fff',letterSpacing:'-0.02em',marginBottom:'0.3rem',margin:0}}>IT Knowledge Base</h2>
            <p style={{fontSize:'0.79rem',color:'rgba(255,255,255,0.5)',maxWidth:380,margin:'0.3rem 0 0'}}>Support & Service Department — internal documentation, SOPs, client records, and technical guides.</p>
          </div>
          <div style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,padding:'1rem 1.5rem',textAlign:'center',flexShrink:0}}>
            <div style={{fontSize:'2.2rem',fontWeight:700,color:C.copper,lineHeight:1}}>88</div>
            <div style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.4)',marginTop:'0.3rem',letterSpacing:'0.07em',textTransform:'uppercase'}}>Active Clients</div>
          </div>
        </div>
        <SectionHeading text="Client Information" action={<button onClick={()=>this.nav('clients')} style={{background:'transparent',border:`1px solid ${C.border}`,color:C.sub,borderRadius:5,padding:'0.3rem 0.7rem',fontSize:'0.7rem',fontWeight:600,cursor:'pointer'}}>View all 88 →</button>}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:'2rem'}}>
          {CLIENTS.slice(0,8).map(c => clientCard(c))}
        </div>
        <SectionHeading text="Technical Reference"/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:'2rem'}}>
          {card('net',C.teal,'🌐','Networks','Configurations, VLAN, IP addressing, troubleshooting.','Reference',()=>this.nav('networks'))}
          {card('sec',C.rose,'🔒','Security','Incident response, password policies, best practices.','Critical',()=>this.nav('security'))}
          {card('srv',C.teal,'🖥️','Server Guides','Setup, maintenance, and administration documentation.','Admin Guides',()=>this.nav('servers'))}
        </div>
        <SectionHeading text="Operations"/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:'2rem'}}>
          {card('sop',C.navy,'📋','Standard Operating Procedures','Most common ticket and call handling procedures.','12 procedures',()=>this.nav('sop'))}
          {card('pol',C.purple,'📄','Internal Policies','On-site ticket creation and license management.','2 policy areas',()=>this.nav('policies'))}
          {card('tls',C.teal,'🔧','Tools','RDP, VPN, Atera, M365 Admin guides.','RDP · VPN',()=>this.nav('tools'))}
        </div>
      </div>
    );

    const ClientsPage = (
      <div>
        <BackBtn label="Back to Knowledge Base" onClick={()=>this.nav('home')}/>
        <PageHeader title="All Clients" subtitle="88 active club clients across Canada & the US"/>
        <div style={{position:'relative',marginBottom:'1rem'}}>
          <span style={{position:'absolute',left:'0.75rem',top:'50%',transform:'translateY(-50%)',color:C.muted,pointerEvents:'none'}}>🔍</span>
          <input style={{width:'100%',background:C.white,border:`1px solid ${C.border}`,borderRadius:6,padding:'0.55rem 1rem 0.55rem 2.2rem',color:C.navy,fontSize:'0.82rem',outline:'none',fontFamily:"'DM Sans','Segoe UI',sans-serif",boxSizing:'border-box'}} placeholder="Search by name, code, or province…" value={search} onChange={e=>this.setState({search:e.target.value})}/>
        </div>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,overflow:'hidden'}}>
          <div style={{padding:'0.6rem 1.1rem',background:C.bg,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',fontSize:'0.62rem',color:C.muted,fontWeight:700,letterSpacing:'0.09em',textTransform:'uppercase',gap:'0.8rem'}}>
            <span style={{width:36,flexShrink:0}}/>
            <span style={{flex:1}}>Client Name</span>
            <span>Region</span>
          </div>
          {filtered.map(c=>(
            <div key={c.code} onClick={()=>this.setState({page:'client-detail',selectedClient:c})} style={{display:'flex',alignItems:'center',gap:'0.85rem',padding:'0.6rem 1.1rem',borderBottom:`1px solid ${C.border}`,cursor:'pointer',transition:'background 0.12s'}}
              onMouseEnter={e=>e.currentTarget.style.background='#F0F0EE'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div style={{width:36,height:36,borderRadius:5,background:'rgba(1,33,105,0.07)',color:C.blue,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.63rem',fontWeight:700,flexShrink:0,letterSpacing:'0.04em',border:'1px solid rgba(1,33,105,0.12)'}}>{c.code}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'0.82rem',fontWeight:600,color:C.navy,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div>
                <div style={{fontSize:'0.7rem',color:C.muted,marginTop:2}}>{c.province}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'0.55rem',flexShrink:0,marginLeft:'auto'}}>
                {hasDocs(c.code)&&<span title="Documentation available" style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.15rem 0.45rem',borderRadius:3,background:'rgba(0,75,68,0.09)',color:C.teal,border:'1px solid rgba(0,75,68,0.18)'}}>Docs</span>}
                <Tag province={c.province}/>
                <span style={{color:C.muted,fontSize:'0.82rem'}}>→</span>
              </div>
            </div>
          ))}
          {filtered.length===0&&<div style={{padding:'2rem',textAlign:'center',color:C.muted}}>No clients found for "{search}"</div>}
        </div>
        <div style={{fontSize:'0.7rem',color:C.muted,marginTop:'0.6rem',textAlign:'right'}}>Showing {filtered.length} of 88 clients</div>
      </div>
    );

    const SopPage = (
      <div>
        <BackBtn label="Back to Knowledge Base" onClick={()=>this.nav('home')}/>
        <PageHeader title="Standard Operating Procedures" subtitle="Most common ticket and call handling procedures"/>
        <Callout type="info">📌 Follow each procedure in sequence. Escalate if the issue persists after all steps.</Callout>
        <SectionHeading text="Ticket SOPs"/>
        {SOPS.slice(0,5).map(sop=>(
          <div key={sop.title} onClick={()=>this.setState({page:'sop-detail',selectedSop:sop})} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:7,padding:'0.85rem 1rem',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.9rem',cursor:'pointer',transition:'all 0.15s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.navy;e.currentTarget.style.background=C.bg;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.white;}}>
            <div style={{width:32,height:32,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',flexShrink:0,background:'rgba(0,75,68,0.08)'}}>{sop.icon}</div>
            <div><div style={{fontSize:'0.82rem',fontWeight:600,color:C.navy}}>{sop.title}</div><div style={{fontSize:'0.7rem',color:C.sub,marginTop:2}}>Est. time: {sop.time}</div></div>
            <span style={{marginLeft:'auto',color:C.muted}}>→</span>
          </div>
        ))}
        <SectionHeading text="Call SOPs"/>
        {SOPS.slice(5).map(sop=>(
          <div key={sop.title} onClick={()=>this.setState({page:'sop-detail',selectedSop:sop})} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:7,padding:'0.85rem 1rem',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.9rem',cursor:'pointer',transition:'all 0.15s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.navy;e.currentTarget.style.background=C.bg;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.white;}}>
            <div style={{width:32,height:32,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',flexShrink:0,background:'rgba(0,75,68,0.08)'}}>{sop.icon}</div>
            <div><div style={{fontSize:'0.82rem',fontWeight:600,color:C.navy}}>{sop.title}</div><div style={{fontSize:'0.7rem',color:C.sub,marginTop:2}}>Est. time: {sop.time}</div></div>
            <span style={{marginLeft:'auto',color:C.muted}}>→</span>
          </div>
        ))}
      </div>
    );

    const NetworksPage = (
      <div>
        <BackBtn label="Back to Knowledge Base" onClick={()=>this.nav('home')}/>
        <PageHeader title="Networks" subtitle="General network guides, configurations, and reference documentation"/>
        <Accordion icon="🔧" title="Network Troubleshooting Guide" defaultOpen>
          <StepList steps={['Verify physical connections — check all patch cables, ensure switch port LEDs are active.','Check if issue is isolated to one device or site-wide. Ping gateway from affected machine.','Log into the firewall/router and check WAN status and uptime.','Review DHCP leases for correct IP assignment. Check for IP conflicts.','Check switch logs for port errors, flapping, or storm control triggers.','If Wi-Fi issue, confirm AP is associated with controller and check radio status.','Escalate to ISP if WAN link is down and modem shows no signal.']}/>
        </Accordion>
        <Accordion icon="📊" title="Standard IP Addressing Template">
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.78rem'}}>
            <thead><tr>{['Range','Purpose','Notes'].map(h=><th key={h} style={{textAlign:'left',padding:'0.45rem 0.8rem',background:C.bg,color:C.muted,fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.09em',fontWeight:700,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{[['.1–.10','Network devices (routers, switches, APs)','Static IPs'],['.11–.50','Servers & printers','Static IPs'],['.51–.100','DHCP pool — workstations','DHCP'],['.101–.150','DHCP pool — laptops/mobile','DHCP'],['.200–.250','VoIP phones','DHCP w/ reservations']].map(([r,p,n])=><tr key={r}>{[r,p,n].map((cell,i)=><td key={i} style={{padding:'0.55rem 0.8rem',borderBottom:`1px solid ${C.border}`,color:C.navy}}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </Accordion>
      </div>
    );

    const SecurityPage = (
      <div>
        <BackBtn label="Back to Knowledge Base" onClick={()=>this.nav('home')}/>
        <PageHeader title="Security" subtitle="Incident response, password policies, and best practices"/>
        <Callout type="alert">🔴 All security incidents must be escalated immediately. Do not remediate ransomware without manager approval.</Callout>
        <Accordion icon="🚨" title="Incident Response Checklist" defaultOpen>
          <StepList steps={['Identify and confirm the incident. Gather initial info — type, scope, affected systems.','Isolate affected systems from the network immediately to prevent spread.','Notify the manager and document the time of discovery.','Preserve logs and evidence. Do not power off affected machines unless instructed.','Determine root cause. Check AV logs, event viewer, and firewall logs.','Remediate — remove malware, patch vulnerability, reset compromised credentials.','Restore from backup if data loss occurred. Verify backup integrity before restoring.','Document the full incident timeline and close with a post-incident report.']}/>
        </Accordion>
        <Accordion icon="🔐" title="Password Policy Standards">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem'}}>
            <FieldGroup label="Minimum Length" value="12 characters"/>
            <FieldGroup label="Complexity" value="Uppercase, lowercase, number, special character"/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem'}}>
            <FieldGroup label="Expiry" value="90 days (privileged) · 180 days (standard)"/>
            <FieldGroup label="MFA" value="Required for all remote access and admin portals"/>
          </div>
        </Accordion>
      </div>
    );

    const ServersPage = (
      <div>
        <BackBtn label="Back to Knowledge Base" onClick={()=>this.nav('home')}/>
        <PageHeader title="Server Guides" subtitle="Server administration, setup, and maintenance documentation"/>
        <Accordion icon="🖥️" title="Server Documentation Template" defaultOpen>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem'}}>
            <FieldGroup label="Server Name / Hostname" value="e.g. SRV-DC01" placeholder/>
            <FieldGroup label="Role" value="e.g. Domain Controller" placeholder/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem'}}>
            <FieldGroup label="OS / Version" value="e.g. Windows Server 2022" placeholder/>
            <FieldGroup label="IP Address" value="e.g. 192.168.1.10" placeholder/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem'}}>
            <FieldGroup label="Hardware / VM" value="e.g. Dell PowerEdge R740" placeholder/>
            <FieldGroup label="Backup Schedule" value="e.g. Nightly at 2AM via Veeam" placeholder/>
          </div>
          <FieldGroup label="Installed Software / Roles" value="List all roles (AD DS, DNS, DHCP, IIS, etc.)" placeholder/>
          <FieldGroup label="Maintenance Notes" value="Known issues, patching notes..." placeholder/>
        </Accordion>
      </div>
    );

    const PoliciesPage = (
      <div>
        <BackBtn label="Back to Knowledge Base" onClick={()=>this.nav('home')}/>
        <PageHeader title="Internal Policies" subtitle="Support & Service Department procedures and policies"/>
        {[{icon:'🎫',title:'How to Create an On-Site Ticket',sub:'Step-by-step guide for logging on-site work tickets'},{icon:'📜',title:'License Management',sub:'Tracking and managing software licenses across clients'},{icon:'🏷️',title:'Asset Management',sub:'Tracking hardware assets across all clients'}].map(item=>(
          <div key={item.title} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:7,padding:'0.85rem 1rem',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.9rem',cursor:'pointer'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.navy;e.currentTarget.style.background=C.bg;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.white;}}>
            <div style={{width:32,height:32,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',background:'rgba(0,75,68,0.08)'}}>{item.icon}</div>
            <div><div style={{fontSize:'0.82rem',fontWeight:600,color:C.navy}}>{item.title}</div><div style={{fontSize:'0.7rem',color:C.sub,marginTop:2}}>{item.sub}</div></div>
            <span style={{marginLeft:'auto',color:C.muted}}>→</span>
          </div>
        ))}
      </div>
    );

    const ToolsPage = (
      <div>
        <BackBtn label="Back to Knowledge Base" onClick={()=>this.nav('home')}/>
        <PageHeader title="Tools" subtitle="Setup guides and documentation for essential IT tools"/>
        {[{icon:'🖥️',title:'RDP Setup App',sub:'Remote Desktop Protocol configuration. Installation, connection profiles, and troubleshooting.',tag:'Remote Access'},{icon:'🔐',title:'VPN Setup App',sub:'Installing, configuring, and troubleshooting the VPN client for secure remote access.',tag:'Security'},{icon:'🤖',title:'Atera RMM',sub:'Remote monitoring and management. Agent deployment, alerts, and remote access.',tag:'RMM'},{icon:'☁️',title:'Microsoft 365 Admin',sub:'Managing M365 tenants, users, licenses, and security settings for clients.',tag:'M365'}].map(item=>(
          <div key={item.title} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'1.2rem',display:'flex',gap:'1rem',alignItems:'flex-start',marginBottom:'0.7rem'}}>
            <div style={{width:44,height:44,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0,background:'rgba(0,75,68,0.08)'}}>{item.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:'0.86rem',fontWeight:700,color:C.navy,marginBottom:'0.3rem'}}>{item.title}</div>
              <div style={{fontSize:'0.76rem',color:C.sub,lineHeight:1.5}}>{item.sub}</div>
              <span style={{display:'inline-flex',alignItems:'center',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.18rem 0.5rem',borderRadius:3,background:'rgba(0,75,68,0.09)',color:C.teal,border:'1px solid rgba(0,75,68,0.18)',marginTop:'0.5rem'}}>{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    );

    const renderPage = () => {
      if (page==='client-detail' && selectedClient) return <ClientDetail client={selectedClient} onBack={()=>this.nav('clients')} onNavigate={(p)=>this.setState({page:'client-folder',treePath:p})}/>;
      if (page==='client-folder' && selectedClient) return <ClientTreePage client={selectedClient} path={treePath} onBack={()=>this.setState({page:'client-detail',treePath:[]})} onNavigate={(p)=>this.setState({treePath:p})}/>;
      if (page==='sop-detail'    && selectedSop)    return <SopDetail    sop={selectedSop}       onBack={()=>this.nav('sop')}/>;
      if (page==='clients')  return ClientsPage;
      if (page==='sop')      return SopPage;
      if (page==='networks') return NetworksPage;
      if (page==='security') return SecurityPage;
      if (page==='servers')  return ServersPage;
      if (page==='policies') return PoliciesPage;
      if (page==='tools')    return ToolsPage;
      return HomePage;
    };

    return (
      <div style={{display:'flex',flexDirection:'column',height:'100vh',fontFamily:"'DM Sans','Segoe UI',sans-serif",background:C.bg,color:C.navy,overflow:'hidden'}}>
        {/* TOPBAR */}
        <div style={{display:'flex',alignItems:'center',background:C.navy,height:60,flexShrink:0,borderBottom:'1px solid rgba(255,255,255,0.06)',position:'sticky',top:0,zIndex:200}}>
          <div onClick={()=>this.nav('home')} style={{width:240,height:60,display:'flex',alignItems:'center',padding:'0 1.4rem',borderRight:'1px solid rgba(255,255,255,0.07)',cursor:'pointer',flexShrink:0}}>
            <span style={{fontSize:'0.9rem',fontWeight:700,color:'#fff',letterSpacing:'0.02em'}}>⚙️ Club Support Inc.</span>
          </div>
          <div style={{flex:1,paddingLeft:'1.6rem',fontSize:'0.72rem',color:'#fff',letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:500}}>IT Knowledge Base</div>
        </div>

        <div style={{display:'flex',flex:1,overflow:'hidden'}}>
          {/* SIDEBAR */}
          <nav style={{width:240,background:C.navy,flexShrink:0,overflowY:'auto',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column'}}>
            <div>
              <div style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,255,255,0.45)',padding:'1.2rem 1.2rem 0.3rem'}}>Main</div>
              <NavItem icon="📚" label="Knowledge Base" active={page==='home'} onClick={()=>this.nav('home')}/>
            </div>
            <div style={{height:1,background:'rgba(255,255,255,0.07)',margin:'0.7rem 1.2rem'}}/>
            <div>
              <div style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,255,255,0.45)',padding:'0 1.2rem 0.3rem'}}>Clients</div>
              <NavItem icon="👥" label="All Clients" active={page==='clients'||page==='client-detail'||page==='client-folder'} badge="88" onClick={()=>this.nav('clients')}/>
            </div>
            <div style={{height:1,background:'rgba(255,255,255,0.07)',margin:'0.7rem 1.2rem'}}/>
            <div>
              <div style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,255,255,0.45)',padding:'0 1.2rem 0.3rem'}}>Technical</div>
              <NavItem icon="🌐" label="Networks"      active={page==='networks'} onClick={()=>this.nav('networks')}/>
              <NavItem icon="🔒" label="Security"      active={page==='security'} onClick={()=>this.nav('security')}/>
              <NavItem icon="🖥️" label="Server Guides" active={page==='servers'}  onClick={()=>this.nav('servers')}/>
            </div>
            <div style={{height:1,background:'rgba(255,255,255,0.07)',margin:'0.7rem 1.2rem'}}/>
            <div>
              <div style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(255,255,255,0.45)',padding:'0 1.2rem 0.3rem'}}>Operations</div>
              <NavItem icon="📋" label="SOPs"              active={page==='sop'||page==='sop-detail'} badge="8" onClick={()=>this.nav('sop')}/>
              <NavItem icon="📄" label="Internal Policies" active={page==='policies'} onClick={()=>this.nav('policies')}/>
              <NavItem icon="🔧" label="Tools"             active={page==='tools'}    onClick={()=>this.nav('tools')}/>
            </div>
            <div style={{padding:'1.5rem 1.2rem',fontSize:'0.6rem',color:'rgba(255,255,255,0.22)',lineHeight:1.8,marginTop:'auto'}}>
              clubsupportinc.com<br/>IT Services & Cyber Security<br/>for Clubs. Only.
            </div>
          </nav>

          {/* MAIN */}
          <main style={{flex:1,overflowY:'auto',padding:'2rem 2.5rem',background:C.bg}}>
            {renderPage()}
          </main>
        </div>
      </div>
    );
  }
}
