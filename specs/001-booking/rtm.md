# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 15:53 | test: 6 ผ่าน 1 ไม่ผ่าน (backend), 3 ผ่าน 0 ไม่ผ่าน (frontend)

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 (ตรวจเฉพาะ performance) | T-02 เสร็จ | `backend/app/slots/service.py:list_available_slots`, `backend/app/slots/router.py:get_slots` | `test_AC_BKG_05` ผ่าน แต่ไม่ได้ตรวจ 30 วัน; ไม่มี test ตรวจการแสดงข้อมูลครบ | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 พร้อมทำ | ยังไม่มีโค้ดตาม requirement | ไม่มี test | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05 พร้อมทำ, T-11/T-12 พร้อมทำ | ยังไม่มีโค้ดเสนอช่วงใกล้เคียงหรือหน้าจอยืนยัน | ไม่มี test | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03 เสร็จ, T-06 รอ Q-02 | `backend/app/booking/router.py:create_booking`, `backend/app/booking/service.py:create_booking` | `test_AC_BKG_01` ผ่านแบบอ่อน; `test_TC_BKG_01_1` ผ่าน; `test_TC_BKG_01_2` ไม่ผ่าน; `test_TC_BKG_01_3` ผ่าน; ไม่ตรวจการส่งข้อความ | ช่องโหว่ |
| FR-BKG-05 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีโค้ดคิวแจ้งเตือน/ส่งซ้ำ | ไม่มี test | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02 เสร็จ, T-10 เสร็จ รอทีมตรวจ, T-12 พร้อมทำ | `backend/app/slots/service.py:list_available_slots`, `frontend/src/pages/SlotPicker.jsx:SlotPicker` | `FR-BKG-06 เปลี่ยนแพ็กเกจแล้วโหลดช่วงเวลาใหม่` ผ่าน แต่ไม่มี AC ใน spec | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 เสร็จ | `backend/app/slots/router.py:get_slots` | `test_AC_BKG_05` ผ่าน แต่เรียกแบบวนซ้ำ ไม่ใช่ผู้ใช้พร้อมกัน 200 คนจริง | ช่องโหว่ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task ที่เสร็จ | ไม่พบการบังคับ TLS ใน `backend/app` | ไม่มี test | ช่องโหว่ |
| NFR-REL-02 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีโค้ด retry | ไม่มี test | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task ที่เสร็จ | ไม่พบ usability flow หรือการวัดเวลา | ไม่มี test | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC ตรง ๆ | T-01 เสร็จ | `backend/app/config.py:DATABASE_URL`, `backend/app/db/session.py:engine` | `test_T01_tables_created` ผ่านบน SQLite; ไม่ยืนยัน PostgreSQL | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 พร้อมทำ | มีเพียง `AuditLog` ใน `backend/app/db/models.py:AuditLog`; ไม่พบ middleware บันทึก log | ไม่มี test | ยังไม่ถึง |
| IF-IDP-01 | AC-BKG-01 | T-03 เสร็จ | `backend/app/auth/idp.py:get_verified_hn`, dependency ใน `backend/app/booking/router.py:create_booking` | `test_TC_BKG_01_3_unauthenticated_booking` ผ่าน | ครบ |
| IF-HIS-01 | ไม่มี AC ตรง ๆ | T-01 เสร็จ, T-09 พร้อมทำ | ตาราง `bookings` มี `hn` และไม่มี `national_id`; ไม่พบ HIS lookup | `test_T01_no_national_id` ผ่าน แต่ยังไม่มีการค้น HN จาก HIS | ยังไม่ถึง |
| IF-NOT-01 | AC-BKG-04 | T-07 พร้อมทำ | ไม่พบระบบส่งข้อความแบบ asynchronous | ไม่มี test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/slots/router.py:get_slots` | FR-BKG-01, FR-BKG-06 | ไม่ตรงทั้งหมด | มี endpoint และจำนวนที่นั่ง แต่ service จำกัดช่วงค้นหา 14 วัน ไม่ใช่ 30 วัน และคืนเฉพาะช่วงที่ `remaining > 0` |
| `backend/app/slots/service.py:list_available_slots` | FR-BKG-01, FR-BKG-06 | ไม่ตรงทั้งหมด | `DAYS_AHEAD = 14` ขัดกับ 30 วันใน FR-BKG-01 |
| `backend/app/booking/router.py:create_booking` | FR-BKG-04, IF-IDP-01 | ไม่ตรงทั้งหมด | ตรวจ identity และสร้างการจอง แต่ยังไม่มีการส่งข้อความ และกรณีที่นั่ง 0 ไม่ถูกปฏิเสธ |
| `backend/app/booking/service.py:create_booking` | FR-BKG-04, Q-02 | ไม่ตรงกับ Q-02 | ออกหมายเลข `A001` เองทั้งที่ Q-02 ยังเปิดอยู่ เป็นการเดาคำตอบจากตัวอย่าง |
| `frontend/src/pages/ConfirmBooking.jsx:cancel` | UC-02 | ไม่ตรงกับ scope | ยังมีฟังก์ชันและปุ่มยกเลิกการจอง แม้ backend endpoint ถูกลบแล้ว |
| `backend/app/booking/router.py:BookingRequest` | IF-HIS-01 | ไม่ตรง | รับ `national_id` ใน request และ logger เขียนค่า `national_id` ทั้งที่ flow ตาม spec ให้ค้นผ่าน HIS และอ้างอิงภายในด้วย HN |
| `backend/app/auth/idp.py:get_verified_hn` | IF-IDP-01 | ตรงบางส่วน | ป้องกัน endpoint จองเมื่อไม่มี token แต่เป็น mock prefix ไม่ใช่การรับผลจากระบบยืนยันตัวตนจริง |
| `backend/app/config.py:DATABASE_URL` | CON-TECH-01 | ไม่ตรงค่าเริ่มต้น | ค่า default เป็น SQLite ขณะที่ constraint ระบุ PostgreSQL |
| `backend/app/db/models.py:AuditLog` | DOM-PDPA-01 | ยังไม่ครบ | มีโครงตาราง แต่ไม่มีโค้ดบันทึกทุกการเข้าถึงหรือ retention 1 ปี |
| `frontend/src/api/client.js:api.createBooking` | FR-BKG-04 | ยังไม่ครบ | มี client POST แต่ไม่มีหน้าจอ BookingResult และไม่มีการแสดงเลขคิว |
| `frontend/src/pages/ConfirmBooking.jsx:ConfirmBooking` | FR-BKG-03, UC-02 | ไม่ตรงทั้งหมด | แสดงข้อความ "เต็มแล้ว" และแสดงทางเลือกสูงสุด 2 รายการแทนข้อความ/3 ตัวเลือกตาม spec; ยังมีปุ่มยกเลิกนอก scope |
| `backend/tests/test_AC_BKG_05.py:test_AC_BKG_05` | NFR-PERF-01 | อ่อน | วัด 200 requests แบบลำดับ ไม่ใช่ concurrent users ตามข้อความ requirement |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-01 | ละเมิด Constraint | `backend/app/booking/router.py:BookingRequest`, `create_booking` | IF-HIS-01 | รับ `national_id` ใน booking request และเขียนลง log แม้ spec กำหนดให้ค้นผ่าน HIS และอ้างอิงภายในด้วย HN; ยังไม่มี endpoint HIS lookup | |
| F-02 | ของแถม / อยู่ใน Out of scope | `frontend/src/pages/ConfirmBooking.jsx:cancel` | Out of scope UC-02 | backend endpoint ถูกลบแล้ว แต่หน้าจอยังมีปุ่มและฟังก์ชันยกเลิกการจอง | |
| F-03 | เดา Q-xx | `backend/app/booking/service.py:next_queue_no` | Q-02 | ใช้รูปแบบ `A001` และรีเซ็ตรายวันทั้งที่ Q-02 ยังไม่มีคำตอบ | |
| F-04 | ตัวเลขไม่ตรง spec | `backend/app/slots/service.py:DAYS_AHEAD` | FR-BKG-01 | ใช้ 14 วันแทน 30 วัน | |
| F-05 | ช่องโหว่ / test อ่อน | `backend/app/booking/service.py:create_booking`, `test_TC_BKG_01_2_full_slot` | FR-BKG-03, AC-BKG-01 | เงื่อนไขตรวจเต็มใช้ `< 0` ทำให้ remaining = 0 ยังจองได้; test ล้มเหลวด้วย 201 แทน 409 | |
| F-06 | FR ไม่มี AC | `spec.md` FR-BKG-06 | FR-BKG-06 | ไม่มี AC ที่ตรวจการเปลี่ยนแพ็กเกจแล้วคำนวณช่วงว่างใหม่ | |
| F-07 | FR ไม่มี AC | `spec.md` FR-BKG-01 | FR-BKG-01 | AC-BKG-05 ตรวจเฉพาะ p95 ไม่ได้ตรวจการแสดงวัน ช่วงเวลา และจำนวนที่นั่ง | |
| F-08 | AC ไม่มี test / test อ่อน | `backend/tests/test_AC_BKG_01.py` | AC-BKG-01, FR-BKG-04 | test เดิมตรวจเพียง status 201; test ใหม่ยังไม่ตรวจหมายเลขคิวและการส่งคำขอข้อความ และส่วนหมายเลขคิวถูกเว้นเพราะ Q-02 | |
| F-09 | test อ่อน | `backend/tests/test_AC_BKG_05.py` | NFR-PERF-01, AC-BKG-05 | วัด request แบบ sequential ไม่ใช่ผู้ใช้พร้อมกัน 200 คนตาม requirement | |
| F-10 | โค้ดไม่มี FR | `backend/app` | NFR-SEC-01 | ไม่พบการบังคับ TLS 1.2 ขึ้นไปในโค้ดหรือ test | |
| F-11 | โค้ดไม่มี FR | `backend/app` | FR-BKG-05, NFR-REL-02, IF-NOT-01 | ไม่พบการบันทึก notification, asynchronous queue หรือ retry ภายใน 5 นาที | |
| F-12 | ละเมิด Constraint | `backend/app/config.py` | CON-TECH-01 | default runtime ใช้ SQLite ไม่ใช่ PostgreSQL และ test ไม่ได้ยืนยัน PostgreSQL | |
| F-13 | โค้ดไม่มี FR | `backend/app` | DOM-PDPA-01 | มีเพียงตาราง `audit_logs` ไม่มี middleware/การบันทึกทุก request และ retention ไม่น้อยกว่า 1 ปี | |
| F-14 | ตัวเลขไม่ตรง spec / test อ่อน | `frontend/src/pages/ConfirmBooking.jsx:ConfirmBooking` | FR-BKG-03, AC-BKG-03 | จำกัดทางเลือกด้วย `.slice(0, 2)` จึงแสดงได้สูงสุด 2 รายการ ทั้งที่ spec กำหนด 3 ตัวเลือก และ test ตรวจเพียงมีตัวเลือกมากกว่า 0 | |
| F-15 | ข้อความไม่ตรง spec | `frontend/src/pages/ConfirmBooking.jsx:ConfirmBooking` | FR-BKG-03, AC-BKG-03 | UI แสดง "เต็มแล้ว" แทนข้อความ "ช่วงเวลาเต็ม" ที่ระบุใน AC | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| ไม่มี | ยังไม่มีข้อค้นพบที่แก้ครบทั้งระบบในรอบนี้ | backend endpoint ถูกลบแล้ว แต่ยังพบฟังก์ชันยกเลิกใน frontend จึงคง F-02 ไว้ |
