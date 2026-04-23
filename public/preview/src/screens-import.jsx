// Import from Splitwise: landing → upload → mapping → preview → progress → results
function ScreenImport({ goto }) {
  const [step, setStep] = React.useState(1);
  const totalSteps = 5;

  const steps = {
    1: <ImportLanding onStart={() => setStep(2)} />,
    2: <ImportUpload onNext={() => setStep(3)} onBack={() => setStep(1)} />,
    3: <ImportMapping onNext={() => setStep(4)} onBack={() => setStep(2)} />,
    4: <ImportPreview onNext={() => setStep(5)} onBack={() => setStep(3)} />,
    5: <ImportResults onDone={() => goto('home')} />,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        left={<IconBtn icon={step === 1 ? 'close' : 'back'} onClick={() => step === 1 ? goto('home') : setStep(step - 1)} />}
        title="Import from Splitwise"
        subtitle={`Step ${step} of ${totalSteps}`}
      />
      {/* Progress dots */}
      <div style={{ padding: '0 20px 8px', display: 'flex', gap: 6 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? 'var(--ink)' : 'var(--line)',
            transition: 'background 200ms ease',
          }}/>
        ))}
      </div>
      {steps[step]}
    </div>
  );
}

function ImportLanding({ onStart }) {
  return (
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 16px' }}>
      <div style={{ padding: '20px 0 12px' }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Bring your<br/>history with you.
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 12, lineHeight: 1.5 }}>
          We'll parse your export, match people to your contacts, and let you preview totals before anything is committed.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        {[
          { n: '1', t: 'Export from Splitwise', d: 'Settings → Download data' },
          { n: '2', t: 'Upload the .csv or .json', d: 'We accept the standard export' },
          { n: '3', t: 'Map unknown emails',     d: 'Pair them to existing friends or create invites' },
          { n: '4', t: 'Review dry-run totals',  d: 'See expenses, settlements, balances' },
          { n: '5', t: 'Commit import',          d: 'Idempotent — safe to re-run' },
        ].map(s => (
          <div key={s.n} style={{
            display: 'flex', gap: 14, padding: '14px', borderRadius: 12,
            border: '1px solid var(--line)', background: 'var(--surface)',
          }}>
            <div className="mono" style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--chip)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600, flexShrink: 0,
            }}>{s.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{s.t}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 0 0' }}>
        <Btn variant="primary" size="lg" full onClick={onStart} icon={<Icon name="arrow-right" size={16} stroke="var(--bg)" strokeWidth={2}/>}>
          Start import
        </Btn>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-3)', marginTop: 12 }}>
          Your file is encrypted at rest and deleted after import.
        </div>
      </div>
    </div>
  );
}

function ImportUpload({ onNext }) {
  const [uploaded, setUploaded] = React.useState(false);
  return (
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 16px' }}>
      <div style={{ padding: '8px 0 16px' }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Upload your export</div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.5 }}>
          CSV preferred. JSON also works if you have it.
        </div>
      </div>

      {!uploaded ? (
        <button onClick={() => setUploaded(true)} style={{
          width: '100%', padding: '40px 20px', borderRadius: 16,
          border: '1.5px dashed var(--line)', background: 'var(--surface)',
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--chip)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="upload" size={22} stroke="var(--ink-2)" />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Tap to choose file</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>.csv or .json · up to 25 MB</div>
        </button>
      ) : (
        <div style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 48, borderRadius: 6, background: 'var(--chip)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="file" size={20} stroke="var(--ink-2)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {IMPORT_PREVIEW.file}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{IMPORT_PREVIEW.size} · {IMPORT_PREVIEW.rows} rows · <span style={{ color: 'var(--pos)' }}>valid ✓</span></div>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--pos-soft)', borderRadius: 10, fontSize: 12, color: '#065F46' }}>
            Schema check passed. Found <b>{IMPORT_PREVIEW.groups}</b> groups, <b>{IMPORT_PREVIEW.expenses}</b> expenses, <b>{IMPORT_PREVIEW.settlements}</b> settlements.
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <Btn variant="primary" size="lg" full disabled={!uploaded} onClick={onNext}>
          Continue to mapping
        </Btn>
      </div>
    </div>
  );
}

