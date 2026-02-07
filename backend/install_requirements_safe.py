import subprocess
import sys
from pathlib import Path

req_file = Path(__file__).parent / 'requirements.txt'
if not req_file.exists():
    print('requirements.txt not found')
    sys.exit(1)

lines = [l.strip() for l in req_file.read_text(encoding='utf-8').splitlines()]
packages = [l for l in lines if l and not l.startswith('#')]
failed = []
for pkg in packages:
    print('\nInstalling:', pkg)
    res = subprocess.run([sys.executable, '-m', 'pip', 'install', pkg])
    if res.returncode != 0:
        print('Failed to install:', pkg)
        failed.append(pkg)

print('\nInstall finished.')
if failed:
    print('The following packages failed to install:')
    for f in failed:
        print('-', f)
else:
    print('All packages installed successfully.')

# exit 0 even if some failed so caller can inspect logs
sys.exit(0)
