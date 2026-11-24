#!/usr/bin/env python3
"""Verify recovered theory resources against repository bytes, without login bypass."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import sys
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
BASE = sys.argv[1].rstrip('/')
OUTPUT = Path(sys.argv[2])
rows = [r for r in json.loads((ROOT / 'docs/theory-image-recovery/recovery.json').read_text()) if 'path' in r]
for p in (ROOT / 'content/theory/assets/it-ptitsa').glob('*.png'):
    rows.append({'path': str(p.relative_to(ROOT)), 'lesson': 'supplied pilot'})

def check(row):
    path = row['path']
    url = BASE + '/' + path.replace('content/', 'course/', 1)
    result = {'lesson': row['lesson'], 'path': path, 'url': url}
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            data = response.read()
            result.update(status=response.status, mime=response.headers.get('Content-Type'), bytes=len(data), sha256=hashlib.sha256(data).hexdigest())
        result['matches'] = data == (ROOT / path).read_bytes()
        result['image_mime'] = result['mime'].startswith('image/')
    except Exception as exc:
        result.update(matches=False, error=str(exc))
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(check, rows))
OUTPUT.write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
print(len(results), 'files;', sum(r.get('matches', False) and r.get('image_mime', False) for r in results), 'matching images')
sys.exit(0 if all(r.get('matches') and r.get('image_mime') for r in results) else 1)
