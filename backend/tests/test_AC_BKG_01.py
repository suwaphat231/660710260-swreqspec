# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from tests.conftest import AUTH
from app.db.models import Booking


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_1_successful_booking(client, db, make_slot):
    # Given ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then ตรวจว่าบันทึกการจองสำเร็จ
    assert res.status_code == 201
    booking = db.query(Booking).filter_by(slot_id=slot.id).one()
    assert booking.id == res.json()["booking_id"]
    # Then แสดงหมายเลขคิว (รอ Q-02)
    # Then ที่นั่งว่างของช่วง 09.00 น. เป็น 0
    db.refresh(slot)
    assert slot.remaining == 0


def test_TC_BKG_01_2_full_slot(client, db, make_slot):
    # Given ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 0 ที่
    slot = make_slot(start="09:00", remaining=0)

    # When ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then แจ้งว่า "ช่วงเวลาเต็ม"
    assert res.status_code == 409
    assert res.json()["detail"] == "ช่วงเวลาเต็ม"
    # Then เสนอช่วงเวลาที่ยังว่างไม่เกิน 3 ตัวเลือกที่ใกล้เวลาที่เลือกที่สุด
    # ภายในวันเดียวกันและวันถัดไป 1 วัน
    assert len(res.json().get("suggested_slots", [])) <= 3
    # Then ไม่สร้างรายการจอง
    assert db.query(Booking).filter_by(slot_id=slot.id).count() == 0


def test_TC_BKG_01_3_unauthenticated_booking(client, db, make_slot):
    # Given ยังไม่ได้ยืนยันตัวตน และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id})

    # Then ต้องไม่เข้าถึงข้อมูลผู้รับบริการก่อนมีผลยืนยันตัวตนตาม IF-IDP-01
    assert res.status_code == 401
    assert db.query(Booking).count() == 0
    # Then รูปแบบ response และข้อความแจ้งเตือนไม่ได้ระบุใน spec
