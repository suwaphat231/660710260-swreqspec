# Plan: จองคิวตรวจสุขภาพ (Booking)

Spec ID: SPEC-BKG-001 | Status: Draft v1 | Updated: 2569-09-16

## 1. สรุปแนวทาง (5 บรรทัด)

ฟีเจอร์นี้จะสร้างระบบจองคิวตรวจสุขภาพให้ผู้รับบริการที่ยืนยันตัวตนแล้วเลือกแพ็กเกจ วัน และช่วงเวลา เพื่อรับหมายเลขคิวแบบไม่รอส่ง SMS/LINE เสร็จสิ้น
ระบบจะคำนวณช่วงเวลาว่างแบบ real-time จากคิวที่ยืนยันแล้วจริง และป้องกันการจองซ้ำด้วยการตรวจสอบคิวค้างในวันเดียวกัน
เมื่อช่วงเวลาถูกจองเต็ม จะให้แสดงข้อความ “ช่วงเวลาเต็ม” พร้อม 3 ตัวเลือกที่ใกล้เคียง และหากการส่งข้อความยืนยันล้มเหลว เช่น timeout จะยังคงบันทึกการจองและนำกลับไป retry
การออกแบบจะยึด spec และ assumptions ที่ชัดเจนแล้ว โดยคง Open Question สำหรับเรื่องการเริ่มนับหมายเลขคิวให้รอคำตอบจากเจ้าหน้าที่เวชระเบียน

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| React (Vite) | ทีมเลือกเอง ไม่ได้มาจาก spec | สำหรับหน้าจอเลือกแพ็กเกจ/วัน/ช่วงเวลาและแสดงข้อความเต็ม |
| Python FastAPI | ทีมเลือกเอง ไม่ได้มาจาก spec | สำหรับ API จองคิว การคำนวณช่วงเวลาว่าง และ retry notification |
| MySQL | CON-TECH-01 | ใช้ตามมาตรฐานฝ่าย IT ของโรงพยาบาล |
| Background worker / queue retry | IF-NOT-01, NFR-REL-02 | ใช้สำหรับ re-send notification เมื่อ timeout หรือ failure |
| Audit log table | DOM-PDPA-01 | บันทึกผู้เข้าถึง เวลา และรหัสผู้รับบริการ ไว้เก็บอย่างน้อย 1 ปี |

## 3. โมเดลข้อมูล

| Entity | ฟิลด์หลัก | รองรับ FR / Constraint |
|---|---|---|
| Booking | booking_id, patient_ref, hn, package_id, booking_date, slot_id, queue_number, status, created_at, updated_at | FR-BKG-02, FR-BKG-04, FR-BKG-05, DOM-PDPA-01 |
| SlotAvailability | slot_id, date, time_slot, capacity, remaining_seats | FR-BKG-01, FR-BKG-03, FR-BKG-06 |
| BookingAuditLog | log_id, accessed_by, accessed_at, patient_ref, action | DOM-PDPA-01 |
| NotificationRequest | notification_id, booking_id, channel, status, retry_count, next_retry_at | FR-BKG-05, NFR-REL-02, IF-NOT-01 |
| PatientIdentity | patient_ref, hn, verified_at | IF-IDP-01, IF-HIS-01 |

หมายเหตุ: จะไม่เก็บเลขบัตรประชาชนในตารางการจอง และจะอ้างอิงภายในระบบด้วย HN ตาม IF-HIS-01

## 4. API / หน้าจอ

- GET /api/booking/slots?packageId=&dateRange=30d  -> แสดงช่วงเวลาว่าง 30 วันพร้อมจำนวนที่นั่งคงเหลือ; รองรับ FR-BKG-01
- GET /api/booking/slots?packageId=&selectedDate=&selectedSlot=  -> คำนวณช่วงเวลาว่างใหม่เมื่อแพ็กเกจเปลี่ยน; รองรับ FR-BKG-06
- POST /api/booking/validate  -> ตรวจสอบคิวค้างในวันเดียวกันและ validate ก่อนยืนยัน; รองรับ FR-BKG-02
- POST /api/booking/confirm  -> ยืนยันการจองและสร้าง booking; รองรับ FR-BKG-04, ASM-07
- POST /api/booking/notify/retry  -> ส่งซ้ำข้อความแจ้งเตือนเมื่อ failure/timeout; รองรับ FR-BKG-05, NFR-REL-02
- หน้า BookingSelection -> เลือกแพ็กเกจ วัน และช่วงเวลา, แสดงจำนวนที่นั่งคงเหลือ; รองรับ FR-BKG-01, FR-BKG-03
- หน้า BookingResult -> แสดงหมายเลขคิวและสถานะการส่งข้อความ; รองรับ FR-BKG-04, FR-BKG-05

