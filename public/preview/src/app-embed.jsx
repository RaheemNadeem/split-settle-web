// Embed mode: single phone, reads `?screen=home` from the URL.
// Used by the Split Settle landing page carousel — renders one live screen
// inside the device frame with no gallery header or tweaks panel.
const { useState, useEffect } = React;

function useNav(initial = 'home', initialParams = {}) {
  const [stack, setStack] = useState([{ route: initial, params: initialParams }]);
  const current = stack[stack.length - 1];
  const goto = (route, params = {}) => setStack(s => [...s, { route, params }]);
  const reset = (route, params = {}) => setStack([{ route, params }]);
  const back = () => setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  return { current, goto, reset, back };
}

const TAB_ROUTES = new Set(['home', 'groups', 'friends', 'activity', 'account']);

function Phone({ route, params, goto, reset, onboardState }) {
  const showBottom = TAB_ROUTES.has(route);
  const screen = (() => {
    switch (route) {
      case 'signin':          return <ScreenSignIn onDone={() => reset('home', { welcomeBack: true })} onSignUp={() => reset('signup')} onForgot={() => reset('forgot')} />;
      case 'welcomeBack':     return <ScreenWelcomeBack onDone={() => reset('home', { welcomeBack: true })} onSwitch={() => reset('signin')} />;
      case 'signup':          return <ScreenSignUp goto={(r, p) => reset(r, p)} onSignIn={() => reset('signin')} />;
      case 'verifyEmail':     return <ScreenVerifyEmail email={params.email} goto={(r, p) => reset(r, p)} />;
      case 'forgot':          return <ScreenForgotPassword goto={(r, p) => reset(r, p)} />;
      case 'resetLinkSent':   return <ScreenResetLinkSent email={params.email} goto={(r, p) => reset(r, p)} />;
      case 'resetPassword':   return <ScreenResetPassword email={params.email} goto={(r, p) => reset(r, p)} />;
      case 'passwordChanged': return <ScreenPasswordChanged goto={(r, p) => reset(r, p)} />;
      case 'onboard':         return <ScreenOnboard step={onboardState.step} setStep={onboardState.setStep} invited={onboardState.invited} setInvited={onboardState.setInvited} onDone={() => reset('home')} />;
      case 'profile':         return <ScreenProfile onDone={() => reset('home')} />;
      case 'home':            return <ScreenHome goto={goto} welcomeBack={params.welcomeBack}/>;
      case 'groups':          return <ScreenGroupsList goto={goto} />;
      case 'activity':        return <ScreenActivity goto={goto} />;
      case 'friends':         return <ScreenFriends goto={goto} />;
      case 'account':         return <ScreenAccount goto={goto} />;
      case 'friend':          return <ScreenFriend friendId={params.friendId || 'maya'} goto={goto} />;
      case 'group':           return <ScreenGroup groupId={params.groupId || 'g-lisbon'} goto={goto} />;
      case 'expense':         return <ScreenExpense expenseId={params.expenseId || 'e1'} goto={goto} />;
      case 'add':             return params.peerId ? <ScreenAddExpensePeer peerId={params.peerId} goto={goto} /> : <ScreenAddExpense goto={goto} ctx={params} />;
      case 'simplify':        return <ScreenSimplify groupId={params.groupId || 'g-lisbon'} goto={goto} />;
      case 'record':          return <ScreenRecord groupId={params.groupId || 'g-lisbon'} goto={goto} />;
      case 'import':          return <ScreenImport goto={goto} />;
      case 'addPicker':       return <ScreenAddPicker goto={goto} />;
      case 'invite':          return <ScreenInvite goto={goto} />;
      case 'editExpense':     return <ScreenEditExpense expenseId={params.expenseId || 'e1'} goto={goto} />;
      case 'deleteExpense':   return <ScreenDeleteExpense expenseId={params.expenseId || 'e1'} goto={goto} />;
      case 'error':           return <ScreenError goto={goto} kind={params.kind || 'generic'} />;
      default:                return <ScreenHome goto={goto} />;
    }
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <StatusBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {screen}
      </div>
      {showBottom && <BottomNav active={route} onChange={tab => reset(tab)} />}
      <GestureBar />
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{
      height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 18px', flexShrink: 0, position: 'relative',
    }}>
      <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>9:30</span>
      <div style={{ position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: 100, background: '#0B0F14' }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 13.3L.67 5.97a10.37 10.37 0 0114.66 0L8 13.3z" fill="currentColor"/></svg>
        <svg width="14" height="14" viewBox="0 0 16 16"><path d="M14.67 14.67V1.33L1.33 14.67h13.34z" fill="currentColor"/></svg>
        <div style={{ width: 20, height: 10, border: '1.2px solid currentColor', borderRadius: 2, padding: 1.2, position: 'relative' }}>
          <div style={{ width: '72%', height: '100%', background: 'currentColor', borderRadius: 1 }}/>
          <div style={{ position: 'absolute', right: -3, top: 2.2, width: 2, height: 3.6, background: 'currentColor', borderRadius: 1 }}/>
        </div>
      </div>
    </div>
  );
}

function GestureBar() {
  return (
    <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: 110, height: 4, borderRadius: 2, background: '#0B0F14', opacity: 0.6 }}/>
    </div>
  );
}

