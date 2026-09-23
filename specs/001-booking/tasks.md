# Tasks: จองคิวตรวจสุขภาพ (Booking)

- Feature: จองคิวตรวจสุขภาพ (Booking)
- Spec ID: SPEC-BKG-001
- อ้างอิง: `specs/001-booking/plan.md` (plan v1)
- วันที่: 2569-09-23
- สรุป: มีทั้งหมด 16 task เรียงตามการพึ่งพาจากโครงสร้างข้อมูล, API, หน้าจอ และการเชื่อมต่อจริง
- มี 7 task ที่ต้องรอคำตอบ `Q-02` เรื่องรูปแบบและวิธีออกหมายเลขคิว

### T-01 สร้างตารางและ migration
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01, FR-BKG-02, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05, T-06 และ T-09
- ไฟล์ที่แตะ: `backend/app/db/models.py`, `backend/app/db/session.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/conftest.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง `slots`, `bookings` และ `audit_logs` ได้ และตาราง `bookings` ไม่มีคอลัมน์เลขบัตรประชาชน
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 ตรวจสิทธิ์ยืนยันตัวตนและค้น HN
- รองรับ: IF-IDP-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-14 และ T-15
- ไฟล์ที่แตะ: `backend/app/auth/idp.py`, `backend/app/his/client.py`, `backend/app/booking/router.py`, `backend/tests/test_auth_his.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: endpoint ตรวจผลจากระบบยืนยันตัวตนก่อนเข้าถึงข้อมูล และ lookup ส่งเลขบัตรไป HIS แล้วคืน HN โดยไม่เก็บเลขบัตร
- สถานะ: พร้อมทำ

### T-03 สร้าง API ค้นหาช่วงเวลาว่าง
- รองรับ: FR-BKG-01, FR-BKG-06, ASM-01, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-10 และ T-14
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/slots/router.py`, `backend/app/main.py`, `backend/tests/test_slots.py`
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `GET /slots` คืนช่วงเวลาภายใน 30 วันพร้อมจำนวนที่นั่งคงเหลือ และคำนวณใหม่เมื่อเปลี่ยน `package_code`
- สถานะ: พร้อมทำ

### T-04 สร้างหน้าจอเลือกแพ็กเกจและช่วงเวลา
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-14
- ไฟล์ที่แตะ: `frontend/src/pages/SlotPicker.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/SlotPicker.test.jsx`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอแสดงช่วงเวลาและที่นั่งคงเหลือจาก API จำลอง และโหลดรายการใหม่เมื่อเปลี่ยนแพ็กเกจ
- สถานะ: พร้อมทำ

### T-05 ทำรายการจองแบบตัดที่นั่งใน transaction
- รองรับ: FR-BKG-04, IF-HIS-01, ASM-02
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_AC_BKG_01.py`
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `test_AC_BKG_01` ผ่าน โดยบันทึกการจอง ตัด `remaining` เป็น 0 และคืนหมายเลขคิวตามกติกาที่ทีมตอบ Q-02
- สถานะ: รอ Q-02

### T-06 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02, ASM-02
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_02.py`
- ต้องทำหลัง: T-01, T-05
- เสร็จเมื่อ: `test_AC_BKG_02` ผ่าน โดยคำขอจองซ้ำถูกปฏิเสธและแสดงหมายเลขคิวเดิม
- สถานะ: รอ Q-02

### T-07 เสนอช่วงเวลาใกล้เคียงเมื่อช่วงเต็ม
- รองรับ: FR-BKG-03, ASM-02
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_AC_BKG_03.py`
- ต้องทำหลัง: T-03, T-05
- เสร็จเมื่อ: `test_AC_BKG_03` ผ่าน โดยคืนสถานะ 409 พร้อมช่วงว่าง 3 ช่วงที่ใกล้ที่สุดในวันเดียวกันและวันถัดไป และไม่สร้างรายการจอง
- สถานะ: รอ Q-02

### T-08 วางคิวส่งข้อความและส่งซ้ำ
- รองรับ: FR-BKG-05, NFR-REL-02, IF-NOT-01, ASM-03
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: `backend/app/notify/queue.py`, `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_04.py`
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: `test_AC_BKG_04` ผ่าน โดยการจองยังถูกบันทึก งานส่งซ้ำถูกวางในคิวภายใน 5 นาที และไม่รอผลการส่งข้อความ
- สถานะ: รอ Q-02

### T-09 บันทึก audit log ทุกการเข้าถึงข้อมูลการจอง
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: `backend/app/audit/middleware.py`, `backend/app/main.py`, `backend/tests/test_AC_BKG_06.py`
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `test_AC_BKG_06` ผ่าน โดย log ระบุผู้เข้าถึง เวลา และ HN และจัดเก็บตามระยะเวลาไม่น้อยกว่า 1 ปี
- สถานะ: พร้อมทำ