## 5. ตารางตรวจ Constraints

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| CON-TECH-01 | MySQL ใช้เป็นฐานข้อมูลหลักสำหรับ booking, availability และ audit log | ใช้แล้ว |
| DOM-PDPA-01 | BookingAuditLog, เก็บผู้เข้าถึง เวลา และรหัสผู้รับบริการ ไว้เก็บไม่น้อยกว่า 1 ปี | ใช้แล้ว |
| IF-IDP-01 | ขั้นตอนเริ่มต้นต้องยืนยันตัวตนก่อนเข้าถึงข้อมูลผู้รับบริการ | ใช้แล้ว |
| IF-HIS-01 | PatientIdentity ใช้ HN ในระบบภายใน และไม่เก็บเลขบัตรประชาชนใน Booking | ใช้แล้ว |
| IF-NOT-01 | NotificationRequest ใช้ asynchronous ส่งข้อความยืนยันแบบ SMS/LINE และไม่ให้จองรอส่งเสร็จ | ใช้แล้ว |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-BKG-01 | test_AC_BKG_01_booking_success_reduces_seat | ระบุ slot ที่มีที่นั่ง 1 ที่แล้วยืนยัน booking; ตรวจว่า booking บันทึกสำเร็จ และ remaining_seats เป็น 0 |
| AC-BKG-02 | test_AC_BKG_02_reject_duplicate_same_day_booking | สร้าง booking ที่ยังไม่ใช้ในวันเดียวกันแล้วลองจองใหม่ในวันเดียวกัน; ต้องปฏิเสธและแสดงหมายเลขคิวเดิม |
| AC-BKG-03 | test_AC_BKG_03_full_slot_shows_alternatives | ทำให้ slot เต็ม ระหว่างการยืนยันแล้วตรวจว่า UI แสดงข้อความ “ช่วงเวลาเต็ม” และ 3 ตัวเลือกที่ใกล้เคียง |
| AC-BKG-04 | test_AC_BKG_04_notification_timeout_keeps_booking | จำลอง SMS/LINE timeout แล้วยืนยัน booking; ตรวจว่าการจองยังบันทึกและมี queue retry ภายใน 5 นาที |
| AC-BKG-05 | test_AC_BKG_05_slot_lookup_p95_under_2s | Mock ผู้ใช้พร้อมกัน 200 คน แล้วตรวจว่า p95 ของ response <= 2 วินาที |
| AC-BKG-06 | test_AC_BKG_06_audit_log_written | เปิดดูข้อมูลการจองของผู้รับบริการและตรวจว่า audit log บันทึก ผู้เข้าถึง เวลา และรหัสผู้รับบริการ |

## 7. ลำดับงาน

1. กำหนด schema ของ Booking, SlotAvailability, NotificationRequest, AuditLog และ PatientIdentity; รองรับ FR-BKG-01, FR-BKG-04, DOM-PDPA-01
2. สร้าง API ดึงข้อมูล slot ทั้ง 30 วันและคำนวณ remaining seats จากคิวที่ยืนยันแล้วจริง; รองรับ FR-BKG-01, AC-BKG-05
3. สร้าง validation logic สำหรับคิวที่ยังไม่ได้ใช้ในวันเดียวกันและปฏิเสธการจองซ้ำ; รองรับ FR-BKG-02, AC-BKG-02
4. สร้าง flow สำหรับช่วงเวลาที่เต็ม ให้แสดงข้อความและเสนอ 3 ตัวเลือกที่ใกล้เคียง; รองรับ FR-BKG-03, AC-BKG-03
5. สร้าง transaction confirmation flow เพื่อบันทึก booking, ตัดจำนวนที่นั่ง และออกหมายเลขคิวต่อเนื่อง; รองรับ FR-BKG-04, ASM-04, ASM-07, AC-BKG-01
6. สร้าง notification sender แบบ asynchronous และ retry queue สำหรับ timeout/failure; รองรับ FR-BKG-05, NFR-REL-02, AC-BKG-04
7. สร้าง UX สำหรับแพ็กเกจเปลี่ยนและคำนวณ slot ใหม่ทันที; รองรับ FR-BKG-06
8. เพิ่ม audit log และตรวจสอบสิทธิ์การเข้าถึงข้อมูลผู้รับบริการ; รองรับ DOM-PDPA-01, IF-IDP-01, IF-HIS-01, AC-BKG-06

## 8. สิ่งที่ยังไม่ทำ

- Q-01: หมายเลขคิวเริ่มนับจากช่วงเวลาใด และมีการรีเซ็ตตามรอบบริการหรือไม่? -> ยังไม่สร้าง logic ที่เกี่ยวข้องกับข้อนี้จนกว่าจะได้รับคำตอบจากเจ้าหน้าที่เวชระเบียน
- ส่วนที่เกี่ยวข้องกับการกำหนดรูปแบบหมายเลขคิวแบบช่วงเวลาเริ่มต้น/รีเซ็ตจะยังไม่เสร็จจนกว่าจะได้คำตอบจาก Q-01

## 9. สรุปผลลัพธ์ที่คาดหวัง

เมื่อตั้งระบบตาม plan นี้ ทีมจะสามารถสร้างฟีเจอร์จองคิวตรวจสุขภาพที่ตรงกับ spec ได้โดยมีความชัดเจนเรื่อง availability, duplicate booking prevention, notification retry และ auditability โดยไม่เกินขอบเขตที่กำหนดไว้ใน spec

---

# Prompt log

## [2569-09-16] [10:15] คำสั่ง: /plan

- เครื่องมือ: Copilot in Codespaces
- ไฟล์: specs/001-booking/spec.md
- ผลลัพธ์: สร้างไฟล์ specs/001-booking/plan.md ตาม template ของ prompt
- สถานะของ spec: Draft v2 (ผ่าน clarify แล้ว)
- รายละเอียด: ใช้ FR-BKG-01 ถึง FR-BKG-06, NFR, AC และ assumptions ที่ชัดเจนแล้วเป็นหลัก
- สิ่งที่ยังไม่ได้ตอบ: Q-01 (หมายเลขคิวเริ่มนับจากช่วงเวลาใด/รีเซ็ตหรือไม่) เพื่อรอเจ้าหน้าที่เวชระเบียน