function ScreenGroupsList({ goto }) {
  const [scrolled, setScrolled] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar title="Groups" right={<IconBtn icon="plus" onClick={() => goto('newGroup')}/>} scrolled={scrolled}/>
      <div className="screen-scroll" onScroll={e => setScrolled(e.target.scrollTop > 2)} style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GROUPS.map(g => (
            <Card key={g.id} pad={16} onClick={() => goto('group', { groupId: g.id })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: g.net >= 0 ? 'var(--pos-soft)' : 'var(--warn-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: g.net >= 0 ? '#065F46' : '#991B1B',
                  fontWeight: 700, fontSize: 15, letterSpacing: 0.5,
                }} className="mono">
                  {g.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{g.sub}</div>
                  <div style={{ marginTop: 8 }}><AvatarStack ids={g.members} size={22}/></div>
                </div>
                <Money value={g.net} currency={g.base} size={15} weight={600} colorize signed/>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenAccount({ goto }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar title="Account"/>
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 20px' }}>
        <Card pad={18}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 600,
            }}>AR</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Alex Rivera</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>alex.rivera@gmail.com</div>
              <div style={{ marginTop: 6 }}><Pill tone="accent">USD · Default</Pill></div>
            </div>
          </div>
        </Card>
        <SectionLabel>Data</SectionLabel>
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <AccountRow label="Import from Splitwise" hint="CSV or JSON" onClick={() => goto('import')}/>
          <AccountRow label="Export your data" hint="CSV"/>
          <AccountRow label="Simplify debts" hint="On" last/>
        </Card>
        <SectionLabel>Preferences</SectionLabel>
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <AccountRow label="Notifications" hint="Email + push"/>
          <AccountRow label="Default currency" hint="USD"/>
          <AccountRow label="Appearance" hint="System" last/>
        </Card>
        <div style={{ marginTop: 20 }}>
          <Btn variant="ghost" full>Sign out</Btn>
        </div>
        <div className="mono" style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-3)', marginTop: 18, letterSpacing: 1 }}>
          SETTLE v0.9.0
        </div>
      </div>
    </div>
  );
}

function AccountRow({ label, hint, onClick, last }) {
  return (
    <div onClick={onClick} style={{
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: last ? 'none' : '1px solid var(--line-2)', cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{hint}</div>
      </div>
      <Icon name="arrow-right" size={16} stroke="var(--ink-3)"/>
    </div>
  );
}

function DeviceFrame({ children, width = 390, height = 820 }) {
  return (
    <div style={{
      width: width + 18, height: height + 18, padding: 9,
      borderRadius: 48, background: '#202A38',
      boxShadow: '0 30px 60px -10px rgba(11, 15, 20, 0.35), 0 2px 0 #2A3240 inset',
    }}>
      <div style={{
        width, height, borderRadius: 40, overflow: 'hidden',
        background: 'var(--bg)', position: 'relative', color: 'var(--ink)',
      }}>
        {children}
      </div>
    </div>
  );
}

function parseStartRoute() {
  const usp = new URLSearchParams(window.location.search);
  const screen = usp.get('screen') || 'home';
  const groupId = usp.get('groupId') || undefined;
  const friendId = usp.get('friendId') || undefined;
  const expenseId = usp.get('expenseId') || undefined;
  const peerId = usp.get('peerId') || undefined;
  const email = usp.get('email') || undefined;
  const params = {};
  if (groupId) params.groupId = groupId;
  if (friendId) params.friendId = friendId;
  if (expenseId) params.expenseId = expenseId;
  if (peerId) params.peerId = peerId;
  if (email) params.email = email;
  return { screen, params };
}

function App() {
  const { screen: startRoute, params: startParams } = parseStartRoute();
  const [tweaks] = useState(window.__TWEAKS);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--pos', `oklch(0.58 ${tweaks.chroma} ${tweaks.accentHue})`);
    r.style.setProperty('--pos-soft', `oklch(0.95 ${Math.min(0.06, tweaks.chroma * 0.3)} ${tweaks.accentHue})`);
    r.style.setProperty('--warn', `oklch(0.58 ${tweaks.chroma + 0.06} ${tweaks.warnHue})`);
    r.style.setProperty('--warn-soft', `oklch(0.96 ${Math.min(0.05, tweaks.chroma * 0.25)} ${tweaks.warnHue})`);
  }, [tweaks]);

  // Scale the 408x838 device down to fit whatever viewport the parent iframe gives us.
  useEffect(() => {
    const FRAME_W = 408;
    const FRAME_H = 838;
    const apply = () => {
      const scale = Math.min(window.innerWidth / FRAME_W, window.innerHeight / FRAME_H, 1.4);
      document.documentElement.style.setProperty('--device-scale', String(scale));
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  const { current, goto, reset } = useNav(startRoute, startParams);
  const [obStep, setObStep] = useState(0);
  const [obInvited, setObInvited] = useState([]);
  const onboardState = { step: obStep, setStep: setObStep, invited: obInvited, setInvited: setObInvited };

  return (
    <div className="device-fit">
      <DeviceFrame>
        <Phone route={current.route} params={current.params} goto={goto} reset={reset} onboardState={onboardState}/>
      </DeviceFrame>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
