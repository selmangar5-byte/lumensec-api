import time, json, hmac, hashlib, subprocess, os

TENANT_ID = os.environ.get("TENANT_ID")
SECRET = os.environ.get("SECRET")
EVENT_ID = os.environ.get("EVENT_ID", "evt_001")

if not TENANT_ID or not SECRET:
    raise SystemExit("Missing TENANT_ID or SECRET env vars")

ts = str(int(time.time()))
body = json.dumps(
    {"source": "google-ai-studio", "event_id": EVENT_ID, "payload": {"hello": "lumensec"}},
    separators=(",", ":"),
)
sig = hmac.new(SECRET.encode(), f"{ts}.{body}".encode(), hashlib.sha256).hexdigest()

cmd = [
    "curl", "-i", "http://localhost:3000/ingest/webhook",
    "-H", "Content-Type: application/json",
    "-H", f"X-Lumensec-Tenant-Id: {TENANT_ID}",
    "-H", f"X-Lumensec-Timestamp: {ts}",
    "-H", f"X-Lumensec-Signature: {sig}",
    "-d", body,
]
subprocess.run(cmd, check=False)