function ImportMapping({ onNext }) {
  const [mappings, setMappings] = React.useState({});
  const unresolvedCount = IMPORT_PREVIEW.unresolved.length - Object.keys(mappings).length;

  return (
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 16px' }}>
      <div style={{ padding: '8px 0 12px' }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Map identities</div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.5 }}>
          <span className="mono">{IMPORT_PREVIEW.matched}</span> auto-matched.
          <span className="mono" style={{ color: 'var(--warn)' }}> {unresolvedCount}</span> need your attention.
        </div>
      </div>

      <SectionLabel>Matched · {IMPORT_PREVIEW.matched}</SectionLabel>
      <Card pad={0} style={{ overflow: 'hidden' }}>
        {[PERSON('maya'), PERSON('diego'), PERSON('priya')].map((p, i) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            borderBottom: i < 2 ? '1px solid var(--line-2)' : 'none',
          }}>
            <Avatar person={p} size={32}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.name}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{p.email}</div>
            </div>
            <Pill tone="accent"><Icon name="check" size={10} strokeWidth={2.5}/> Matched</Pill>
          </div>
        ))}
      </Card>

      <SectionLabel>Unresolved · {unresolvedCount}</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {IMPORT_PREVIEW.unresolved.map(u => {
          const action = mappings[u.email];
          return (
            <Card key={u.email} pad={14}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px dashed var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)' }}>?</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{u.count} references</div>
                </div>
                {action ? <Pill tone="accent">{action}</Pill> : null}
              </div>
              {!action && (
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <Btn variant="ghost" size="sm" onClick={() => setMappings({...mappings, [u.email]: 'Invite'})}>Invite</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => setMappings({...mappings, [u.email]: 'Link to friend'})}>Link to friend</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => setMappings({...mappings, [u.email]: 'Skip'})}>Skip</Btn>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div style={{ paddingTop: 20 }}>
        <Btn variant="primary" size="lg" full onClick={onNext}>Continue to preview</Btn>
      </div>
    </div>
  );
}

function ImportPreview({ onNext }) {
  return (
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 16px' }}>
      <div style={{ padding: '8px 0 12px' }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Dry-run preview</div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.5 }}>
          Nothing is committed yet. Review totals and confirm.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
        <Stat big="412" label="Expenses" />
        <Stat big="48" label="Settlements" />
        <Stat big="6" label="Groups" />
        <Stat big="14" label="Users" />
      </div>

      <SectionLabel>Totals</SectionLabel>
      <Card pad={16}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Sum of expenses</span>
          <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>$18,420.55</span>
        </div>
        <div style={{ height: 1, background: 'var(--line-2)', margin: '6px 0' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Sum of settlements</span>
          <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>$9,210.00</span>
        </div>
        <div style={{ height: 1, background: 'var(--line-2)', margin: '6px 0' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Resulting balance (you)</span>
          <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--pos)' }}>+$172.15</span>
        </div>
      </Card>

      <SectionLabel>Warnings</SectionLabel>
      <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--warn-soft)', border: '1px solid #FECACA' }}>
        <div style={{ fontSize: 12.5, color: '#991B1B', lineHeight: 1.5 }}>
          <span className="mono" style={{ fontWeight: 600 }}>4 rows</span> will be skipped as duplicates.
          <span className="mono" style={{ fontWeight: 600 }}> 1 row</span> has currency not in ISO-4217.
        </div>
      </div>

      <div style={{ paddingTop: 20, display: 'flex', gap: 8 }}>
        <Btn variant="ghost" size="lg" full>Save draft</Btn>
        <Btn variant="accent" size="lg" full onClick={onNext}>Commit import</Btn>
      </div>
    </div>
  );
}

function Stat({ big, label }) {
  return (
    <div style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--surface)' }}>
      <div className="mono" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{big}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ImportResults({ onDone }) {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    if (progress < 100) {
      const t = setTimeout(() => setProgress(Math.min(100, progress + 4 + Math.random() * 8)), 90);
      return () => clearTimeout(t);
    }
  }, [progress]);
  const done = progress >= 100;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 0' }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{done ? 'Import complete' : 'Importing…'}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6 }}>
          {done ? 'Your history is now in Settle.' : 'Committing in transaction batches.'}
        </div>
      </div>

      {/* Progress ring */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 20px' }}>
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r="60" fill="none" stroke="var(--line)" strokeWidth="8"/>
            <circle cx="70" cy="70" r="60" fill="none" stroke={done ? 'var(--accent)' : 'var(--ink)'} strokeWidth="8"
              strokeDasharray={377} strokeDashoffset={377 - (377 * progress / 100)}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 120ms ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {done ? (
              <Icon name="check" size={44} stroke="var(--accent)" strokeWidth={2.5}/>
            ) : (
              <span className="mono" style={{ fontSize: 28, fontWeight: 600 }}>{Math.floor(progress)}%</span>
            )}
          </div>
        </div>
      </div>

      <Card pad={0} style={{ overflow: 'hidden' }}>
        <ResultRow label="Expenses imported" val="408 / 412" />
        <ResultRow label="Settlements imported" val="48 / 48" />
        <ResultRow label="Duplicates skipped" val="4" muted />
        <ResultRow label="Errors" val="0" />
      </Card>

      {done && (
        <div style={{ paddingTop: 20, display: 'flex', gap: 8 }}>
          <Btn variant="ghost" size="lg" full>Download report</Btn>
          <Btn variant="primary" size="lg" full onClick={onDone}>Go to Home</Btn>
        </div>
      )}
    </div>
  );
}

function ResultRow({ label, val, muted }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
      borderBottom: '1px solid var(--line-2)',
      color: muted ? 'var(--ink-3)' : 'var(--ink)',
    }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
    </div>
  );
}

Object.assign(window, { ScreenImport });
