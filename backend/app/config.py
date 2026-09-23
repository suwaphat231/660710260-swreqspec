import os


# ค่าการรับส่งข้อมูลเข้ารหัสรองรับ NFR-SEC-01
TLS_MIN_VERSION = "TLSv1.2"
TLS_CERT_FILE = os.getenv("TLS_CERT_FILE")
TLS_KEY_FILE = os.getenv("TLS_KEY_FILE")


def tls_is_configured() -> bool:
    """ตรวจว่า deployment ระบุ certificate และ private key สำหรับ TLS แล้ว."""
    return bool(TLS_CERT_FILE and TLS_KEY_FILE)