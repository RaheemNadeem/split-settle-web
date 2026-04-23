// 1:1 friend thread (individual expense sharing, not a group)
function ScreenFriend({ friendId, goto }) {
  const friend = PERSON(friendId) || PERSON('maya');
  const [scrolled, setScrolled] = React.useState(false);

  // Empty-state branch: new friend, no expenses yet
  const hasHistory = friendId !== 'new';

  const expenses = hasHistory ? [
    { id: 'fe1', title: 'Brunch at Pastelaria', payer: 'me',   amount: 48.60, date: 'Apr 17', cat: 'Food',    currency: 'EUR', yourShare: 24.30 },
    { id: 'fe2', title: 'Taxi home',            payer: friendId, amount: 14.80, date: 'Apr 15', cat: 'Transit', currency: 'EUR', yourShare: 7.40 },
    { id: 'fe3', title: 'Concert tickets',      payer: 'me',   amount: 120.00,date: 'Apr 12', cat: 'Other',   currency: 'EUR', yourShare: 60.00 },
  ] : [];

  // Your net with this friend
  const net = expenses.reduce((s, e) => {
    const share = e.yourShare;
    return e.payer === 'me' ? s + (e.amount - share) : s - share;
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        left={<IconBtn icon="back" onClick={() => goto('friends')}/>}
        right={<IconBtn icon="more"/>}
      />

      {/* Friend header */}
      <div style={{ padding: '0 20px 16px', textAlign: 'center', background: 'var(--surface)', borderBottom: '1px solid var(--line-2)' }}>
        <Avatar person={friend} size={72}/>
        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 10, letterSpacing: '-0.01em' }}>{friend.name}</div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{friend.email}</div>

        {hasHistory && (() => {
          const bals = (typeof FRIEND_BALANCES !== 'undefined' && FRIEND_BALANCES[friendId]) || [];
          const first = bals[0];
          const fallback = { code: 'EUR', symbol: '€', net };
          const display = bals.length ? bals : [fallback];
          return (
            <div style={{
              marginTop: 18, padding: '14px 16px', borderRadius: 14,
              background: 'var(--surface-2)', border: '1px solid var(--line-2)',
            }}>
              <div className="mono" style={{
                fontSize: 10, letterSpacing: 1.5, fontWeight: 600, color: 'var(--ink-3)',
                textAlign: 'left',
              }}>
                BALANCE · PER CURRENCY
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                {display.map(b => {
                  const frac = (b.code === 'INR' || b.code === 'JPY') ? 0 : 2;
                  const you = b.net > 0;
                  const first = friend.name.split(' ')[0];
                  return (
                    <div key={b.code} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10,
                      background: you ? 'var(--pos-soft)' : 'var(--warn-soft)',
                    }}>
                      <span className="mono" style={{
                        fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
                        width: 34, textAlign: 'left',
                        color: you ? '#047857' : '#991B1B',
                      }}>{b.code}</span>
                      <span style={{
                        flex: 1, fontSize: 12, textAlign: 'left',
                        color: 'var(--ink-2)', fontWeight: 500,
                      }}>
                        {you ? `${first} owes you` : `you owe ${first}`}
                      </span>
                      <span className="mono" style={{
                        fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em',
                        color: 'var(--ink)',
                      }}>
                        {b.symbol}{Math.abs(b.net).toFixed(frac)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
                <Btn size="sm" variant="primary" onClick={() => goto('add', { peerId: friendId })} icon={<Icon name="plus" size={14} stroke="var(--bg)" strokeWidth={2}/>}>Add expense</Btn>
                <Btn size="sm" variant="ghost" onClick={() => goto('record', { peerId: friendId })}>Settle up</Btn>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="screen-scroll" onScroll={e => setScrolled(e.target.scrollTop > 2)} style={{ flex: 1, overflowY: 'auto' }}>
        {!hasHistory ? (
          <EmptyFriendState friend={friend} onAdd={() => goto('add', { peerId: friendId })}/>
        ) : (
          <>
            <SectionLabel>Shared expenses</SectionLabel>
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {expenses.map(e => (
                <FriendExpenseRow key={e.id} e={e} friend={friend} onClick={() => goto('expense', { expenseId: e.id })}/>
              ))}
            </div>
            <div style={{ height: 16 }}/>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyFriendState({ friend, onAdd }) {
  return (
    <div style={{ padding: '40px 28px 24px', textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18, background: 'var(--chip)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 18px', color: 'var(--ink-3)',
      }}>
        <Icon name="plus" size={30} strokeWidth={1.6}/>
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>
        You and {friend.name.split(' ')[0]} haven't shared anything yet.
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.5 }}>
        Add the first expense between just the two of you — no group needed.
      </div>
      <div style={{ marginTop: 24 }}>
        <Btn variant="primary" size="lg" full onClick={onAdd} icon={<Icon name="plus" size={16} stroke="var(--bg)" strokeWidth={2}/>}>
          Add first expense
        </Btn>
      </div>

      {/* Idea pills */}
      <div style={{ marginTop: 26 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>Try logging</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          {['Dinner out', 'Shared Uber', 'Groceries', 'Movie tickets', 'Hotel'].map(s => (
            <button key={s} onClick={onAdd} style={{
              padding: '8px 12px', borderRadius: 100, border: '1px solid var(--line)',
              background: 'var(--surface)', color: 'var(--ink-2)', fontSize: 12,
              fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FriendExpenseRow({ e, friend, onClick }) {
  const youPaid = e.payer === 'me';
  const delta = youPaid ? e.amount - e.yourShare : -e.yourShare;
  return (
    <div onClick={onClick} style={{
      padding: 14, background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div className="mono" style={{ width: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.5 }}>{e.date.split(' ')[0].toUpperCase()}</div>
        <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.1 }}>{e.date.split(' ')[1]}</div>
      </div>
      <div style={{ width: 1, height: 32, background: 'var(--line)' }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{e.title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>
          {youPaid ? 'You' : friend.name.split(' ')[0]} paid <span className="mono">€{e.amount.toFixed(2)}</span> · split equal
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>
          {delta >= 0 ? 'You lent' : 'You owe'}
        </div>
        <Money value={delta} currency={e.currency} size={13} weight={600} colorize signed/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1:1-aware Add expense (simpler than group version)
// ─────────────────────────────────────────────────────────────
function ScreenAddExpensePeer({ peerId, goto }) {
  const peer = PERSON(peerId) || PERSON('maya');
  const [amount, setAmount] = React.useState('48.60');
  const [title, setTitle] = React.useState('');
  const [payer, setPayer] = React.useState('me');
  const [splitMode, setSplitMode] = React.useState('equal'); // equal · you-full · they-full · custom
  const [customYou, setCustomYou] = React.useState(30);
  const [currency, setCurrency] = React.useState('EUR');
  const [cat, setCat] = React.useState('Food');

  const amt = parseFloat(amount) || 0;
  let yourShare = amt / 2;
  let theirShare = amt / 2;
  if (splitMode === 'you-full') { yourShare = amt; theirShare = 0; }
  if (splitMode === 'they-full') { yourShare = 0; theirShare = amt; }
  if (splitMode === 'custom') { yourShare = (amt * customYou) / 100; theirShare = amt - yourShare; }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <TopBar
        left={<IconBtn icon="close" onClick={() => goto('friend', { friendId: peerId })}/>}
        title="New expense"
        subtitle={`with ${peer.name.split(' ')[0]}`}
        right={<Btn size="sm" variant="primary" onClick={() => goto('friend', { friendId: peerId })}>Save</Btn>}
      />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 16px' }}>

        {/* Who's involved — always you + peer for 1:1 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
          padding: '16px 0 12px', borderBottom: '1px solid var(--line-2)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <Avatar person={ME} size={44}/>
            <div style={{ fontSize: 11, marginTop: 6, fontWeight: 600 }}>You</div>
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: 1 }}>+</div>
          <div style={{ textAlign: 'center' }}>
            <Avatar person={peer} size={44}/>
            <div style={{ fontSize: 11, marginTop: 6, fontWeight: 600 }}>{peer.name.split(' ')[0]}</div>
          </div>
        </div>

        {/* Amount hero */}
        <div style={{ padding: '20px 0 16px', textAlign: 'center', borderBottom: '1px solid var(--line-2)', marginBottom: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
            <select value={currency} onChange={e => setCurrency(e.target.value)} style={{
              border: 'none', background: 'transparent', fontSize: 24, fontWeight: 500,
              color: 'var(--ink-3)', cursor: 'pointer', outline: 'none',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {['USD','EUR','GBP','JPY'].map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              value={amount} onChange={e => setAmount(e.target.value)} className="mono"
              style={{
                border: 'none', background: 'transparent', outline: 'none',
                fontSize: 60, fontWeight: 600, letterSpacing: '-0.03em',
                width: 220, textAlign: 'left', color: 'var(--ink)',
              }}
            />
          </div>
        </div>

        <Field label="Description">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Brunch at Pastelaria" style={inputStyle}/>
        </Field>

        <Field label="Paid by">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { id: 'me', p: ME, label: 'You' },
              { id: peerId, p: peer, label: peer.name.split(' ')[0] },
            ].map(opt => {
              const on = payer === opt.id;
              return (
                <button key={opt.id} onClick={() => setPayer(opt.id)} style={{
                  padding: '12px 12px', borderRadius: 12,
                  border: `1px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                  background: on ? 'var(--ink)' : 'var(--surface)',
                  color: on ? 'var(--bg)' : 'var(--ink)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <Avatar person={opt.p} size={26}/>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Split">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {[
              { id: 'equal',     label: 'Equal 50 / 50',           icon: 'equals' },
              { id: 'you-full',  label: `You paid for ${peer.name.split(' ')[0]}`, icon: 'arrow-right' },
              { id: 'they-full', label: `${peer.name.split(' ')[0]} paid for you`, icon: 'arrow-right' },
              { id: 'custom',    label: 'Custom split',            icon: 'percent' },
            ].map(m => {
              const on = splitMode === m.id;
              return (
                <button key={m.id} onClick={() => setSplitMode(m.id)} style={{
                  padding: '12px 12px', borderRadius: 12, textAlign: 'left',
                  border: `1px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                  background: on ? 'var(--ink)' : 'var(--surface)',
                  color: on ? 'var(--bg)' : 'var(--ink)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <Icon name={m.icon} size={15} stroke="currentColor" strokeWidth={1.8}/>
                  <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 8, lineHeight: 1.3 }}>{m.label}</div>
                </button>
              );
            })}
          </div>

          {splitMode === 'custom' && (
            <div style={{ marginTop: 12, padding: '14px', borderRadius: 12, background: 'var(--chip)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>You pay</span>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{customYou}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                value={customYou} onChange={e => setCustomYou(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--ink)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>
          )}

          {/* Live preview */}
          <div style={{
            marginTop: 12, padding: '12px 14px', borderRadius: 10,
            background: 'var(--surface)', border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar person={ME} size={22}/>
              <span style={{ fontSize: 12, fontWeight: 500 }}>You</span>
              <span className="mono" style={{ fontSize: 13, fontWeight: 600, marginLeft: 'auto' }}>€{yourShare.toFixed(2)}</span>
            </div>
          </div>
          <div style={{
            marginTop: 6, padding: '12px 14px', borderRadius: 10,
            background: 'var(--surface)', border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Avatar person={peer} size={22}/>
            <span style={{ fontSize: 12, fontWeight: 500 }}>{peer.name.split(' ')[0]}</span>
            <span className="mono" style={{ fontSize: 13, fontWeight: 600, marginLeft: 'auto' }}>€{theirShare.toFixed(2)}</span>
          </div>
        </Field>

        <Field label="Category">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Food','Transit','Lodging','Groceries','Drinks','Other'].map(c => {
              const on = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '8px 12px', borderRadius: 100,
                  border: `1px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                  background: on ? 'var(--ink)' : 'var(--surface)',
                  color: on ? 'var(--bg)' : 'var(--ink-2)',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                }}>{c}</button>
              );
            })}
          </div>
        </Field>

        <Field label="When">
          <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-2)' }}>
            <Icon name="calendar" size={16} stroke="var(--ink-3)"/>
            <span>Today · Apr 17, 2026</span>
          </div>
        </Field>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenFriend, ScreenAddExpensePeer });
