import time, sys, json
from danmu import DanMuClient

def out(p):
    sys.stdout.write(json.dumps(p) + "\n")
    sys.stdout.flush()

dmc = DanMuClient(sys.argv[1])
if not dmc.isValid(): print('Url invalid')

@dmc.danmu
def danmu_fn(msg):
    out({'type': 'danmu', 'data': msg})

@dmc.gift
def gift_fn(msg):
    out({'type': 'gift', 'data': msg})

@dmc.other
def other_fn(msg):
    out({'type': 'other', 'data': msg})

dmc.start(blockThread = True)