### T-10 ทดสอบประสิทธิภาพการค้นหาช่วงเวลา
- รองรับ: NFR-PERF-01, FR-BKG-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_05.py`
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: `test_AC_BKG_05` ยิงคำขอพร้อมกัน 200 รายการและวัด p95 ได้ไม่เกิน 2 วินาทีในเครื่องทดสอบที่กำหนด
- สถานะ: พร้อมทำ

### T-11 สร้างหน้ายืนยันการจองและกรณีช่วงเต็ม
- รองรับ: FR-BKG-03, FR-BKG-04
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/AC-BKG-03.test.jsx`
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: `AC-BKG-03.test.jsx` ผ่าน โดย API จำลองตอบ 409 แล้วหน้าจอแสดง "ช่วงเวลาเต็ม" และตัวเลือก 3 ช่วง
- สถานะ: พร้อมทำ

### T-12 สร้างหน้าผลการจองและหมายเลขคิว
- รองรับ: FR-BKG-04, FR-BKG-05
- ตรวจด้วย: AC-BKG-01, AC-BKG-04
- ไฟล์ที่แตะ: `frontend/src/pages/BookingResult.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/BookingResult.test.jsx`
- ต้องทำหลัง: T-11
- เสร็จเมื่อ: หน้าจอแสดงหมายเลขคิวจาก API จำลองได้ แม้สถานะการส่งข้อความยืนยันล้มเหลว
- สถานะ: รอ Q-02

### T-13 ตั้งค่าการรับส่งข้อมูลผ่าน TLS
- รองรับ: NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-15
- ไฟล์ที่แตะ: `backend/app/config.py`, `backend/app/main.py`, `frontend/vite.config.js`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: การเรียก API ของการจองกำหนดให้ใช้ TLS 1.2 ขึ้นไปในสภาพแวดล้อมที่นำไปใช้งาน
- สถานะ: พร้อมทำ

### T-14 เชื่อมหน้าจอเลือกเวลากับ API จริง
- รองรับ: FR-BKG-01, FR-BKG-06, IF-IDP-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-15
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/pages/SlotPicker.jsx`, `frontend/src/App.jsx`
- ต้องทำหลัง: T-02, T-03, T-04, T-13
- เสร็จเมื่อ: หน้าจอ `SlotPicker` เรียก `GET /slots` ผ่าน `/api` ได้จริงและเปลี่ยนแพ็กเกจแล้วแสดงข้อมูลจาก API ใหม่
- สถานะ: พร้อมทำ

### T-15 เชื่อม workflow จองกับ API จริง
- รองรับ: FR-BKG-02, FR-BKG-03, FR-BKG-04, FR-BKG-05, IF-NOT-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานรวมผลของ AC-BKG-01, AC-BKG-02, AC-BKG-03 และ AC-BKG-04
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/pages/BookingResult.jsx`, `frontend/src/App.jsx`
- ต้องทำหลัง: T-05, T-06, T-07, T-08, T-11, T-12, T-14
- เสร็จเมื่อ: workflow ตั้งแต่เลือกเวลา ยืนยัน จัดการ 409 และแสดงผลการจองทำงานกับ API จริงครบตามสัญญาใน plan.md
- สถานะ: รอ Q-02

### T-16 ทดสอบเวลาทำรายการของผู้ใช้ใหม่
- รองรับ: NFR-USE-01, ASM-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นการตรวจ NFR-USE-01
- ไฟล์ที่แตะ: `frontend/src/__tests__/usability-NFR-USE-01.md`
- ต้องทำหลัง: T-15
- เสร็จเมื่อ: ผู้ทดสอบใหม่ 10 คนทำรายการจองสำเร็จภายใน 3 นาที โดยอย่างน้อย 8 คนไม่ขอความช่วยเหลือ
- สถานะ: รอ Q-02

## ตารางตรวจความครบ

### Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-05, T-12 |
| AC-BKG-02 | T-06 |
| AC-BKG-03 | T-07, T-11 |
| AC-BKG-04 | T-08, T-12 |
| AC-BKG-05 | T-10 |
| AC-BKG-06 | T-09 |

### Constraint ID

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-09 |
| IF-IDP-01 | T-02, T-14 |
| IF-HIS-01 | T-01, T-02, T-14 |
| IF-NOT-01 | T-08, T-15 |

## สิ่งที่ยังไม่ทำ

- Q-02 หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร -> ถามเจ้าหน้าที่เวชระเบียน
  task ที่รอ: T-05, T-06, T-07, T-08, T-12, T-15, T-16
  ส่วนที่เกี่ยวข้องกับวิธีออกเลขคิวและการแสดงเลขคิวจะยังไม่สร้างจนกว่าจะได้คำตอบ
