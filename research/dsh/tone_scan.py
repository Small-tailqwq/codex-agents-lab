import os, re, json, glob, io, collections, zstandard, sys
ROOT = os.path.expanduser('~/.dsh/sessions')
HEDGE = '还不能|尚不能|不能直接|不能证明|不能把|不能据此|不代表|并非|不能确定|不等于|不等同于|不能保证|不能仅凭|不能只凭|不能确认|不一定|不能简单|并不是|不能当作|不足以证明|只能证明|只能说明|不能认定|不意味着|不能断言|未必|不能承诺|无法证明|不构成|不能断定|不能视为|不证明|不必然|无法确认|无法确定'
JARGON = '链路|落地|兜底|口径|收口|闭环|抓手|赋能|颗粒度|对齐|心智|范式|底座|锚点'
OTHER = '你说得对|你说的对|你是对的|您说得对|确实|抱歉|好的|明白了|收到|关键在于|核心是|本质上|一句话|总结一下|总之|换句话说|值得注意的是|简单来说|说白了|不是说'
PH = (HEDGE + '|' + JARGON + '|' + OTHER).split('|')
H = re.compile(HEDGE); J = re.compile(JARGON)
NB = re.compile(r'不是[^。！？\n]{1,40}?[，,；]\s*(?:而是|是)')
CORR = re.compile(r'(不对|错了|有问题|搞错|没修好|还是不行|不是这样|理解错|胡说|不行|并没有|根本没|你又|怎么还|为什么还|乱改|别瞎|不是吧|你确定|真的吗|瞎说|又错)')

def frames(path):
    data = open(path, 'rb').read()
    out = io.BytesIO()
    r = zstandard.ZstdDecompressor().stream_reader(io.BytesIO(data), read_across_frames=True)
    try:
        while True:
            b = r.read(1 << 20)
            if not b: break
            out.write(b)
    except Exception:
        pass
    return out.getvalue().decode('utf-8', 'replace')

def content(e):
    d = e.get('data') or {}
    return d.get('content') or (d.get('message') or {}).get('content') or []
def source(e):
    d = e.get('data') or {}
    return d.get('source') or (d.get('message') or {}).get('source') or {}

stats = collections.defaultdict(lambda: {'msgs':0,'turns':0,'hedge':0,'jargon':0,'nb':0,'final':0,'final_hedge':0,'ph':collections.Counter()})
openers = collections.Counter(); corr = []; nbs = []; ctx = collections.defaultdict(list)
for path in glob.glob(os.path.join(ROOT, '**', 'session*.jsonl.zstd'), recursive=True):
    try: txt = frames(path)
    except Exception as ex: print('ERR', path, ex, file=sys.stderr); continue
    model = '?'; last_user = None; awaiting = False; turn_texts = []
    def flush():
        if turn_texts:
            s = stats[model]; s['final'] += 1
            if H.search(turn_texts[-1]): s['final_hedge'] += 1
    for line in txt.split('\n'):
        if not line.strip(): continue
        try: e = json.loads(line)
        except Exception: continue
        t = e.get('type')
        if t == 'request/header':
            cfg = ((e.get('data') or {}).get('header') or {}).get('config') or {}
            model = cfg.get('model') or model
        elif t == 'turn/start':
            flush(); turn_texts = []
        elif t == 'user/message' and source(e).get('kind') == 'user':
            last_user = ''.join(b.get('text','') for b in content(e) if isinstance(b, dict)); awaiting = True
        elif t == 'assistant/message':
            vis = ''.join(b.get('text','') for b in content(e) if isinstance(b, dict) and b.get('type') == 'text').strip()
            if not vis: continue
            s = stats[model]; s['msgs'] += 1; turn_texts.append(vis)
            if H.search(vis): s['hedge'] += 1
            if J.search(vis): s['jargon'] += 1
            for m in NB.finditer(vis):
                s['nb'] += 1
                if len(nbs) < 60: nbs.append((model, vis[max(0,m.start()-10):m.end()+40].replace('\n',' ')))
            for p in PH:
                k = vis.count(p)
                if k:
                    s['ph'][p] += k
                    if len(ctx[p]) < 6:
                        i = vis.find(p); ctx[p].append(vis[max(0,i-50):i+80].replace('\n',' '))
            if awaiting:
                awaiting = False
                if last_user and len(last_user) < 600 and CORR.search(last_user):
                    openers[re.split(r'[。，,！!：:\n]', vis, 1)[0][:24]] += 1
                    corr.append({'model': model, 'user': last_user.strip()[:240], 'reply': vis[:400]})
    flush()

for m, s in sorted(stats.items(), key=lambda x: -x[1]['msgs']):
    if s['msgs'] < 20: continue
    n = s['msgs']
    print(f"\n### {m}: msgs {n}, hedge {s['hedge']} ({s['hedge']*100//n}%), jargon {s['jargon']} ({s['jargon']*100//n}%), 不是…而是 {s['nb']}, final-turn msgs {s['final']} w/hedge {s['final_hedge']}")
    print('  ' + '  '.join(f'{p}{k}' for p, k in s['ph'].most_common(40)))
print('\n== openers after correction ==', len(corr))
for h, k in openers.most_common(30): print(k, h)
json.dump({'corr': corr, 'nb': nbs, 'ctx': ctx}, open('out.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
