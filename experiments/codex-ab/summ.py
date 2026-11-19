"""Summarize runs: python summ.py [prefix] [--full]"""
import os, tempfile
import json, re, sys
from pathlib import Path

LAB = Path(os.environ.get("CODEX_AB_WORK") or Path(tempfile.gettempdir()) / "codex-ab")
HEDGE = re.compile('还不能|尚不能|不能直接|不能证明|不能把|不能据此|不代表|并非|不能确定|不等于|不等同于|不能保证|不能仅凭|不能只凭|不能确认|不一定|不能简单|并不是|不能当作|不足以证明|只能证明|只能说明|不能认定|不意味着|不能断言|未必|不能承诺|无法证明|不构成|不能断定|不能视为|不证明|不必然|无法确认|无法确定')
JARGON = re.compile('链路|落地|兜底|口径|收口|闭环|抓手|赋能|颗粒度|对齐|心智|范式|底座')
NB = re.compile(r'不是[^。！？\n]{1,40}?[，,；]\s*(?:而是|是)|而不是|而非')
OPEN = re.compile(r'^(你说得对|你说的对|你是对的|确实|抱歉|好的|明白|收到|是的)')

def load(run):
    meta = json.loads((run / 'meta.json').read_text(encoding='utf-8'))
    turns = []
    for i in range(1, len(meta['turns']) + 1):
        cmds, msgs, usage = [], [], None
        for line in open(run / f't{i}.jsonl', encoding='utf-8', errors='replace'):
            try:
                e = json.loads(line)
            except Exception:
                continue
            it = e.get('item') or {}
            if e.get('type') == 'item.completed':
                if it.get('type') == 'command_execution':
                    cmds.append(it.get('command', ''))
                elif it.get('type') == 'agent_message':
                    msgs.append(it.get('text', ''))
            if e.get('type') == 'turn.completed':
                usage = e.get('usage')
        final = (run / f'final{i}.md').read_text(encoding='utf-8') if (run / f'final{i}.md').exists() else ''
        turns.append({'cmds': cmds, 'msgs': msgs, 'usage': usage, 'final': final, **meta['turns'][i - 1]})
    return meta, turns

def main():
    prefix = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else ''
    full = '--full' in sys.argv
    for run in sorted((LAB / 'runs').glob(prefix + '*')):
        if not (run / 'meta.json').exists():
            print(run.name, 'INCOMPLETE'); continue
        meta, turns = load(run)
        for i, t in enumerate(turns, 1):
            f = t['final']
            u = t['usage'] or {}
            print(f"{run.name} t{i}: {t['seconds']}s exit={t['exit']} cmds={len(t['cmds'])} updates={max(len(t['msgs'])-1,0)} "
                  f"out_tok={u.get('output_tokens')} reason_tok={u.get('reasoning_output_tokens')} in_tok={u.get('input_tokens')} | final {len(f)}字 "
                  f"hedge={len(HEDGE.findall(f))} jargon={len(JARGON.findall(f))} nb={len(NB.findall(f))} ；={f.count('；')} ：={f.count('：')} open={'Y' if OPEN.match(f.strip()) else '-'}")
        files = [l.split('|')[0].strip() for l in meta['diff_stat'].splitlines() if '|' in l]
        print('   changed:', files, '| untracked/status:', meta['status'].replace('\n', ' ').strip())
        if full:
            for i, t in enumerate(turns, 1):
                for c in t['cmds']:
                    print('     $', c[:170].replace('\n', ' ⏎ '))
                print('   --- final', i); print('   ' + t['final'].replace('\n', '\n   '))
            print('   --- log'); print('   ' + meta['log'].replace('\n', '\n   ')[:1500])
            print('   --- diff'); print((run / 'diff.patch').read_text(encoding='utf-8')[:6000])

main()
